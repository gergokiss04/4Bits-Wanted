import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCart } from 'react-use-cart';
import { SERVER_PORT } from './Constants';

function Order() {
  const [user, setUser] = useState(null);
  const [shippingPrice, setShippingPrice] = useState(0);

  const {items} = useCart();

  useEffect(() => {
    currentUser();
  }, []);

  const currentUser = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/api/users/self`, {
        credentials: 'include'
      });
      const user = await response.json();
    setUser(user);
    } catch (error) {
      console.error(error);
    }
    
  };

  const handleOrder = async (e) => {
    e.preventDefault();

    try {
      for (const item of items) {
        const buyOfferResponse = await fetch(`http://127.0.0.1:${SERVER_PORT}/api/offers/${item.id}/buy`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
      
        if (!buyOfferResponse.ok) {
          throw new Error(`Hiba történt a ${item.id} ID termék vásárlásakor: ` + await buyOfferResponse.json());
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleShippingPrice = async (e) => {
    switch(e) {
      case "wolfpost":
        setShippingPrice(1490);
        break;
      case "nextday":
        setShippingPrice(1290);
        break;
      case "npm":
        setShippingPrice(1190);
        break;
      case "posta":
        setShippingPrice(900);
        break;
      default:
        setShippingPrice(0);
        break;
    }
  };

  const totalPrice = items.reduce((total, item) => total + item.price, 0);

  return (
    <div className="p-5 m-auto text-center content bg-lavender img-down">
      <div id="order" className="container-fluid text-white scrollspy dark-brown-background-color">
        <div className="container mt-5">
          <h1 className="text-center mb-4">Megrendelés</h1>
          <hr></hr>
          <div className="row">
            <div className="col-md-12">
              <form onSubmit={handleOrder}>
                <div className="mb-3">
                  <label htmlFor="orderName" className="form-label">Megrendelő</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="orderName" 
                    placeholder="Adja meg a megrendelő nevét:"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="orderPhoneNumber" className="form-label">Telefonszám:</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="orderPhoneNumber" 
                    placeholder="Adja meg a megrendelő telefonszámát:"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="orderEmail" className="form-label">E-mail:</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="orderEmail" 
                    placeholder="Adja meg a megrendelő e-mail címét:"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="orderType" className="form-label">Szállítás típusa:</label>
                  <select className="form-select" id="orderType" required onChange={(e) => handleShippingPrice(e.target.value)}>
                    <option value="">Válaszd ki a szállítás típusát:</option>
                    <option value="wolfpost">Wolfpost csomagautomata 1490FT</option>
                    <option value="nextday">Nextday csomagautomata 1290FT</option>
                    <option value="npm">NPM csomagautomata 1190FT</option>               
                    <option value="posta">Postán maradó csomag 990FT</option>
                  </select>
                </div>
                <h2>Végösszeg: {Math.round(totalPrice) + shippingPrice} Ft</h2>
                
                <div className="text-center mt-4">
                  <button type="submit" className="btn btn-primary">Megrendelem</button>
                </div>
              </form>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}

export default Order;