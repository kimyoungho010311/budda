import styles from "./NavBar.module.css";
function NavBarModule() {
  return (
    <div className={styles.nav_bar}>
      <div className={styles.nav_bar_icon}>BUDDA</div>
      <div className={styles.nav_bar_menu}>
        <form>
          <button className={styles.nav_bar_menu_1}>Home</button>
          <button className={styles.nav_bar_menu_1}>Recipe</button>
          <button className={styles.nav_bar_menu_1}>Bundles</button>
          <button className={styles.nav_bar_menu_1}>Blog</button>
        </form>
      </div>
      <div>
        <form>
          <input placeholder={styles.Search} />
        </form>
      </div>
      <div className={styles.nav_bar_log}>
        <form>
          <button className={styles.nav_bar_log_1}>Log in</button>
          <button className={styles.nav_bar_log_2}>Sign up</button>
        </form>
      </div>
    </div>
  );
}

export default NavBarModule;
