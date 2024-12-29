// Product.js
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SERVER_PORT } from './Constants';

function Product({ selectedCategory }) {
  // Statikus termékadatok
  /*const products = [
    { id: 1, name: "Laptop", category: "Műszaki cikkek", price: 299990, image: "", description: "Nagy teljesítményű laptop mindennapi használatra." },
    { id: 2, name: "Regény könyv", category: "Könyvek", price: 3990, image: "", description: "Izgalmas regény a legjobb íróktól." },
    { id: 3, name: "Társasjáték", category: "Társasjáték", price: 12990, image: "", description: "Szórakoztató társasjáték családoknak és barátoknak." },
    { id: 4, name: "Póló", category: "Ruhák", price: 2990, image: "", description: "Kényelmes, mindennapi póló." },
    { id: 5, name: "Okostelefon", category: "Műszaki cikkek", price: 199990, image: "", description: "Kiváló okostelefon nagyszerű funkciókkal." },
    { id: 6, name: "Szakkönyv", category: "Könyvek", price: 4990, image: "", description: "Hasznos szakkönyv, amely mélyíti a tudást." },
    { id: 7, name: "Puzzle", category: "Társasjáték", price: 5990, image: "", description: "Kihívást jelentő puzzle játék." },
    { id: 8, name: "Kabát", category: "Ruhák", price: 15990, image: "", description: "Elegáns téli kabát hideg napokra." }
  ];*/
 
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catId, setCatId] = useState(null);
 
  useEffect(() => {
    
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      let apiURL = `http://127.0.0.1:${SERVER_PORT}/api/offers`;

      if (selectedCategory && selectedCategory !== "Minden") {
        const categoriesResponse = await fetch(`http://127.0.0.1:${SERVER_PORT}/api/categories`);
        const categoriesData = await categoriesResponse.json();
        const parsedCategories = categoriesData.map(category => JSON.parse(category));
        console.log(parsedCategories);
        setCategories("PARSED: " + parsedCategories);

        const category = parsedCategories.find(cat => cat.name === selectedCategory);
        console.log("CAT: " + category.name);
        if (category) {
          setCatId(category.id);
          console.log(catId);
          apiURL += `?filterCategory=${catId}`;
          console.log("UPDATED APIURL:" + apiURL);
        }
      }
      
      const response = await fetch(apiURL);
      console.log("RESPONSE:" + response);
      console.log("APIURL: " + apiURL);
      const ids = await response.json();
      console.log("IDS: " + ids);
      const offerDetailed = await Promise.all(ids.map(id => fetch(`http://127.0.0.1:${SERVER_PORT}/api/offers/${id}`).then(x => x.json())));

      setProducts(offerDetailed);

      console.log("OFFERDATAILED: " + offerDetailed);
    }
    catch(e) {
      console.log(e.message);
    }
  }


  // Szűrt termékek a kiválasztott kategória alapján
  const filteredProducts = catId === null ? products : products.filter(product => product.categoryId == catId);
  console.log("PRODUCTS[0]: " + products[0]);
  console.log("FILTERED: " + filteredProducts);
  return (
        <div className="p-5 text-center content bg-lavender img-down">
        <div
          id="login"
          className="container-fluid text-white scrollspy dark-brown-background-color"
        >
                <h2 className="text-center mb-4">{selectedCategory}</h2>
          <hr />
          <div className="row">
        {filteredProducts.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={product.image}
                className="card-img-top"
                alt={product.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text"><strong>Ár:</strong> {Math.round(product.price)} Ft</p>
                <p className="card-text">{product.description}</p>
              </div>
              <div className="card-footer text-center">
                <button className="btn btn-primary">Megvásárol</button>
              </div>
            </div>
          </div>
        ))}
      </div>
        </div>
      </div>
  );
}

export default Product;