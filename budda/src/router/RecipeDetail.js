import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import HowToUse from "../components/HowToUse/HowToUse";
import "./RecipeDetail.css";

function RecipeDetail() {
  const { id } = useParams(); // URL에서 레시피 ID 가져옴
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleIngredientClick = (ingredientName) => {
    // 쿠팡 검색 URL 생성
    const searchUrl = `https://www.coupang.com/np/search?component=&q=${encodeURIComponent(
      ingredientName
    )}`;

    // 새 탭에서 URL 열기
    window.open(searchUrl, "_blank");
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:5000/recipes/${id}`, {
          method: "GET", // GET 요청
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch recipes: ${response.status}`);
        }
        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
      console.log("Recipe ID : ", id);
    };
    fetchRecipe();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error}</p>;
  if (!recipe) return <p>No recipe found</p>;

  return (
    <div>
      <NavBar />
      <div className="RecipeDetail">
        <div className="wrapp_recipe_info">
          <h1>{recipe.recipeName}</h1>
          <p>{recipe.recipeIntroduction}</p>
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
      <HowToUse />
      <Footer />
    </div>
  );
}

export default RecipeDetail;
