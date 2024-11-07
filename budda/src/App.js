import "./App.css";
import NavBarModule from "./components/NavBar/NavBar";
import Header from "./components/Header/Header";
import Main from "./components/BestRecipe/Main";
import Footer from "./components/Footer/Footer";
function App() {
  return (
    <div className="App">
      <NavBarModule></NavBarModule>
      <Header></Header>

      <Main></Main>
      <Footer></Footer>
    </div>
  );
}

export default App;
