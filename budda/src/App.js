import "./App.css";
import NavBarModule from "./components/NavBar/NavBar";
import Header from "./components/Header/Header";
import HeaderImg from "./img/HealthyFood.png";
import HeaderRightImg from "./img/HeaderRightImg.png";
function App() {
  return (
    <div className="App">
      <NavBarModule></NavBarModule>
      <header className="Header">
        <div className="Header_top">
          <h1 className="Header_top_h1">Cooking fresh, very easy</h1>
          <h5 className="Header_top_h5">
            Find great recipe, order ingredients, start cooking
          </h5>
        </div>
        <div className="Header_bottom">
          <div className="Header_bottom_div">
            <aside className="Header_bottom_aside">
              Have you ever cooked with turmeric? Today's kiick-off is my overly
              delicious turmeric peanut curry with vegetables and rice noodles
            </aside>
            <form className="Header_bottom_form">
              <button className="Header_bottom_form_btn">
                View recipe now
              </button>
            </form>
          </div>
          <img src={HeaderImg} className="Header_bottom_img" />
          <img src={HeaderRightImg} className="Header_right_img" />
        </div>
      </header>
      <div>123123</div>
    </div>
  );
}

export default App;
