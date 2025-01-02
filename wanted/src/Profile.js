import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SERVER_PORT } from './Constants.js';

function Profile() {
  useEffect(() => {
    handleUserName();
  }, []);

  const [userName, setUserName] = useState();

  const handleUserName = async () => {
    const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/api/users/self`);
    const currentUser = await response.json();

    setUserName(currentUser.name);
  };

  return (
    <div className="p-5 m-auto text-center content bg-lavender img-down">
      <div id="profile" className="container-fluid text-white scrollspy dark-brown-background-color">
        <h1 className="text-center mb-4">Profilom</h1>
        <hr />
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <h3>Felhasználónév:</h3>
            <h4 className="fs-5">{userName}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
