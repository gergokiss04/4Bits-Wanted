import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

async function Registry() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  try {
    const checkUser = await fetch(`http://127.0.0.1/api/users/filter=${username}`);
    if (checkUser.ok){
      const userExists = await checkUser.json();
      if (userExists) {
        alert('Foglalt felhasználónév!')
        return;
      }
    }
    const response = await fetch(`http://127.0.0.1/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        login: username,
        pass: password,
      }),
    });

    if (response.ok) {
      alert('sikeres regisztráció');
    }
    else{
      alert('Nem sikerült a regisztráció');
    }
  } catch (error){
    console.error('Hiba a regisztráció során:', error);
  };
  return (
    <div className="p-5 m-auto text-center content bg-lavender img-down">
      <div
        id="register"
        className="container-fluid text-white scrollspy dark-brown-background-color"
      >
        <h1>Regisztráció</h1>
        <p>Csatlakozz, és adj el használt termékeidet díjmentesen</p>
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
