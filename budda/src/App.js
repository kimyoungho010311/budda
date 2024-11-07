import "./App.css";
import NavBarModule from "./components/NavBar/NavBar";
import Header from "./components/Header/Header";
import Main from "./components/BestRecipe/Main";
function App() {
  return (
    <div className="App">
      <NavBarModule></NavBarModule>
      <Header></Header>
      <main>
        <Main></Main>
      </main>
    </div>
  );
}

export default App;
