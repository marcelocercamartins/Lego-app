import { Link } from "react-router-dom"
import {useContext } from 'react'
import { AuthContext } from "../context/auth.context";



function Navbar() {
  const { isLoggedIn } = useContext(AuthContext);
  const { logOutUser } = useContext(AuthContext);
  const user = localStorage.getItem('user');
  const handleLogout = () => {
    logOutUser();
  };
    return (
      
      <header id="header" className="header fixed-top" data-scrollto-offset="0">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <nav id="navbar" className="navbar">
          <div className="logo-container">
            <img
              src="../src/assets/img/logo1.png" 
              alt="Logo"
              className="logo-img"
            />
            </div>
            <ul>
              <li><Link to="/" className="bi bi-chevron-down dropdown-indicator">Home</Link></li>
              <li><Link to="/aboutus" className="nav-link scrollto" href="">About</Link></li>

              <li className="dropdown">
                <Link to="/content" className="bi bi-chevron-down dropdown-indicator">My Posts</Link>
                <ul>
                  <li><Link to ="/createPost" >Create Posts</Link></li>
                  <li><Link to ="/favorites">See Favorites</Link></li>
                </ul>
              </li>
            </ul>
          <i className="bi bi-list mobile-nav-toggle d-none"></i>
        </nav>
      {isLoggedIn ? (
          // If user is logged in, show authenticated content or logout button
          <>
            <Link to="/content" className="btn-getstarted scrollto">Welcome {user}!</Link>
            <button className="logoutButton" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          // If user is not logged in, show login and register buttons
          <>
            <Link to="/signup" className="btn-getstarted scrollto">Register</Link>
            <Link to="/login" className="btn-getlogin scrollto">Login</Link>
          </>
        )}

    </div>
  </header>
    );
  
}
 
export default Navbar;


