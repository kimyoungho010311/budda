import "./Main.css";
import HowToUse from "../HowToUse/HowToUse";
import Footer from "../Footer/Footer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Main() {
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [viewedRecipes, setViewedRecipes] = useState([]);

  useEffect(() => {
    const fetchPopularRecipes = async () => {
      try {
        const response = await fetch("http://localhost:5000/recipes/popular");
        if (!response.ok) {
          throw new Error(
            `Failed to fetch popular recipes: ${response.status}`
          );
        }
        const data = await response.json();
        setPopularRecipes(data);
      } catch (error) {
        console.error("Error fetching popular recipes", error.message);
      }
    };
    const fetchRecentRecipes = async () => {
      try {
        const response = await fetch("http://localhost:5000/recipes/recent");
        if (!response.ok) {
          throw new Error(`Failed to fetch recent recipes: ${response.status}`);
        }
        const data = await response.json();
        setRecentRecipes(data);
      } catch (error) {
        console.error("Error fetching recent recipes:", error.message);
      }
    };
    const fetchViewedRecipes = async () => {
      const recipeIds = JSON.parse(localStorage.getItem("recentRecipes")) || [];
      if (recipeIds.length > 0) {
        try {
          const recipePromises = recipeIds.map((id) =>
            fetch(`http://localhost:5000/recipes/${id}`).then((res) =>
              res.ok ? res.json() : null
            )
          );
          const recipes = (await Promise.all(recipePromises)).filter(Boolean); // 필터링: null 제거
          setViewedRecipes(recipes);
        } catch (error) {
          console.error("Error fetching viewed recipes:", error.message);
        }
      }
    };

    fetchPopularRecipes();
    fetchRecentRecipes();
    fetchViewedRecipes();
  }, []);

  const getSafeImage = (imageUrl) => {
    return imageUrl || "https://via.placeholder.com/150?text=No+Image";
  };

  return (
    <div className="container">
      <h1 className="h1">What is the best cooking recipe?</h1>
      <div className="MainList">
        {popularRecipes.length > 0 ? (
          popularRecipes.map((recipe) => (
            <Link
              to={`/recipes/${recipe._id}`}
              key={recipe._id}
              className="MainListEntity"
            >
              <div className="RecipeCard">
                <img
                  src={getSafeImage(recipe.image)}
                  alt={recipe.recipeName}
                  className="RecipeCardImage"
                />
                <p className="RecipeCardName">{recipe.recipeName}</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="wrapp_loading_message">
            <p>Loading popular recipes...</p>
          </div>
        )}
      </div>
      <h1 className="h1">Recent created cooking recipe</h1>
      <div className="MainList">
        {recentRecipes.length > 0 ? (
          recentRecipes.map((recipe) => (
            <Link
              to={`/recipes/${recipe._id}`}
              key={recipe._id}
              className="MainListEntity"
            >
              <div className="RecipeCard">
                <img
                  src={getSafeImage(recipe.image)}
                  alt={recipe.recipeName}
                  className="RecipeCardImage"
                />
                <p className="RecipeCardName">{recipe.recipeName}</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="wrapp_loading_message">
            <p>Loading recent recipes...</p>
          </div>
        )}
      </div>
      <HowToUse />
      <h1 className="h1">Most Popular chefs</h1>
      <div className="MainList">
        <div className="MainListEntity">+</div>
        <div className="MainListEntity">+</div>
        <div className="MainListEntity">+</div>
        <div className="MainListEntity">+</div>
        <div className="MainListEntity">+</div>
      </div>

      <h1 className="h1">Recently viewed recipes</h1>
      <div className="MainList">
        {viewedRecipes.length > 0 ? (
          viewedRecipes.map((recipe) => (
            <Link
              to={`/recipes/${recipe._id}`}
              key={recipe._id}
              className="MainListEntity"
            >
              <div className="RecipeCard">
                <img
                  src={getSafeImage(recipe.image)}
                  alt={recipe.recipeName}
                  className="RecipeCardImage"
                />
                <p className="RecipeCardName">{recipe.recipeName}</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="wrapp_loading_message">
            <p>Loading recently viewed recipes...</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Main;
