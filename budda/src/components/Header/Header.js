import styles from "./Header.module.css";
import HeaderImg from "../../img/HealthyFood.png";
import HeaderRightImg from "../../img/HeaderRightImg.png";

function Header() {
  return (
    <header className={styles.Header}>
      <div className={styles.Header_top}>
        <h1 className={styles.Header_top_h1}>Cooking fresh, very easy</h1>
        <h5 className={styles.Header_top_h5}>
          Find great recipe, order ingredients, start cooking
        </h5>
      </div>
      <div className={styles.Header_bottom}>
        <div className={styles.Header_bottom_div}>
          <aside className={styles.Header_bottom_aside}>
            Have you ever cooked with turmeric? Today's kiick-off is my overly
            delicious turmeric peanut curry with vegetables and rice noodles
          </aside>
          <form className={styles.Header_bottom_form}>
            <button className={styles.Header_bottom_form_btn}>
              View recipe now
            </button>
          </form>
        </div>
        <img
          src={HeaderImg}
          className={styles.Header_bottom_img}
          alt={HeaderImg}
        />
        <img
          src={HeaderRightImg}
          className={styles.Header_right_img}
          alt={HeaderRightImg}
        />
      </div>
    </header>
  );
}

export default Header;
