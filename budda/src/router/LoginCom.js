import { googleLogout } from "@react-oauth/google";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function LoginCom() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem("accessToken");
    console.log("Access token has been removed.");

    // Google OAuth 로그아웃 처리
    googleLogout();

    // 홈 화면으로 리디렉션
    navigate("/budda");
  };

  return (
    <div>
      <h1>로그인 성공!</h1>
      <Link to="/budda">
        <div style={{ fontSize: "60px" }}>Go to the home</div>
      </Link>
      <button
        onClick={handleLogout}
        style={{ marginTop: "20px", padding: "10px 20px", fontSize: "18px" }}
      >
        Log out
      </button>
    </div>
  );
}

export default LoginCom;
