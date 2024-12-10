import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SERVER_PORT } from './Constants';


function Product({ selectedCategory }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // kategóriák lekérése
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/api/categories`);
        if (!response.ok) {
          throw new Error('Hiba a kategóriák lekérésekor');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Hiba a kategóriák lekérésekor', error);
      }
    };

    fetchCategories();
  }, []);

  // productok lekérése
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/api/offers?page=1&includeSold=false`);
        if (!response.ok) {
          throw new Error('Hálózati hiba');
        }
        const offerIds = await response.json();
        
        const fullOffer = await Promise.all(
          offerIds.map(async (id) => {
            const fullResponse = await fetch(`http://127.0.0.1:${SERVER_PORT}/api/offers/${id}`);
            if (!fullResponse.ok) {
              throw new Error(`Nem sikerült lekérni a ${id} hirdetést`);
            }
            return await fullResponse.json();
          })
        );

        setProducts(fullOffer);
        console.log(fullOffer);
      } catch (error) {
        console.error('Hiba történt a termékek lekérése során', error);
      }
    };

    fetchProducts();
  }, []);

  

  // Kategória index
  const selectedCategoryIndex = categories.findIndex(category => category === selectedCategory);

  // Szűrt termékek a kiválasztott kategória alapján
  const filteredProducts = selectedCategory === "Minden"
    ? products
    : products.filter(product => product.categoryId === selectedCategoryIndex);

  return (
    <div>
      <h1>{selectedCategory}</h1>
      <div className="row">
        {filteredProducts.map((product) => (
          <div key={product.id} className="col-12 col-md-6 col-lg-4">
            <div className="card">
              <img src={`http://127.0.0.1:${SERVER_PORT}/media/${product.pictureUris[0]}`} alt={product.title} className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">Ár: {product.price} Ft</p>
                <p className="card-text">Típus: {product.category}</p>
                <p className="card-text">{product.description}</p>
                <button className="btn btn-primary">Megvásárol</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Product;
