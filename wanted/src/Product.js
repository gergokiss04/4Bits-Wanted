// Product.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Product({ selectedCategory }) {
  // Statikus termékadatok
  const products = [
    { id: 1, name: "Laptop", category: "Műszaki cikkek", price: 299990, image: "", description: "Nagy teljesítményű laptop mindennapi használatra." },
    { id: 2, name: "Regény könyv", category: "Könyvek", price: 3990, image: "", description: "Izgalmas regény a legjobb íróktól." },
    { id: 3, name: "Társasjáték", category: "Társasjáték", price: 12990, image: "", description: "Szórakoztató társasjáték családoknak és barátoknak." },
    { id: 4, name: "Póló", category: "Ruhák", price: 2990, image: "", description: "Kényelmes, mindennapi póló." },
    { id: 5, name: "Okostelefon", category: "Műszaki cikkek", price: 199990, image: "", description: "Kiváló okostelefon nagyszerű funkciókkal." },
    { id: 6, name: "Szakkönyv", category: "Könyvek", price: 4990, image: "", description: "Hasznos szakkönyv, amely mélyíti a tudást." },
    { id: 7, name: "Puzzle", category: "Társasjáték", price: 5990, image: "", description: "Kihívást jelentő puzzle játék." },
    { id: 8, name: "Kabát", category: "Ruhák", price: 15990, image: "", description: "Elegáns téli kabát hideg napokra." }
  ];

  // Szűrt termékek a kiválasztott kategória alapján
  const filteredProducts = selectedCategory === "Minden"
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
        <div className="p-5 m-auto text-center content bg-lavender img-down">
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
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text"><strong>Ár:</strong> {product.price} Ft</p>
                <p className="card-text"><strong>Típus:</strong> {product.category}</p>
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
