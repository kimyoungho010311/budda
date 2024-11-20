import "./Login.css";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function Login() {
  const navigate = useNavigate(); // navigate 훅 생성함
  const handleLoginSeccess = (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const decodedToken = jwtDecode(token);
      //복호화된 JWT 토큰을 로컬스토리지에 저장
      localStorage.setItem("accessToken", token);
      console.log("Login Success!");
      console.log("Decoded Token", decodedToken);
      // 리디렉션 처리함
      navigate("/login/com");
    } catch (error) {
      console.log("Failed to decode Token", error);
    }
  };
  return (
    <div className='LoginPage'>
      <div className='Login'>
        <div className='Login_form'>
          <div className='Login_form_top'>
            <h1 className='Login_form_top_h1'>Welcome to the BUDDA!</h1>
            <p className='Login_form_top_p'>
              Find cooking and share your favorite dishes!
            </p>
          </div>
          <div>
            <h2>Login</h2>
            <GoogleLogin
              onSuccess={handleLoginSeccess}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>
          <div className='LoginInput_div'>
            <Link to="/budda" className='signup'>
              <div>Go to the home</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
