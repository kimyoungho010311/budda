import styles from "./Login.module.css";
import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const clientId = "_lO17vWuodrGZEZlUGOY"; // 네이버에서 발급받은 Client ID를 입력하세요
  const redirectUri = "http://localhost:3000/login/com"; // 리다이렉트 URI를 설정합니다
  const state = "RANDOM_STATE_STRING"; // 보안을 위한 임의 문자열
  const loginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${state}`;
  console.log("Naver Login URL:", loginUrl); // loginUrl을 콘솔에 출력
  const handleKakaoLogin = () => {
    if (window.Kakao && window.Kakao.Auth) {
      window.Kakao.Auth.authorize({
        redirectUri: "http://localhost:3000/login/com",
      });
    } else {
      console.error("Kakao SDK가 초기화되지 않았습니다.");
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
          <div className={styles.LoginInput_div}>
            <a href={loginUrl}>
              <button className={styles.LoginBtn}>네이버로 로그인</button>
            </a>
            <button className={styles.LoginBtn} onClick={handleKakaoLogin}>
              카카오톡으로 로그인
            </button>
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
