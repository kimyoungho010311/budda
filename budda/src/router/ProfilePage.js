import React from "react";
import { jwtDecode } from "jwt-decode"; // jwt-decode 라이브러리 import
import "./Profile.css"; // 스타일링 파일
import NavBarModule from "../components/NavBar/NavBar";

function ProfilePage() {
  // 로컬 스토리지에서 JWT 토큰 가져오기
  const token = localStorage.getItem("token");

  // 토큰이 없는 경우 처리
  if (!token) {
    return <div>로그인 정보가 없습니다. 다시 로그인해주세요.</div>;
  }

  try {
    // 토큰 디코딩
    const userInfo = jwtDecode(token);

    return (
      <div>
        <NavBarModule />
        <div className="wrapp-profile-container">
          <div className="profile-container">
            <h1>User Information</h1>
            <div className="profile-picture">
              <img className="picture" src={userInfo.picture} alt="Profile" />
            </div>
            <div className="profile-details">
              <p>
                <strong>Name:</strong> {userInfo.name}
              </p>
              <p>
                <strong>E-mail:</strong> {userInfo.email}
              </p>
              <p>
                <strong>Google ID:</strong> {userInfo.sub}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    // 토큰 디코딩 오류 처리
    console.error("Failed to decode token:", error);
    return <div>유효하지 않은 토큰입니다. 다시 로그인해주세요.</div>;
  }
}

export default ProfilePage;
