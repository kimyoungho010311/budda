import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const notFoundStyle = {
    textAlign: "center",
    marginTop: "50px",
    fontFamily: "Arial, sans-serif",
  };

  const headingStyle = {
    fontSize: "2.5em",
    color: "#ff0000", // 빨간색
  };

  const paragraphStyle = {
    fontSize: "1.2em",
    color: "#333", // 어두운 회색
  };

  const Linkstyle = {
    color: "black",
    textDecoration: "none",
  };
  return (
    <div style={notFoundStyle}>
      <h1 style={headingStyle}>404 - 페이지를 찾을 수 없습니다. :(</h1>
      <p style={paragraphStyle}>요청하신 페이지가 존재하지 않습니다.</p>
      <Link style={Linkstyle} to="/budda">
        <p>GO TO HOME</p>
      </Link>
    </div>
  );
};

export default NotFound;
