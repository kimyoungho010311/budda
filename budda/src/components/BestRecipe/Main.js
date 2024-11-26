import "./Main.css";
import HowToUse from "../HowToUse/HowToUse";
import Footer from "../Footer/Footer";

function Main() {
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
        <div className="MainListEntity">+</div>
        <div className="MainListEntity">+</div>
        <div className="MainListEntity">+</div>
        <div className="MainListEntity">+</div>
        <div className="MainListEntity">+</div>
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
