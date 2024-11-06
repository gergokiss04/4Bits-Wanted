import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export function Home() {
  return (
    <div>
     <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="img/carousel1.jpg" class="d-block w-100" alt="..."></img>
    </div>
    <div class="carousel-item">
      <img src="img/carousel2.jpg" class="d-block w-100" alt="..."></img>
    </div>
    <div class="carousel-item">
      <img src="img/carousel3.jpg" class="d-block w-100" alt="..."></img>
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
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
