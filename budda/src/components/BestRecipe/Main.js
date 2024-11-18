import styles from "./Main.module.css";
import ProgressRightImg from "../../asset/img/ProgressRightImg.png";
import Footer from "../Footer/Footer";

function Main() {
  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>What is the best cooking recipe?</h1>
      <div className={styles.MainList}>
        <div className={styles.MainListEntity}>+</div>
        <div className={styles.MainListEntity}>+</div>
        <div className={styles.MainListEntity}>+</div>
        <div className={styles.MainListEntity}>+</div>
        <div className={styles.MainListEntity}>+</div>
      </div>
      <h1 className={styles.h1}>Recent created cooking recipe</h1>
      <div className={styles.MainList}>
        <div className={styles.MainListEntity}>+</div>
        <div className={styles.MainListEntity}>+</div>
        <div className={styles.MainListEntity}>+</div>
        <div className={styles.MainListEntity}>+</div>
        <div className={styles.MainListEntity}>+</div>
      </div>
      <div className={styles.show_progress}>
        <div className={styles.show_progress_content}>
          <h4 className={styles.h4}>Find recipes</h4>
          <h6 className={styles.h6}>
            <p>Choose from numerous recipes for all</p> preferneces and diets
          </h6>
        </div>
        <div className={styles.show_progress_content}>
          <h4 className={styles.h4}>Order ingredients online</h4>
          <h6 className={styles.h6}>
            <p>Partner supermarkets supply the ingredients</p> for the selected
            recipes at no extra charge
          </h6>
        </div>
        <div className={styles.show_progress_content}>
          <h4 className={styles.h4}>Cook and enjoy</h4>
          <h6 className={styles.h6}>
            <p>Cook recipes with simple step-by-step</p> instructions
          </h6>
        </div>
        <img
          src={ProgressRightImg}
          className={styles.ProgressRightImg}
          alt="img"
        />
        <div className={styles.show_progress_btn}></div>
      </div>

      <h1 className={styles.h1}>Most Populer chefs</h1>
      <div className={styles.MainList}>
        <div className={styles.MainListEntity}>+</div>
        <div className={styles.MainListEntity}>+</div>
        <div className={styles.MainListEntity}>+</div>
        <div className={styles.MainListEntity}>+</div>
        <div className={styles.MainListEntity}>+</div>
      </div>

      <h1 className={styles.h1}>Recent veiw recipe</h1>
      <div className={styles.MainList}>
        <div className={styles.MainListEntity}>+</div>
        <div className={styles.MainListEntity}>+</div>
        <div className={styles.MainListEntity}>+</div>
        <div className={styles.MainListEntity}>+</div>
        <div className={styles.MainListEntity}>+</div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Main;
