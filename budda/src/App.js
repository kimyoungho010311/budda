import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./router/MainPage";
import RecipePage from "./router/RecipePage";
import LoginPage from "./router/LoginPage";
import NotFound from "./router/NotFound";
import SignUpPage from "./router/SignUpPage";
import Logincom from "./router/LoginCom";

import { GoogleOAuthProvider } from "@react-oauth/google";
const dbConnect = require("./config/dbConnect");

function App() {
  // 데이터베이스 연결 (한 번만 실행)
  useEffect(() => {
    dbConnect();
  }, []);

  return (
    // <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE}>
      <Router>
        <Routes>
          <Route path="/budda" element={<MainPage />} />
          <Route path="/recipe" element={<RecipePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/login/signup" element={<SignUpPage />} />
          <Route path="/login/com" element={<Logincom />} />         

        </Routes>
      </Router>

  );
}

export default App;