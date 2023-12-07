import { NavLink } from "react-router-dom";
import styles from "./PageNav.module.css";
import Logo from "./Logo";
import { useAuth } from "../contexts/FakeAuthContext";
import Button from "./Button";

function PageNav() {
  const {isAuthenticated} = useAuth()
  return (
    <div className={styles.nav}>
        <Logo />
      <ul className="">
        <li>
          <NavLink to="/product">Product</NavLink>
        </li>
        <li>
          <NavLink to="/pricing">Pricing</NavLink>
        </li>
        <li>
          {isAuthenticated ?  <Button type="primary">
            Logined
          </Button> :
           <NavLink className={styles.ctaLink} to="/login">Login</NavLink>}
          
        </li>
      </ul>
    </div>
  );
}

export default PageNav;
