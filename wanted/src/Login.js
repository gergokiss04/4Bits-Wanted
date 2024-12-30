import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SERVER_PORT } from './Constants.js';
import { useAuth } from './AuthContext.js';
import { useCart } from 'react-use-cart';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth(); // Destructure setUser from useAuth
  const { emptyCart } = useCart(); // Destructure emptyCart from useCart

  const handleLogin = async (event) => {
    emptyCart();
    event.preventDefault();

    try {
      const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/api/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: username,
          pass: password,
        }),
        credentials: 'include'
      });

      if (response.ok) {
        setIsLoggedIn(true);
        emptyCart();

        navigate('/');
      } else {
        throw new Error("Nem sikerült bejelentkezni");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="p-5 text-center content bg-lavender img-down">
      <div
        id="login"
        className="container-fluid text-white scrollspy dark-brown-background-color"
      >
        <h1>Bejelentkezés</h1>
        <p>Lépj be, és adj el használt termékeidet díjmentesen</p>
        <hr />

        <form className="d-flex flex-column align-items-center" onSubmit={handleLogin}>
          <div className="mb-3" style={{ width: '100%', maxWidth: '300px' }}>
            <label htmlFor="username" className="form-label">Felhasználónév</label>
            <input 
              type="text" 
              className="form-control" 
              id="username" 
              placeholder="Felhasználónév"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3" style={{ width: '100%', maxWidth: '300px' }}>
            <label htmlFor="password" className="form-label">Jelszó</label>
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              placeholder="Jelszó"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" style={{ maxWidth: '300px' }}>Bejelentkezés</button>
        </form>
      </div>
    </div>
  );
}

export default Login;