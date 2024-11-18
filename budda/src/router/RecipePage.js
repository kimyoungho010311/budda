import NavBarModule from "../components/NavBar/NavBar";
import IntroduceRecipe from "../components/IntoroduceRecipe/IntroduceRecipe";
import Footer from "../components/Footer/Footer";
import React from "react";

function RecipePage() {
  return (
    <div className="App">
      <NavBarModule></NavBarModule>
      <IntroduceRecipe></IntroduceRecipe>
      <Footer></Footer>
    </div>
  );
}

export default RecipePage;
