import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Registry() {
  return (
    <div className="p-5 m-auto text-center content bg-lavender img-down">
      <div
        id="register"
        className="container-fluid text-white scrollspy dark-brown-background-color"
      >
        <h1>Regisztráció</h1>
        <hr />

        <form className="d-flex flex-column align-items-center">
          {/* Felhasználónév mező */}
          <div className="mb-3" style={{ width: '100%', maxWidth: '300px' }}>
            <label htmlFor="username" className="form-label">Felhasználónév</label>
            <input 
              type="text" 
              className="form-control" 
              id="username" 
              placeholder="Felhasználónév"
            />
          </div>

          {/* Email mező */}
          <div className="mb-3" style={{ width: '100%', maxWidth: '300px' }}>
            <label htmlFor="email" className="form-label">Email cím</label>
            <input 
              type="email" 
              className="form-control" 
              id="email" 
              placeholder="Email cím"
            />
          </div>

          {/* Jelszó mező */}
          <div className="mb-3" style={{ width: '100%', maxWidth: '300px' }}>
            <label htmlFor="password" className="form-label">Jelszó</label>
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              placeholder="Jelszó"
            />
          </div>

          {/* Regisztráció gomb */}
          <button type="submit" className="btn btn-primary w-100" style={{ maxWidth: '300px' }}>Regisztráció</button>
        </form>
      </div>
    </div>
  );
}

export default Registry;
