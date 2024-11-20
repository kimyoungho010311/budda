import styles from "./Login.module.css";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // 제대로 동작하려면 소문자로 가져오기
import { sendGoogleToken } from "../../services/authService"; // 백엔드와의 API 통신 함수

function Login() {
  const navigate = useNavigate();

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      console.log("Google Token Received:", token);

      if (!token) {
        console.error("Google credential is missing.");
        return;
      }
  
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);
  
      const response = await sendGoogleToken(token);
  
      if (response.success) {
        console.log("Server Response:", response);
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("user", JSON.stringify(response.user));
  
        console.log("Login Success! Redirecting...");
        navigate("/budda");
      } else {
        console.error("Login failed on server:", response.message);
      }
    } catch (error) {
      console.error("Error during login process:", error);
    }
  };

  return (
    <div className={styles.LoginPage}>
      <div className={styles.Login}>
        <div className={styles.Login_form}>
          <div className={styles.Login_form_top}>
            <h1 className={styles.Login_form_top_h1}>Welcome to the BUDDA!</h1>
            <p className={styles.Login_form_top_p}>
              Find cooking and share your favorite dishes!
            </p>
          </div>
          <div>
            <h2>Login</h2>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>
          <div className={styles.LoginInput_div}>
            <Link to="/budda" className={styles.signup}>
              <div>Go to the home</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
