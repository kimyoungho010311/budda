const User = require('../models/User');
const jwt = require("jsonwebtoken")
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE);

exports.handleGoogleAuth = async (req, res) => {
  const { token } = req.body;

  console.log("Received token:", token);

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.REACT_APP_GOOGLE,
    });

    console.log("Token verified");

    const { sub: googleId, email, name, picture } = ticket.getPayload();
    console.log("Decoded payload:", { googleId, email, name, picture });

    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.create({ googleId, email, name, picture });
      console.log("New user created:", user);
    } else {
      console.log("Existing user found:", user);
    }
    
    const accessToken = jwt.sign(
      { userId: user._id},
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )

    res.status(200).json({
      success: true,
      user: {id: user._id, name: user.name, email: user.email, picture: user.picture},
      accessToken,
    });
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(400).json({ success: false, message: 'Invalid token' });
  }
};
