import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function PostAdd() {

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [mediaStagerInfo, setMediaStagerInfo] = useState({
    imagesLeft: 0,
    uris: []
  });
  const [categories, setCategories] = useState([]);
  //const [productType, setProductType] = useState('');
  //const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, mediastagerResponse] = await Promise.all([
          fetch('http://127.0.0.1/api/categories'),
          fetch('http://127.0.0.1/api/mediastager')
        ]);

        if (!categoriesResponse.ok || !mediastagerResponse.ok) {
          throw new Error('Nem sikerült betölteni a kategóriákat vagy a mediastagert');
        }

        const categoriesData = await categoriesResponse.json();
        const mediastagerData = await mediastagerResponse.json();
        
        setCategories(categoriesData);
        setMediaStagerInfo(mediastagerData);

        setMediaStagerInfo(mediastagerData);

      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, []);

/*  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    for (let file of files) {
      const formData = new FormData();
      formData.append('image', file)

      try {
        const response = await fetch('http://127.0.0.1/api/mediastager', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Nem sikerült a képfeltöltés');
        }

        const mediastagerResponse = await fetch('http://127.0.0.1/api/mediastager');
        const mediastagerData = await mediastagerResponse.json();
        setMediaStagerInfo(mediastagerData);
      } catch (error) {
        console.error(error.message);
      }
    }
  };
*/

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      price: price,
      description: description,
      categoryId: categoryId
    };

    try {
      const response = await fetch('http://127.0.0.1/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offerData)
      });

      if (!response.ok) {
        throw new Error('Nem sikerült a hirdetés feladása!');
      }

      alert('Hirdetés sikeresen feladva');

      setTitle('');
      setPrice('');
      setDescription('');
      setCategoryId('');
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <div className="p-5 m-auto text-center content bg-lavender img-down">
      <div id="postadd" className="container-fluid text-white scrollspy dark-brown-background-color">
        <div className="container mt-5">
          <h1 className="text-center mb-4">Hirdetés feladása</h1>
          <hr></hr>
          <div className="row">
            
            {/* Bal oldali oszlop - Termék adatok */}
            <div className="col-md-6">
              <form onSubmit={handleSubmit}>
                {/* Termék neve */}
                <div className="mb-3">
                  <label htmlFor="productName" className="form-label">Termék neve</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="productName" 
                    placeholder="Add meg a termék nevét"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                {/* Termék típusa - lenyíló menü */}
                <div className="mb-3">
                  <label htmlFor="productType" className="form-label">Termék típusa</label>
                  <select className="form-select" id="productType" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                    <option value="">Válaszd ki a termék típusát</option>
                    {categories.map((categoryName, index) =>(
                      <option key={index} value={index}>categoryName</option>
                    ))}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
