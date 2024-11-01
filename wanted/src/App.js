import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import 'bootstrap/dist/css/bootstrap.min.css';


//function Home() { return <h2>Főoldal</h2>; }
function Electronics() { return <h2>Műszaki cikkek</h2>; }
function Books() { return <h2>Könyvek</h2>; }
function Games() { return <h2>Társasjátékok</h2>; }
function Clothing() { return <h2>Ruhák</h2>; }
function PostAd() { return <h2>Hirdetés feladása</h2>; }
function Login() { return <h2>Bejelentkezés/Regisztráció</h2>; }

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
        <Route path="/post-ad" element={<PostAd />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
