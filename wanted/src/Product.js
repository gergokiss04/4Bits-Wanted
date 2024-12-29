import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SERVER_PORT } from './Constants';
import { useCart } from "react-use-cart";

function Product({ selectedCategory, userId }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catId, setCatId] = useState(null);
  const { addItem } = useCart();

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
        setCategories(parsedCategories);

        const category = parsedCategories.find(cat => cat.name === selectedCategory);
        if (category) {
          setCatId(category.id);
          apiURL += `?filterCategory=${category.id}`;
        }
      }

      const response = await fetch(apiURL);
      const ids = await response.json();
      const offerDetailed = await Promise.all(ids.map(id => fetch(`http://127.0.0.1:${SERVER_PORT}/api/offers/${id}`).then(x => x.json())));

      setProducts(offerDetailed);
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleAddToCart = (product) => {
    addItem(product);
    const cartKey = `cart_${userId}`;
    const existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const updatedCart = [...existingCart, product];
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
  };

  const filteredProducts = catId === null ? products : products.filter(product => product.categoryId == catId);

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
                  <button className="btn btn-primary" onClick={() => handleAddToCart(product)}>Megvásárol</button>
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