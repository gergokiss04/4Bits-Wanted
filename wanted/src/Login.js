import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  return (
    <div className="p-5 m-auto text-center content bg-lavender img-down">
      <div
        id="login"
        className="container-fluid text-white scrollspy dark-brown-background-color"
      >
        <h1>Bejelentkezés</h1>
        <p>Lépj be, és adj el használt termékeidet díjmentesen</p>
        <hr />

        <form className="d-flex flex-column align-items-center">
          <div className="mb-3" style={{ width: '100%', maxWidth: '300px' }}>
            <label htmlFor="username" className="form-label">Felhasználónév</label>
            <input 
              type="text" 
              className="form-control" 
              id="username" 
              placeholder="Felhasználónév"
            />
          </div>
          <div className="mb-3" style={{ width: '100%', maxWidth: '300px' }}>
            <label htmlFor="password" className="form-label">Jelszó</label>
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              placeholder="Jelszó"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" style={{ maxWidth: '300px' }}>Bejelentkezés</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
