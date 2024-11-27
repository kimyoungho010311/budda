import "./Community.css";
import Navbar from "../../components/NavBar/NavBar";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // 백엔드 Socket.IO 서버와 연결

function Community() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  useEffect(() => {
    // 메시지 수신
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // 컴포넌트 언마운트 시 소켓 연결 해제
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("message", input); // 서버로 메시지 전송
      setMessages((prev) => [...prev, `You: ${input}`]);
      setInput("");
    }
  };

  return (
    <div>
      <Navbar />
      <div>
        <h1>커뮤니티 페이지</h1>
        <div className="chat-box">
          {messages.map((msg, index) => (
            <p key={index}>{msg}</p>
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
