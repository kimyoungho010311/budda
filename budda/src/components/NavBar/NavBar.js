import React from "react";
import styles from "./NavBar.module.css";
import { Link } from "react-router-dom";

function NavBarModule() {
  return (
    <div className={styles.nav_bar}>
      <Link to="/budda" className={styles.nav_bar_icon}>
        <div>BUDDA</div>
      </Link>

      <div className={styles.nav_bar_menu}>
        <Link to="/budda" className={styles.nav_bar_menu_1}>
          Home
        </Link>
        <Link to="/recipe" className={styles.nav_bar_menu_1}>
          Recipe
        </Link>
        <Link to="/bundles" className={styles.nav_bar_menu_1}>
          Bundles
        </Link>
        <Link to="/blog" className={styles.nav_bar_menu_1}>
          Blog
        </Link>
      </div>

      <div>
        <form>
          <input placeholder="Search" className={styles.Search} />
        </form>
      </div>

      <div className={styles.nav_bar_log}>
        <Link
          to="/login"
          className={styles.nav_bar_log_1}

          
        >
          Log in
        </Link>
        <Link to="/signup" className={styles.nav_bar_log_2}>
          Sign up
        </Link>
      </div>
    </div>
  );
}

export default NavBarModule;
