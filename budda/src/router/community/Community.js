import "./Community.css";
import Navbar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

const socket = io("http://localhost:5000"); // 백엔드 Socket.IO 서버와 연결

function Community() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보 저장
  const chatBoxRef = useRef(null); // chat-box 참조를 위한 Ref 생성

  useEffect(() => {
    // JWT 토큰에서 사용자 정보 디코딩
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserInfo({
          googleId: decoded.googleId,
          name: decoded.name,
          picture: decoded.picture,
        });
      } catch (error) {
        console.error("Invalid token", error);
      }
    }

    // 메시지 수신
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // 컴포넌트 언마운트 시 소켓 연결 해제
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // 메시지가 추가될 때 스크롤을 아래로 이동
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() && userInfo) {
      const messageData = {
        text: input,
        senderId: userInfo.googleId,
        senderName: userInfo.name,
        userImg: userInfo.picture,
      };
      socket.emit("message", messageData); // 서버로 메시지 전송
      setMessages((prev) => [
        ...prev,
        { ...messageData, self: true }, // 클라이언트에서 보낸 메시지 추가
      ]);
      setInput("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div>
      <Navbar />
      <div className="wrapp">
        <h1>BUDDA - Community</h1>
        <div className="chat-box" ref={chatBoxRef}>
          {" "}
          {/* chat-box에 ref 연결 */}
          {messages.map((msg, index) => (
            <p
              className="chat_content"
              key={index}
              style={{
                textAlign: msg.self ? "right" : "left",
                color: msg.self ? "black" : "black",
              }}
            >
              {!msg.self && ( // 자신이 보낸 메시지가 아닌 경우에만 이미지 표시
                <img
                  src={userInfo.picture}
                  alt={`${userInfo.name}'s profile`}
                  className="userProfileImage_community"
                />
              )}
              {msg.self ? `${userInfo.name} : ${msg.text}` : ` ${msg.text}`}
            </p>
          ))}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown} // 엔터키 이벤트 추가
          placeholder="메시지를 입력하세요"
        />
        <button onClick={sendMessage}>전송</button>
      </div>
      <Footer />
    </div>
  );
}

export default Community;
