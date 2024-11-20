import "./Header.css";
import HeaderImg from "../../asset/img/HealthyFood.png";
import HeaderRightImg from "../../asset/img/HeaderRightImg.png";
import { Link } from "react-router-dom";
function Header() {
  return (
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
            <Link to="/search" className="Header_bottom_form_btn">
              View recipe now
            </Link>
          </form>
        </div>
        <img
          src={HeaderImg}
          className="Header_bottom_img"
          alt={HeaderImg}
        />
        <img
          src={HeaderRightImg}
          className="Header_right_img"
          alt={HeaderRightImg}
        />
      </div>
    </header>
  );
}

export default Header;
