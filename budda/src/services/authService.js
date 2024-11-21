import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Google Token을 서버로 전송
export const sendGoogleToken = async (token) => {
  try {
    console.log("Sending Google Token:", token);
    const response = await api.post(`/auth/google`, { token });
    console.log("Server Response:", response.data);
    return response.data; // 서버에서 반환된 데이터
  } catch (error) {
    console.error("Error sending token to server:", error);
    throw error;
  }
};
