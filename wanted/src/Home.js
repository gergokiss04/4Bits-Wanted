import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export function Home() {
  return (
    <div>
      {/* Carousel */}
      <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner" style={{ height: '50vh' }}>
          <div className="carousel-item active">
            <img src="img/carousel1.jpg" className="d-block w-100 h-100 object-fit-cover" alt="Slide 1" />
          </div>
          <div className="carousel-item">
            <img src="img/carousel2.jpg" className="d-block w-100 h-100 object-fit-cover" alt="Slide 2" />
          </div>
          <div className="carousel-item">
            <img src="img/carousel3.jpg" className="d-block w-100 h-100 object-fit-cover" alt="Slide 3" />
          </div>
        </div>
        
        {/* Carousel Controls */}
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Keresősáv */}
      <div className="p-5 m-auto text-center content bg-lavender img-down">
        <div
          id="login"
          className="container-fluid text-white scrollspy dark-brown-background-color"
        >
          <h1>Milyen terméket keres?</h1>
          <hr />
          <div className="d-flex justify-content-center mt-4">
            <form className="d-flex" role="search">
              <input
                className="form-control me-4"
                type="search"
                placeholder="Keresés..."
                aria-label="Search"
                style={{ maxWidth: '1000px' }}
              />
              <button className="btn btn-outline-light" type="submit">
                Keresés
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
