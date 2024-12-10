import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { SERVER_PORT } from './Constants.js';

function Header() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/api/auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({}),
        });

        if (response.ok){
          setIsLoggedIn(true);
        }
        else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Hiba');
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/api/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
      });

      if (response.ok) {
        setIsLoggedIn(false);
        navigate('/');
      } else {
        console.error('Logout hiba');
      }

    } catch (error) {
      console.error('logout hiba:', error);
    }
  }

  return (
    <header>
      <nav className="navbar navbar-expand-lg headerfootercolor">
        <div className="container-fluid">
          {/* Navbar toggler (mobile view) */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            {/* Bal oldali linkek */}
            <ul className="navbar-nav me-auto">
              {/* Termékek lenyíló menü */}
              <li className="nav-item dropdown">
                <NavLink
                  className="nav-link dropdown-toggle"
                  to="#"
                  id="productsDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Termékek
                </NavLink>
                <ul className="dropdown-menu" aria-labelledby="productsDropdown">
                  <li><NavLink className="dropdown-item" to="/products/electronics">Műszaki cikkek</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/products/books">Könyvek</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/products/games">Társasjátékok</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/products/clothing">Ruhák</NavLink></li>
                </ul>
              </li>

              {/* Hirdetés feladása */}
              <li className="nav-item">
                <NavLink className="nav-link" to="/post-ad">Hirdetés feladása</NavLink>
              </li>
            </ul>
          
            {/* Középen a logó */}
            <NavLink className="navbar-brand mx-auto" to="/">
              <img
                src="../img/logo.jpg"
                alt="Logó"
                width="120"
                height="40"
                className="d-inline-block align-top"
              />
            </NavLink>

            {/* Jobb oldali linkek (Bejelentkezés, Regisztráció vagy bejelentkezve Profil, Kijelentkezés) */}
            <ul className="navbar-nav ms-auto">
              {!isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/login">Bejelentkezés</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/registry">Regisztráció</NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/profile">Profil</NavLink>
                  </li>
                  <li className="nav-item">
                    <button 
                      className="nav-link btn btn-link" 
                      onClick={handleLogout}
                    >
                      Kijelentkezés
                    </button>
                  </li>
                </>
              )}
              <li className="nav-item">   
                <NavLink className="nav-link" to="/basket">
                  <i className="bi bi-basket"></i>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
