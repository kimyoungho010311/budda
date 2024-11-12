import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./router/MainPage";
import RecipePage from "./router/RecipePage";
import LoginPage from "./router/LoginPage";
import NaverCallback from "./router/NaverCallback";
import KakaoCallback from "./router/KakaoCallback";
import NotFound from "./router/NotFound";
import SignUpPage from "./router/SignUpPage";
import Logincom from "./router/LoginCom";
function App() {
  useEffect(() => {
    // Kakao SDK가 로드되었는지 확인하고 초기화
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("e4338341eedf4c69f55dbea502209bd3"); // 여기에 JavaScript 키를 입력
      console.log("Kakao SDK initialized");
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/budda" element={<MainPage />} />
        <Route path="/recipe" element={<RecipePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/callback" element={<NaverCallback />} />
        <Route path="/kakao-callback" element={<KakaoCallback />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login/signup" element={<SignUpPage />} />
        <Route path="/login/com" element={<Logincom />} />
      </Routes>
    </Router>
  );
}

export default App;
