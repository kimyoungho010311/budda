import "./Community.css";
import Navbar from "../../components/NavBar/NavBar";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // 백엔드 Socket.IO 서버와 연결

function Community() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // 서버에서 메시지를 받을 때 처리
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, { text: msg, isOwn: false }]);
    });

    // 컴포넌트 언마운트 시 소켓 연결 해제
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      // 자신이 보낸 메시지 추가
      setMessages((prev) => [...prev, { text: `You: ${input}`, isOwn: true }]);
      socket.emit("message", input); // 서버로 메시지 전송
      setInput(""); // 입력 필드 초기화
    }
  };

  return (
    <div>
      <Navbar />
      <div>
        <h1>커뮤니티 페이지</h1>
        <div className="chat-box">
          {messages.map((msg, index) => (
            <p
              key={index}
              style={{
                textAlign: msg.isOwn ? "right" : "left", // 자신이 보낸 메시지는 오른쪽 정렬
                color: msg.isOwn ? "blue" : "black", // 자신이 보낸 메시지는 파란색
              }}
            >
              {msg.text}
            </p>
          ))}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
}

export default Community;
