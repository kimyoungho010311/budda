const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE);

exports.handleGoogleAuth = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Token is required" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.REACT_APP_GOOGLE,
    });

    const { sub: googleId, email, name, picture } = ticket.getPayload();
    if (process.env.NODE_ENV === "development") {
      console.log("Decoded payload:", { googleId, email, name, picture });
    }

    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.create({ googleId, email, name, picture });
      console.log("New user created:", user);
    } else {
      console.log("Existing user found:", user);
    }

    const accessToken = jwt.sign(
      { userId: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { algorithm: "HS256", expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
      accessToken,
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      console.error("JWT verification failed:", error.message);
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }
    console.error("Error during Google authentication:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
