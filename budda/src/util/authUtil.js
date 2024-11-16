export function setToken(token) {
  localStorage.setItem("accessToken", token);
}

export function getToken() {
  // token 매개변수 제거
  return localStorage.getItem("accessToken"); // 반환값 추가
}

export function removeToken() {
  localStorage.removeItem("accessToken"); // 매개변수 제거
}

export function isAuthenticated() {
  const token = getToken(); // 반환된 토큰을 받아 확인
  return !!token; // 토큰이 있으면 true 반환
}