import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // jwt-decode 라이브러리 import
import "./Profile.css"; // 스타일링 파일
import NavBarModule from "../components/NavBar/NavBar";
import { useParams, useNavigate, Link } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";

const currentUserGoogleId =
  localStorage.getItem("token") && jwtDecode(localStorage.getItem("token")).sub;

function ProfilePage() {
  const { googleId } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
  const [formData, setFormData] = useState({
    name: "",
    picture: null, // Base64 이미지 저장
  });


  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("로그인 정보가 없습니다. 다시 로그인해주세요.");
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserInfo(decoded);

      const fetchUserInfo = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/profile/${googleId}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch user info");
          }

          const data = await response.json();
          setUserInfo(data.user);

          // 폼 데이터 업데이트
          setFormData({
            name: data.user.name || "",
            picture: data.user.picture || null,
          });
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user info:", error.message);
          setError(error.message);
        }
      };

      // 유저가 작성한 레시피 검색
      const fetchUserRecipes = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/recipes/user/${googleId}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch user recipes");
          }

          const data = await response.json();
          setUserRecipes(data);
        } catch (error) {
          console.error("Error fetching user recipes:", error.message);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchUserInfo();
      fetchUserRecipes();
    } catch (err) {
      console.error("Failed to decode token:", err.message);
      setError("유효하지 않은 토큰입니다. 다시 로그인해주세요.");
      setLoading(false);
    }
  }, [googleId]);

  // 파일 변경 핸들러 (프로필 사진)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          picture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 프로필 저장
  const handleSaveChanges = async () => {
    if (!window.confirm("프로필을 수정하시겠습니까?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const payload = {
        name: formData.name,
        picture: formData.picture, // Base64 이미지 전송
      };

      console.log("FormData being sent:", payload);

      const response = await fetch(`http://localhost:5000/profile/${googleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserInfo(updatedUser.user);
        setIsEditing(false);
        alert("프로필이 성공적으로 업데이트되었습니다.");
        navigate(`/profile/${googleId}`);
      } else {
        const errorData = await response.json();
        console.error("Failed to update profile:", errorData);
        alert("프로필 업데이트에 실패했습니다.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("프로필 업데이트 중 오류가 발생했습니다.");
    }
  };

  // 프로필 삭제
  const handleDeleteProfile = async () => {
    if (!window.confirm("정말로 계정을 삭제하시겠습니까?")) return;

    const handleLogout = () => {
      // 로컬 스토리지 모두 제거
      localStorage.clear();
      console.log("Access token has been removed.");
  
      // Google OAuth 로그아웃 처리
      googleLogout();
  
      // 홈 화면으로 리디렉션
      navigate("/budda");
    };

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:5000/profile/${googleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("계정이 성공적으로 삭제되었습니다.");
        handleLogout();
      } else {
        const errorData = await response.json();
        console.error("Failed to delete profile:", errorData);
        alert("계정 삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error("Error deleting profile:", err);
      alert("계정 삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <NavBarModule />
      <div className="wrapp-profile-container">
        <div className="profile-container">
          <h1>셰프 정보</h1>
          <div className="profile-picture">
            {isEditing ? (
              <label htmlFor="file-input">
                <img
                  className="picture"
                  src={
                    formData.picture ||
                    "https://via.placeholder.com/150?text=No+Image"
                  }
                  alt="프로필 사진"
                />
                <input
                  type="file"
                  id="file-input"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <img
                className="picture"
                src={userInfo.picture || "https://via.placeholder.com/150?text=No+Image"}
                alt="프로필 사진"
              />
            )}
          </div>
          <div className="profile-details">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="이름을 입력하세요"
              />
            ) : (
              <p>
                <strong>Name:</strong> {userInfo.name}
              </p>
            )}
            <p>
              <strong>E-mail:</strong> {userInfo.email}
            </p>
            <p>
              <strong>Google ID:</strong> {userInfo.googleId}
            </p>
          </div>
          {currentUserGoogleId === googleId && (
            <div>
            {isEditing ? (
              <>
                <button onClick={handleSaveChanges}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)}>Edit Profile</button>
            )}
            <button onClick={handleDeleteProfile}>Delete Account</button>
          </div>
          )}
        </div>
      </div>
      <div className="user-recipes-container">
        <h2 className="user-recipes-title">{userInfo.name} 님의 레시피</h2>
        {userRecipes.length > 0 ? (
          <div className="recipes-grid">
            {userRecipes.map((recipe) => (
              <Link
                to={`/recipes/${recipe._id}`}
                key={recipe._id}
                className="recipe-card"
              >
                <div className="wrapp_recipe">
                  <img
                    src={
                      recipe.image ||
                      "https://via.placeholder.com/150?text=No+Image"
                    }
                    alt={recipe.recipeName}
                    className="recipe-image"
                  />
                  <p className="recipe-name">{recipe.recipeName}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center" }}>
            This chef haven't uploaded any recipes yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
