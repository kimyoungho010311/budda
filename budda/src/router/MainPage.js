import NavBarModule from "../components/NavBar/NavBar";
import Header from "../components/Header/Header";
import Main from "../components/BestRecipe/Main";

function MainPage() {
  return (
    <div className="App">
      <NavBarModule></NavBarModule>
      <Header></Header>
      <Main></Main>

    </div>
  );
}

export default MainPage;
