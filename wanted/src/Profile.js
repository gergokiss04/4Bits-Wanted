import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SERVER_PORT } from './Constants.js';





function Profile() {
  useEffect(() => {
    handleUserName();
  }, []);

  const [userName, setUserName] = useState();
  const [profilePicUri, setProfilePicUri] = useState('');
  const [mediaStagerInfo, setMediaStagerInfo] = useState({
    imagesLeft: 1,
    uris: []
  });

    const handleImageUpload = async (e) => {
      const files = Array.from(e.target.files);
  
      if (mediaStagerInfo.imagesLeft < files.length) {
        alert(`Maximum ${mediaStagerInfo.imagesLeft} képet tölthet fel.`);
        return;
      }
  
      for (let file of files) {
        const formData = new FormData();
        formData.append('image', file);
  
        try {
          const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/api/mediastager`, {
            method: 'POST',
            body: formData
          });
  
          if (!response.ok) {
            if (response.status === 400) {
              throw new Error('Megtelt a mediastager.');
            }
            throw new Error('Hiba a képfeltöltéskor');
          }
  
          // Mediastager update
          const updatedMediastager = await fetch(`http://127.0.0.1:${SERVER_PORT}/api/mediastager`);
          const mediastagerData = await updatedMediastager.json();
          setMediaStagerInfo(mediastagerData);

          const userResponse = await fetch(`http://127.0.0.1:${SERVER_PORT}/api/users/self`);
          const user = await userResponse.json();

          const profilePicUri = []
          console.log(mediaStagerInfo);
          if(mediaStagerInfo.uris.length != 0) {
            console.log("itt vagyok")
            profilePicUri = mediaStagerInfo.uris[0];
          }
          else {
            alert("Üres a mediastager");
          }
          console.log(profilePicUri);

          const uploadProfilePic = await fetch(`http://127.0.0.1:${SERVER_PORT}/api/users/${user.id}/picture`, {
            method: 'POST',
            body: profilePicUri,
            credentials: 'include'
          });

          if(!uploadProfilePic.ok) {
            throw new Error("Hiba a profilkép feltöltésekor!");
          }
  
          const uploadData = await uploadProfilePic.json();
          console.log("DATA: " + uploadData);
          setProfilePicUri(uploadData.pictureUri);

        } catch (error) {
          console.error('Képfeltöltési hiba:', error.message);
          alert(error.message);
        }
      }
    };

    const handleUserName = async () => {
      const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/api/users/self`);
      const currentUser = await response.json();

      console.log(currentUser.name);
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
            <p className="fs-5">{userName}</p>

            {/* Profilkép megjelenítése */}
            <div className="d-flex justify-content-center mb-5">
              <div
                className="profile-image placeholder-image rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                style={{ width: '150px', height: '150px', color: 'white' }}
              >
                <span>Profilkép</span>
              </div>
            </div>

            {/* Profilkép feltöltése */}
            <div className="mb-5">
              <label htmlFor="images" className="form-label">
                Képek feltöltése (max {mediaStagerInfo.imagesLeft} kép)
              </label>
              <input 
                type="file" 
                className="form-control" 
                id="images"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={mediaStagerInfo.imagesLeft === 0}
              />
              {mediaStagerInfo.imagesLeft === 0 && (
                <div className="text-danger mt-2">
                  A médiaelőkészítő megtelt. Nem tölthet fel több képet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
