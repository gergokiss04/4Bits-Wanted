import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function PostAdd() {
  return (
    <div className="p-5 m-auto text-center content bg-lavender img-down">
      <div id="postadd" className="container-fluid text-white scrollspy dark-brown-background-color">
      <div className="container mt-5">
      <h1 className="text-center mb-4">Hirdetés feladása</h1>
      <hr></hr>
      <div className="row">
        
        {/* Bal oldali oszlop - Termék adatok */}
        <div className="col-md-6">
          <form>
            {/* Termék neve */}
            <div className="mb-3">
              <label htmlFor="productName" className="form-label">Termék neve</label>
              <input 
                type="text" 
                className="form-control" 
                id="productName" 
                placeholder="Add meg a termék nevét"
              />
            </div>

            {/* Termék ára */}
            <div className="mb-3">
              <label htmlFor="productPrice" className="form-label">Termék ára</label>
              <input 
                type="number" 
                className="form-control" 
                id="productPrice" 
                placeholder="Add meg a termék árát (Ft)"
              />
            </div>

            {/* Termék típusa - lenyíló menü */}
            <div className="mb-3">
              <label htmlFor="productType" className="form-label">Termék típusa</label>
              <select className="form-select" id="productType">
                <option value="">Válaszd ki a termék típusát</option>
                <option value="new">Új</option>
                <option value="used">Használt</option>
                <option value="worn">Kopott</option>
                <option value="functional">Működőképes</option>
                <option value="not_working">Nem működik</option>
                <option value="refurbishable">Felújítható</option>
              </select>
            </div>
          </form>
        </div>

        {/* Jobb oldali oszlop - Termék leírása */}
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="productDescription" className="form-label">Termék leírása</label>
            <textarea 
              className="form-control" 
              id="productDescription" 
              rows="8" 
              placeholder="Írj részletes leírást a termékről"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Mentés gomb */}
      <div className="text-center mt-4">
        <button type="submit" className="btn btn-primary">Hirdetés feladása</button>
      </div>
    </div>
      </div>
    </div>
  );
}

export default PostAdd;
