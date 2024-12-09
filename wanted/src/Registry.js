import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SERVER_PORT } from './Constants.js';

function Registry() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function Register() {
    let item = { email: email, login: username, pass: password };
    try {
      let response = await fetch(`http://127.0.0.1:${SERVER_PORT}/api/register`, {
        method: 'POST',
        body: JSON.stringify(item),
        headers: {
          "Content-Type": 'application/json',
          "Accept": 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Hiba miatt nem sikerült a regisztráció!');
      }
    } catch (error) {
      alert(error.message);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    Register();
  };

  return (
    <div className="p-5 m-auto text-center content bg-lavender img-down">
      <div id="register" className="container-fluid text-white scrollspy dark-brown-background-color">
        <h1>Regisztráció</h1>
        <p>Csatlakozz, és adj el használt termékeidet díjmentesen</p>
        <hr />

        <form className="d-flex flex-column align-items-center" onSubmit={handleSubmit}>
          {/* Felhasználónév mező */}
          <div className="mb-3" style={{ width: '100%', maxWidth: '300px' }}>
            <label htmlFor="username" className="form-label">Felhasználónév</label>
            <input 
              type="text" 
              className="form-control" 
              id="username" 
              placeholder="Felhasználónév"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
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
