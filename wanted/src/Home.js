import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import { SERVER_PORT } from './Constants';
import { useState } from 'react';
import { CartProvider, useCart } from "react-use-cart";

export function Home() {
    useEffect(() => { 
    
      fetchOffers();

    }, [])

    const [offers, setOffer] = useState([]);
    const [searchTitle, setSearchTitle] = useState([]);
    const [result, setResult] = useState([]);

    const fetchOffers = async () => {
    try {
      let apiURL = `http://127.0.0.1:${SERVER_PORT}/api/offers/random?count=3`;
      
      const response = await fetch(apiURL);
      console.log("RESPONSE:" + response);
      console.log("APIURL: " + apiURL);
      const ids = await response.json();
      console.log("IDS: " + ids);
      const offerDetailed = await Promise.all(ids.map(id => fetch(`http://127.0.0.1:${SERVER_PORT}/api/offers/${id}`).then(x => x.json())));

      setOffer(offerDetailed);

      console.log("OFFERDATAILED: " + offerDetailed);
    }
    catch(e) {
      console.log(e.message);
    }
  }
  const handleSearch = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/api/offers?filterTitle=${searchTitle}`);

    const foundOffers = await response.json();
    const offerData = await Promise.all(foundOffers.map(id => fetch(`http://127.0.0.1:${SERVER_PORT}/api/offers/${id}`).then(x => x.json())))
    setResult(offerData);
    console.log(foundOffers);
  }

  return (
    <div>
      {/* Carousel */}
      <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="img/carousel1.jpg" className="d-block  object-fit-cover" alt="Slide 1" />
          </div>
          <div className="carousel-item">
            <img src="img/carousel2.jpg" className="d-block  object-fit-cover" alt="Slide 2" />
          </div>
          <div className="carousel-item">
            <img src="img/carousel3.jpg" className="d-block  object-fit-cover" alt="Slide 3" />
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
        <div id="login" className="container-fluid text-white scrollspy dark-brown-background-color">
          <h1>Milyen terméket keres?</h1>
          <hr />
          <div className="d-flex justify-content-center mt-4">
            <form className="d-flex" role="search" onSubmit={handleSearch}>
              <input
                className="form-control me-4"
                type="search"
                placeholder="Keresés..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
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
            {/* Keresési eredmények */}
            {result.length > 0 && (
        <div className="p-5 m-auto text-center content bg-lavender img-down">
          <div id="search-results" className="container-fluid text-white scrollspy dark-brown-background-color">
            <h1>Keresési eredmények</h1>
            <hr />
            <div className="row">
              {result.map((offer) => (
                <div className="col-md-4 mb-4" key={offer.id}>
                  <div className="card h-100 shadow-sm">
                    <img
                      src={offer.image}
                      className="card-img-top"
                      alt={offer.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{offer.title}</h5>
                      <p className="card-text"><strong>Ár:</strong> {Math.round(offer.price)} Ft</p>
                      <p className="card-text">{offer.description}</p>
                    </div>
                    <div className="card-footer text-center">
                      <button className="btn btn-primary">Megvásárol</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="p-5 m-auto text-center content bg-lavender img-down">
        <div id="login" className="container-fluid text-white scrollspy dark-brown-background-color">
          <h1>Kiemelt termékeink</h1>
          <hr />
          <div className="row">
          {offers.map((offer) => (
          <div className="col-md-4 mb-4" key={offer.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={offer.image}
                className="card-img-top"
                alt={offer.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{offer.title}</h5>
                <p className="card-text"><strong>Ár:</strong> {Math.round(offer.price)} Ft</p>
                <p className="card-text">{offer.description}</p>
              </div>
              <div className="card-footer text-center">
                <button className="btn btn-primary">Megvásárol</button>
              </div>
            </div>
          </div>
        ))}
          </div>
        </div>
      </div>

      
    </div>
  );
}

export default Home;
