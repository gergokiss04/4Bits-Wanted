import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Footer() {
  return (
    <footer className="text-center text-dark pt-4 pb-3 headerfootercolor">
      <div className="container">
        {/* Főcím */}
        <h5 className="text-uppercase mb-3">Kapcsolat</h5>
        
        {/* Elérhetőségek */}
        <ul className="list-unstyled">
          <li className="mb-2">
            <strong>Email:</strong> <a href="mailto:wantedsupport@gmail.com" className="text-dark text-decoration-none">wantedsupport@gmail.com</a>
          </li>
          <li className="mb-2">
            <strong>Telefonszám:</strong> <a href="tel:+36123456789" className="text-dark text-decoration-none">+36 1 234 5678</a>
          </li>
          <li className="mb-2">
            <strong>Központ:</strong> 3300 Eger, Fő utca 1.
          </li>
        </ul>

        {/* Alsó sor - Copyright */}
        <div className="pt-3 border-top mt-3">
          <p className="mb-0">&copy; {new Date().getFullYear()} Wanted. Minden jog fenntartva.</p>
          <br />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
