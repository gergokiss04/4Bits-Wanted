import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';

function Basket() {
  return (
    <div className="p-5 m-auto text-center content bg-lavender img-down">
      <div
        id="login"
        className="container-fluid text-white scrollspy dark-brown-background-color"
      >
        <h1>Kosár tartalma</h1>
        <p>Itt jelennek meg azokat a termékek,amiket kosárba helyezett:</p>
        <hr />

        <form className="d-flex flex-column align-items-center">
          <h2>Jelenleg 0 db termék került bele a kosárba</h2>
          <NavLink className="nav-link" to="/login"> <button type="submit" className="btn btn-primary w-100" style={{ maxWidth: '300px' }}>Tovább az adatok megadására</button></NavLink>
        </form>
      </div>
    </div>
  );
}

export default Basket;
