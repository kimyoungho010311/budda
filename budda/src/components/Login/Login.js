import styles from "./Login.module.css";
import React from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
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
          {/* <div>
            <h2>Login</h2>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log("Login Success : ", credentialResponse);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div> */}
          <div className={styles.LoginInput_div}>
            <Link to="/budda" className={styles.signup}>
              <div>Go to the home</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
