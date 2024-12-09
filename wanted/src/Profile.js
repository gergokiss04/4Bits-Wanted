import 'bootstrap/dist/css/bootstrap.min.css';

function Profile() {
  return (
    <div className="p-5 m-auto text-center content bg-lavender img-down">
      <div id="profile" className="container-fluid text-white scrollspy dark-brown-background-color">
        <h1 className="text-center mb-4">Profilom</h1>
        <hr />
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <h3>Felhasználónév:</h3>
            <p className="fs-5">Felhasználónév</p>

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
              <label htmlFor="profileImageUpload" className="form-label">Profilkép feltöltése</label>
              <input
                type="file"
                className="form-control"
                id="profileImageUpload"
                accept="image/*"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
