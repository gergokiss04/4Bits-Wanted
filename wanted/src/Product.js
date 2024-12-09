import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Product({ selectedCategory }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://127.0.0.1/api/offers?page=1&includeSold=false');
        if (!response.ok) {
          throw new Error('Hálózati hiba történt');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Hiba történt a termékek lekérése során', error);
      }
    };

    fetchProducts();
  }, []);

  // Szűrt termékek a kiválasztott kategória alapján
  const filteredProducts = selectedCategory === "Minden"
    ? products
    : products.filter(product => product.categoryId === selectedCategory);

  return (
    <div>
      <h1>{selectedCategory}</h1>
      <div className="row">
        {filteredProducts.map((product) => (
          <div key={product.id} className="col-12 col-md-6 col-lg-4">
            <div className="card">
              <img src={`http://127.0.0.1${product.pictureUris[0]}`} alt={product.title} className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">Ár: {product.price} Ft</p>
                <p className="card-text">Típus: {product.categoryId}</p>
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
