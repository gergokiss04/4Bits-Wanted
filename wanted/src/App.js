import './App.css';
import { NavLink, Routes, Route } from "react-router-dom";
import Home from './Home';


function App() {
  return (
    <div className="App">
      {/*NAVBAR KEZDETE*/}
      <nav className="navbar sticky-top navbar-expand-lg navbar-dark fw-bold shadow-5-strong header-footer-background-image">
        <div className="container-fluid">
          <NavLink
            className="navbar-brand"
            title="brandlogo"
            style={{ textDecoration: "none" }}
            to="/"
            onClick={() => window.scrollTo(0, 0)}
          >
            <img
              src="/img/logo.webp"
              alt=""
              width="200"
              height="40"
              className="d-inline-block align-text-top"
            />
          </NavLink>
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
            <ul className="navbar-nav">
              <NavLink id="fooldal" style={{ textDecoration: "none" }} to="/">
                <li className="nav-item nav-link">Főoldal</li>
              </NavLink>
              <NavLink
                id="konyvajanlo"
                style={{ textDecoration: "none" }}
                to="/bookrecommendation"
              >
                <li className="nav-item nav-link">Termékek</li>
              </NavLink>
            </ul>
          </div>
        </div>
      </nav>
      {/*NAVBAR VÉGE*/}

      {/* Útvonalak */}
      <Routes>
        <Route path="/" element={<Home />} />

      </Routes>

       {/*LÁBLÉC KEZDETE*/}
       <footer className="text-center text-lg-start bg-dark text-muted header-footer-background-image">
        <section>
          <div className="container text-center text-md-start ">
            <div className="row ">
              <div className=" col-auto col-md-auto col-lg-4 col-xl-3 mx-auto mb-4">
                <br></br>
                <h6 className="text-uppercase fw-bold mb-4">
                  <i className="bold-white-color">Wanted</i>
                </h6>
                <p className="bold-white-color">
                  Szeretettel köszöntjük a Wanted honlapján!
                </p>
                <img
                  title="bblogo"
                  decoding="async"
                  src="/img/footerlogo.webp"
                  alt="brand"
                  width="240"
                  height="120"
                />
              </div>
              <div className="col-auto col-md-auto col-lg-4 col-xl-3 mx-auto mb-4">
                <br></br>
                <iframe
                  title="myFrame"
                  decoding="async"
                  src=""
                  width="300"
                  height="200"
                  style={{ border: "0" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div className="col-auto col-md-auto col-lg-4 col-xl-4 mx-auto mb-md-0 mb-4">
                <br></br>
                <h6 className="text-uppercase fw-bold mb-4 bold-white-color">
                  Elérhetőség:
                </h6>
                <ul>
                  <li className="bold-white-color">Telefon: +36 06 403 330</li>
                  <li className="bold-white-color footermargin">
                    E-mail:wantedinfo@gmail.com
                  </li>
                  <li>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      className="bold-white-color none-text-decoration"
                      href="https://uni-eszterhazy.hu/"
                    >
                      <img
                        src="/img/logo.webp"
                        decoding="async"
                        title="logo"
                        alt="brand"
                        width="80"
                        height="80"
                      />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </footer>
      {/*Lábléc vége*/}
    </div>
  );
}

export default App;
