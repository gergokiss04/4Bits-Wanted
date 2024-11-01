import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import Login from './Login';
import Registry from './Registry';
import PostAdd from './PostAdd';
import 'bootstrap/dist/css/bootstrap.min.css';


//function Home() { return <h2>Főoldal</h2>; }
function Electronics() { return <h2>Műszaki cikkek</h2>; }
function Books() { return <h2>Könyvek</h2>; }
function Games() { return <h2>Társasjátékok</h2>; }
function Clothing() { return <h2>Ruhák</h2>; }


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/electronics" element={<Electronics />} />
        <Route path="/products/books" element={<Books />} />
        <Route path="/products/games" element={<Games />} />
        <Route path="/products/clothing" element={<Clothing />} />
        <Route path="/post-ad" element={<PostAdd />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registry" element={<Registry />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
