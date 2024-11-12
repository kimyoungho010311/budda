import styles from "./Login.module.css";
import React, { useState } from "react";

const Login = () => {
  // 상태 정의
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 아이디 입력값을 업데이트하는 함수
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  // 비밀번호 입력값을 업데이트하는 함수
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  // 저장 버튼 클릭 시 호출되는 함수
  const handleSave = () => {
    console.log("저장된 아이디", username);
    console.log("저장된 비밀번호", password);
  };

  return (
    <div className={styles.LoginPage}>
      <div className={styles.Login}>
        <div className={styles.Login_form}>
          <div className={styles.Login_form_top}>
            <h1 className={styles.Login_form_top_h1}>Welcome to the BUDDA!</h1>
          </div>
          <div className={styles.LoginInput_div}>
            <input
              className={styles.LoginInput}
              value={username}
              onChange={handleUsernameChange}
              type="text"
              placeholder="User name"
            />
            <input
              className={styles.LoginInput}
              value={password}
              onChange={handlePasswordChange}
              type="password"
              placeholder="Password"
            />
            <button className={styles.LoginBtn} onClick={handleSave}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
