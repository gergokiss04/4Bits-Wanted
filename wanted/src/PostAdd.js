import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SERVER_PORT } from './Constants.js';

function PostAdd() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [mediaStagerInfo, setMediaStagerInfo] = useState({
    imagesLeft: 1,
    uris: []
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const [categoriesResponse, mediastagerResponse] = await Promise.all([
          fetch(`http://127.0.0.1:${SERVER_PORT}/api/categories`),
          fetch(`http://127.0.0.1:${SERVER_PORT}/api/mediastager`)
        ]);

        console.log('Categories response status:', categoriesResponse.status);

        // Ez most 401-et dob!! azért vannak kommentezve
        console.log('Mediastager response status:', mediastagerResponse.status); 

        /*if (!categoriesResponse.ok || !mediastagerResponse.ok) {
          throw new Error('Nem sikerült betölteni az adatokat');
        }*/

        let categoriesData = await categoriesResponse.json();
        //const mediastagerData = await mediastagerResponse.json();

        console.log('Fetched categories data:', categoriesData);
        //console.log('Fetched mediastager data:', mediastagerData);
        console.log(categoriesData[0]);
        console.log(typeof(categoriesData[0]));

        categoriesData = categoriesData.map(cat => JSON.parse(cat));

        setCategories(categoriesData);
        //setMediaStagerInfo(mediastagerData);

        categories.forEach(cat => {
          console.log(cat.name);
          console.log(cat.id);
        });

      } catch (error) {
        console.error('Inicializálási hiba:', error.message);
        
      }
    };

    fetchInitData();
  }, []);

  // Képfeltöltés
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
        console.log(updatedMediastager);
        const mediastagerData = await updatedMediastager.json();
        setMediaStagerInfo(mediastagerData);

      } catch (error) {
        console.error('Képfeltöltési hiba:', error.message);
        alert(error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validációk
    if (!title || !price || !description || !categoryId) {
      alert('Töltse ki az összes mezőt');
      return;
    }

    if (mediaStagerInfo.uris.length === 0) {
      alert('Legalább egy kép feltöltése kötelező');
      return;
    }

    const offerData = {
      title: title,
      price: parseInt(price),
      description: description,
      categoryId: parseInt(categoryId),
    };

    try {
      const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/api/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offerData)
      });

      if (!response.ok) {
        throw new Error('Nem sikerült a hirdetés feladása');
      }

      alert('Hirdetés sikeresen feladva');
      setTitle('');
      setPrice('');
      setDescription('');
      setCategoryId('');

      const updatedMediastager = await fetch(`http://127.0.0.1:${SERVER_PORT}/api/mediastager`);
      const mediastagerData = await updatedMediastager.json();
      setMediaStagerInfo(mediastagerData);

    } catch (error) {
      console.error('Hirdetésfeladási hiba:', error.message);
      alert('Nem sikerült a hirdetés feladása. Ellenőrizze az adatokat!');
    }
  };

  return (
    <div className="p-5 text-center content bg-lavender img-down">
        <div
          id="postadd"
          className="container-fluid text-white scrollspy dark-brown-background-color"
        >
    <div className="container mt-5">
      <h1 className="text-center mb-4">Hirdetés feladása</h1>
      <hr />
      <form action="/api/mediastager" method="POST" enctype="multipart/form-data">
        <input type="file" id="image" name="image" accept="image/*" required/>
        <button type="submit">Submit</button>
      </form>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            {/* Termék neve */}
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Termék neve</label>
              <input 
                type="text" 
                className="form-control" 
                id="title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Termék ára */}
            <div className="mb-3">
              <label htmlFor="price" className="form-label">Termék ára (Ft)</label>
              <input 
                type="number" 
                className="form-control" 
                id="price" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            {/* Kategória választó */}
            <div className="mb-3">
              <label htmlFor="category" className="form-label">Kategória</label>
              <select 
                className="form-select" 
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Válasszon kategóriát</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            {/* Képfeltöltés */}
            <div className="mb-3">
              <label htmlFor="images" className="form-label">
                Képek feltöltése (max {mediaStagerInfo.imagesLeft} kép)
              </label>
              <input 
                type="file" 
                className="form-control" 
                id="images"
                multiple
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

          <div className="col-md-6">
            {/* Termék leírása */}
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Termék leírása</label>
              <textarea 
                className="form-control" 
                id="description" 
                rows="8"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Feltöltött képek előnézete */}
            {mediaStagerInfo.uris.length > 0 && (
              <div className="mb-3">
                <label className="form-label">Feltöltött képek</label>
                <div className="d-flex flex-wrap">
                  {mediaStagerInfo.uris.map((uri, index) => (
                    <img 
                      key={index} 
                      src={`/api/media/${uri}`} 
                      alt={`Feltöltött kép ${index + 1}`} 
                      className="img-thumbnail m-1" 
                      style={{width: '100px', height: '100px', objectFit: 'cover'}} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-4">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={mediaStagerInfo.uris.length === 0}
          >
            Hirdetés feladása
          </button>
        </div>
      </form>
    </div>
    </div>
    </div>
  );
}

export default PostAdd;