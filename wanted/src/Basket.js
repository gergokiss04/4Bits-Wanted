import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';
import { useCart } from "react-use-cart";

function Basket() {
  const { items, isEmpty, totalItems, removeItem } = useCart();

  // Calculate the total price
  const totalPrice = items.reduce((total, item) => total + item.price, 0);

  return (
    <div className="p-5 text-center content bg-lavender img-down">
      <div
        id="basket"
        className="container-fluid text-white scrollspy dark-brown-background-color"
      >
        <h1>Kosár tartalma</h1>
        <p>Itt jelennek meg azokat a termékek, amiket kosárba helyezett:</p>
        <hr />

        {isEmpty ? (
          <h2>Jelenleg 0 db termék került bele a kosárba</h2>
        ) : (
          <div>
            <h2>Jelenleg {totalItems} db termék került bele a kosárba</h2>
            <ul className="list-group">
              {items.map((item, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h5>{item.title}</h5>
                    <p>{item.description}</p>
                    <p><strong>Ár: {Math.round(item.price)} Ft</strong></p>
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeItem(item.id)}>Eltávolítás</button>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <h3>Összesen fizetendő: {Math.round(totalPrice)} Ft</h3>
            </div>
          </div>
        )}

        <br />
        <NavLink
          className="nav-link"
          to={{
            pathname: "/order",
            state: { items, totalPrice }
          }}
        >
          <button type="submit" className="btn btn-primary w-100" style={{ maxWidth: '300px' }}>
            Tovább az adatok megadására
          </button>
        </NavLink>
      </div>
    </div>
  );
}

export default Basket;