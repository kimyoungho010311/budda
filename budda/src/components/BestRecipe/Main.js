import "./Main.css";
import HowToUse from "../HowToUse/HowToUse";
import Footer from "../Footer/Footer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Main() {
  const [recentRecipes, setRecentRecipes] = useState([]);

  useEffect(() => {
    const fetchRecentRecipes = async () => {
      try {
        const response = await fetch("http://localhost:5000/recipes/recent");
        if (!response.ok) {
          throw new Error("Failed to fetch recent recipes");
        }
        const data = await response.json();
        setRecentRecipes(data);
      } catch (error) {
        console.error("Error fetching recent recipes:", error.message);
      }
    };

    fetchRecentRecipes();
  }, []);

  return (
    <div className="container">
      <h1 className="h1">What is the best cooking recipe?</h1>
      <div className="MainList">
        <div className="MainListEntity">+</div>
        <div className="MainListEntity">+</div>
        <div className="MainListEntity">+</div>
        <div className="MainListEntity">+</div>
        <div className="MainListEntity">+</div>
      </div>
      <h1 className="h1">Recent created cooking recipe</h1>
      <div className="MainList">
        {recentRecipes.length > 0 ? (
          recentRecipes.map((recipe) => (
            <Link to={`/recipes/${recipe._id}`} key={recipe._id} className="MainListEntity">
              <div className="RecipeCard">
                <img
                  src={recipe.image || "https://via.placeholder.com/150"}
                  alt={recipe.recipeName}
                  className="RecipeCardImage"
                />
                <p className="RecipeCardName">{recipe.recipeName}</p>
              </div>
            </Link>
          ))
        ) : (
          <p>Loading recent recipes...</p>
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
        <div className="MainListEntity">+</div>
        <div className="MainListEntity">+</div>
        <div className="MainListEntity">+</div>
        <div className="MainListEntity">+</div>
        <div className="MainListEntity">+</div>
      </div>
      <Footer />
    </div>
  );
}

export default Main;
