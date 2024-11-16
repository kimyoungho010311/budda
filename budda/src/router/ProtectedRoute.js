import { Navigate } from "react-router";
import { isAuthenticated } from "../util/authUtil";

const ProtectedRoute = ({ children }) => {
  // 로그인 여부 확인
  const isAuth = isAuthenticated();

  return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
