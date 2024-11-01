import React from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Header() {
  return (
    <header>
      <nav className="navbar navbar-expand-lg headerfootercolor">
        <div className="container-fluid">
          {/* Bal oldalon a Termékek és Hirdetés feladása */}
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
                src="img/logo.jpg"
                alt="Logó"
                width="120"
                height="40"
                className="d-inline-block align-top"
              />
            </NavLink>

            {/* Jobb oldalon a Bejelentkezés/Regisztráció */}
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">Bejelentkezés/Regisztráció</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
