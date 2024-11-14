import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Order() {
  return (
    <div className="p-5 m-auto text-center content bg-lavender img-down">
      <div id="order" className="container-fluid text-white scrollspy dark-brown-background-color">
      <div className="container mt-5">
      <h1 className="text-center mb-4">Megrendelés</h1>
      <hr></hr>
      <div className="row">
        

        <div className="col-md-12">
          <form>
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
              <label htmlFor="orderType" className="form-label">Termék típusa:</label>
              <select className="form-select" id="orderType" required>
                <option value="">Válaszd ki a szállítás típusát:</option>
                <option value="foxpost">Foxpost csomagautomata 1490FT</option>
                <option value="sameday">Sameday csomagautomata 1290FT</option>
                <option value="mpl">MPL csomagautomata 1190FT</option>               
                <option value="posta">Postán maradó csomag 990FT</option>
              </select>
            </div>
            <h2>Végösszeg:0Ft</h2>
          </form>
        </div>
   
      </div>

      <div className="text-center mt-4">
        <button type="submit" className="btn btn-primary">Megrendelem</button>
      </div>
    </div>
      </div>
    </div>
  );
}

export default Order;
