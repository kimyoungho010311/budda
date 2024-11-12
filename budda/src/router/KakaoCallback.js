import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code && window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init("e4338341eedf4c69f55dbea502209bd3"); // 초기화가 안 되어 있으면 초기화
        console.log("Kakao SDK initialized");
      }

      window.Kakao.Auth.login({
        success: (authObj) => {
          const accessToken = authObj.access_token;
          console.log("Kakao Access Token:", accessToken);

          // 사용자 정보 요청
          fetch("https://kapi.kakao.com/v2/user/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
            .then((res) => res.json())
            .then((userData) => {
              console.log("Kakao User Info:", userData);
              if (userData.id) {
                console.log("로그인 성공:", userData);
                localStorage.setItem("kakaoUserInfo", JSON.stringify(userData)); // 로컬 스토리지에 저장
                navigate("/login/com");
              } else {
                console.error("로그인 실패:", userData);
              }
            })
            .catch((error) =>
              console.error("Error fetching user info:", error)
            );
        },
        fail: (err) => {
          console.error("Kakao login failed", err);
        },
      });
    }
  }, [navigate]);

  return <h2>카카오 로그인 중...</h2>;
};

export default KakaoCallback;
