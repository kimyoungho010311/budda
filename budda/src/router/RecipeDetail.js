import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import HowToUse from "../components/HowToUse/HowToUse";
import { jwtDecode } from "jwt-decode";
import "./RecipeDetail.css";
import { useNavigate } from "react-router-dom";

function RecipeDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const handleIngredientClick = (ingredientName) => {
    const searchUrl = `https://www.coupang.com/np/search?component=&q=${encodeURIComponent(
      ingredientName
    )}`;
    window.open(searchUrl, "_blank");
  };

  const currentUserGoogleId =
    localStorage.getItem("token") &&
    jwtDecode(localStorage.getItem("token")).sub;

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:5000/recipes/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch recipe: ${response.status}`);
        }
        const recipeData = await response.json();
        setRecipe(recipeData);
        setLikes(recipeData.likes?.length || 0);
        setHasLiked(recipeData.likes?.includes(currentUserGoogleId) || false);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("레시피를 삭제하시겠습니까?")) {
      try {
        const response = await fetch(`http://localhost:5000/recipes/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("삭제가 완료되었습니다.");
          navigate("/search");
        } else {
          alert("삭제에 실패하였습니다.");
        }
      } catch (error) {
        console.error("삭제에 실패하였습니다:", error);
      }
    }
  };

  const handleUpdate = () => {
    navigate(`/recipes/edit/${id}`, { state: { recipe } }); // 수정 페이지로 이동
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error}</p>;
  if (!recipe) return <p>No recipe found</p>;

  const handleLike = async () => {
    const token = localStorage.getItem("accessToken"); // 서버에서 발급한 JWT
    if (!currentUserGoogleId) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 좋아요 취소 확인 메시지
    if (hasLiked && !window.confirm("좋아요를 취소하시겠습니까?")) {
      return;
    }
    console.log(`------------------------------------------------`);
    console.log("좋아요 요청 전송: AccessToken:", token);
    console.log("좋아요 요청 전송: UserID:", currentUserGoogleId);
    console.log("Token:", token);
    console.log("UserID:", currentUserGoogleId);
    console.log(`------------------------------------------------`);

    try {
      const response = await fetch(`http://localhost:5000/recipes/${id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Authorization 헤더에 JWT 포함
        },
        body: JSON.stringify({ userId: currentUserGoogleId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("좋아요 처리 실패:", errorData);
        throw new Error("Failed to update likes");
      }

      const data = await response.json();
      setLikes(data.likes);
      setHasLiked(data.hasLiked);
    } catch (err) {
      console.error("Error updating like:", error.message);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="RecipeDetail">
        <div className="wrapp_recipe_info">
          <h1>{recipe.recipeName}</h1>
          <p>{recipe.recipeIntroduction}</p>
          {userInfo && (
            <div className="userInfo">
              <img
                src={userInfo.picture}
                alt={`${userInfo.name}'s profile`}
                className="userProfileImage"
              />
              <h3>{userInfo.name}</h3>
            </div>
          )}
        </div>
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.recipeName}
            className="recipeImage"
          />
        ) : (
          <p>No image available</p>
        )}
        <div className="wrapp_catgoreis_info">
          <div className="categories">
            <h3>Categories</h3>
            <div className="wrapp_categories_info">
              <p>Type: {recipe.categories?.type}</p>
              <p>Situation: {recipe.categories?.situation}</p>
              <p>Ingredient: {recipe.categories?.ingredient}</p>
            </div>
          </div>

          <div className="info">
            <h3>Info</h3>
            <div className="info_wrapp_info">
              <p>Count: {recipe.info?.count}</p>
              <p>Time: {recipe.info?.time}</p>
              <p>Difficulty: {recipe.info?.difficulty}</p>
            </div>
          </div>
        </div>

        <div className="ingredients">
          <h3>Ingredients</h3>
          <ul>
            <div className="wrapp_ingredients">
              {recipe.ingredients?.map((ingredient, index) => (
                <div key={index} className="wrapp_ingredients_index">
                  {ingredient.name} : {ingredient.quantity} {ingredient.unit}{" "}
                  {ingredient.note}{" "}
                  <button
                    className="ingredient_btn"
                    onClick={() => handleIngredientClick(ingredient.name)}
                  >
                    재료 구매하기
                  </button>
                </div>
              ))}
            </div>
          </ul>
        </div>

        <div className="steps">
          <h3>Steps</h3>
          <div dangerouslySetInnerHTML={{ __html: recipe.steps }} />
        </div>
      </div>
      <div className="wrapp_btns">
        {currentUserGoogleId === recipe.userId && (
          <>
            <button className="btn" onClick={handleDelete}>
              Delete
            </button>
            <button className="btn" onClick={handleUpdate}>
              Update
            </button>
          </>
        )}
      </div>
      <div className="like-btn">
        <button onClick={handleLike}>
          {hasLiked ? "👍 Unlike" : "👍 Like"} {likes}
        </button>
      </div>
      <HowToUse />
      <Footer />
    </div>
  );
}

export default RecipeDetail;
