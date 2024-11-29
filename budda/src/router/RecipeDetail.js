import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import HowToUse from "../components/HowToUse/HowToUse";
import { jwtDecode } from "jwt-decode";
import "./RecipeDetail.css";

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const handleIngredientClick = (ingredientName) => {
    const searchUrl = `https://www.coupang.com/np/search?component=&q=${encodeURIComponent(
      ingredientName
    )}`;
    window.open(searchUrl, "_blank");
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:5000/recipes/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch recipe: ${response.status}`);
        }
        const recipeData = await response.json();
        setRecipe(recipeData);

        if (recipeData.userId) {
          const userResponse = await fetch(
            `http://localhost:5000/user/${recipeData.userId}`
          );
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUserInfo(userData.user);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/recipes/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Recipe deleted successfully");
        window.location.href = "/";
      } else {
        alert("Failed to delete recipe");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const handleUpdate = () => {
    alert("Update feature is not implemented yet.");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error}</p>;
  if (!recipe) return <p>No recipe found</p>;

  const currentUserGoogleId =
    localStorage.getItem("token") &&
    jwtDecode(localStorage.getItem("token")).googleId;

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
              <p>작성자: {userInfo.name}</p>
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
      <HowToUse />
      <Footer />
    </div>
  );
}

export default RecipeDetail;
