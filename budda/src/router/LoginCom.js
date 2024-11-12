import { Link } from "react-router-dom";

function LoginCom() {
  return (
    <div>
      <h1>로그인 성공!</h1>
      <Link to="/budda">
        <div style={{ fontSize: "60px" }}>Go to the home</div>
      </Link>
    </div>
  );
}

export default LoginCom;
