import React from "react";
import "./NavBar.css";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../../util/authUtil";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function NavBarModule() {
  const navigate = useNavigate();

  const handleRecipeClick = (e) => {
    if (!isAuthenticated()) {
      e.preventDefault(); // 기본동작 막기
      alert("You need to Login. move to the LoginPage");
      navigate("/login");
    }
  };

  const handleLogout = () => {
    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem("accessToken");
    console.log("Access token has been removed.");

    // Google OAuth 로그아웃 처리
    googleLogout();

    // 홈 화면으로 리디렉션
    navigate("/budda");
  };

  // 현재 사용자의 googleId 가져오기
  const getGoogleId = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.userId; // Google ID 추출
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  };

  const googleId = getGoogleId();

  return (
    <div className="nav_bar">
      <Link to="/budda" className="nav_bar_icon">
        <div>BUDDA</div>
      </Link>

      <div className="nav_bar_menu">
        <Link to="/budda" className="nav_bar_menu_1">
          Home
        </Link>
        <Link
          to="/recipe"
          className="nav_bar_menu_1"
          onClick={handleRecipeClick}
        >
          Recipe
        </Link>
        <Link to="/community" className="nav_bar_menu_1">
          Community
        </Link>
        <Link to="/blog" className="nav_bar_menu_1">
          Blog
        </Link>
      </div>
      <div>
        <Link to="/search" className="Search">
          Search some recipe...
        </Link>
      </div>

      <div className="nav_bar_log">
        {isAuthenticated() ? (
          <div className="warppbtns">
            <button onClick={handleLogout} className="nav_bar_logout link-style">
              Log out
            </button>
            <Link to={`/profile/${googleId}`} className="nav_bar_logout">
              Profile
            </Link>
          </div>
        ) : (
          <>
            <Link to="/login" className="nav_bar_log_1">
              Log in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default NavBarModule;
