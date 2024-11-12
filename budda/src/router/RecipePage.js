import NavBarModule from "../components/NavBar/NavBar";
import IntroduceRecipe from "../components/IntoroduceRecipe/IntroduceRecipe";
import IngredientInfo from "../components/IngredientInfo/IngredientInfo";
import HowToCook from "../components/HowToCook/HowToCook";
import React from "react";

function RecipePage() {
  return (
    <div className="App">
      <NavBarModule></NavBarModule>
      <IntroduceRecipe></IntroduceRecipe>
      <IngredientInfo></IngredientInfo>
      <HowToCook></HowToCook>
    </div>
  );
}

export default RecipePage;
