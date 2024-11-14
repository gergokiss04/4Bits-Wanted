import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import Login from './Login';
import Registry from './Registry';
import PostAdd from './PostAdd';
import 'bootstrap/dist/css/bootstrap.min.css';
import Product from './Product';
import Profile from './Profile';
import Basket from './Basket';
import Order from './Order';


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/electronics" element={<Product selectedCategory="Műszaki cikkek" />} />
        <Route path="/products/books" element={<Product selectedCategory="Könyvek" />} />
        <Route path="/products/games" element={<Product selectedCategory="Társasjáték" />} />
        <Route path="/products/clothing" element={<Product selectedCategory="Ruhák" />} />
        <Route path="/post-ad" element={<PostAdd />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registry" element={<Registry />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/order" element={<Order />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
