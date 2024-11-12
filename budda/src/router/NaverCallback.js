import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NaverCallback = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보를 상태로 관리

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    // 실제 네이버 Client ID와 Client Secret 입력
    const clientId = "_lO17vWuodrGZEZlUGOY";
    const clientSecret = "nSRTDfPjM_";
    const redirectUri = "http://localhost:3000/login/com"; // 등록한 Redirect URI와 일치해야 합니다

    if (code) {
      // 네이버 OAuth 서버에서 액세스 토큰 가져오기
      fetch(
        `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&code=${code}&state=${state}`,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          const accessToken = data.access_token;
          console.log("Naver Access Token:", accessToken);

          if (accessToken) {
            // 액세스 토큰으로 네이버 사용자 정보 요청
            fetch("https://openapi.naver.com/v1/nid/me", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            })
              .then((res) => res.json())
              .then((userData) => {
                if (userData.response) {
                  console.log("로그인 성공:", userData.response);
                  setUserInfo(userData.response); // 상태에 사용자 정보 저장
                  // 로컬 스토리지에 저장하여 로그인 상태 유지
                  localStorage.setItem(
                    "naverUserInfo",
                    JSON.stringify(userData.response)
                  );
                  navigate("/login/com"); // 로그인 성공 후 메인 페이지로 이동
                } else {
                  console.error("로그인 실패:", userData);
                }
              })
              .catch((error) => console.error("Error:", error));
          } else {
            console.error("Access Token이 없습니다.");
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [navigate]);

  return (
    <div>
      <h2>네이버 로그인 중...</h2>
      {userInfo && (
        <div>
          <h3>로그인된 사용자 정보:</h3>
          <p>이름: {userInfo.name}</p>
          <p>이메일: {userInfo.email}</p>
          <img src={userInfo.profile_image} alt="프로필 이미지" />
        </div>
      )}
    </div>
  );
};

export default NaverCallback;
