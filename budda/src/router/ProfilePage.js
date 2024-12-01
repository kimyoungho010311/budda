import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // jwt-decode 라이브러리 import
import "./Profile.css"; // 스타일링 파일
import NavBarModule from "../components/NavBar/NavBar";
import { useParams, Link } from "react-router-dom";

function ProfilePage() {
  const { googleId } = useParams();
  const [userInfo, setUserInfo] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        } catch (error) {
          console.error("Error fetching user info:", error.message);
          setError(error.message);
        } finally {
          setLoading(false);
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

  return (
    <div>
      <NavBarModule />
      <div className="wrapp-profile-container">
        <div className="profile-container">
          <h1>셰프 정보</h1>
          <div className="profile-picture">
            <img className="picture" src={userInfo.picture} alt="Profile" />
          </div>
          <div className="profile-details">
            <p>
              <strong>Name:</strong> {userInfo.name}
            </p>
            <p>
              <strong>E-mail:</strong> {userInfo.email}
            </p>
            <p>
              <strong>Google ID:</strong> {userInfo.sub}
            </p>
          </div>
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
                <div>
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
            You haven't uploaded any recipes yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
