import Link from "next/link";
import styles from "@/styles/Header.module.css";

const Header = () => {
  return (
    <div className={styles.nav}>
      <div>
        <Link className={styles.menuLink} href="/home">
          Home
        </Link>
        <Link className={styles.menuLink} href="/wines">
          Wines
        </Link>
      </div>
      <div>
        <Link href="/settings" className={styles.menuLink}>
          Settings
        </Link>
      </div>
    </div>
  );
};

export default Header;
