import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Book, User, ShoppingCart, LogOut, LogIn, Menu, X } from "lucide-react";
import "../styles/Navbar.css";

export default function Navbar(): React.ReactElement {
  const { user, logout ,isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className={`navbar-container ${isOpen ? "open" : ""}`}>
      <div className="navbar">
        <div className="navbar-header">
          <div className="navbar-logo" onClick={() => navigate("/")}>
            📚 <span>BiblioApp</span>
          </div>
          <button className="navbar-toggle" style={{ background: 'transparent' }} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24}/>}
          </button>
        </div>

        <div className={`navbar-content ${isOpen ? "show" : ""}`}>
          <div className="navbar-menu-wrapper">
            <ul className="navbar-links">
              <li>
                <Link to={isAuthenticated ? "/livres" : "/"} onClick={() => setIsOpen(false)}>
                  <Book size={18} /> Livres
                </Link>
              </li>
              <li>
                <Link to="/auteurs" onClick={() => setIsOpen(false)}>
                  <User size={18} /> Auteurs
                </Link>
              </li>
              {user && user.role === "USER" && (
                <li>
                  <Link to="/mes-achats" onClick={() => setIsOpen(false)}>
                    <ShoppingCart size={18} /> Mes Achats
                  </Link>
                </li>
              )}
            </ul>
            <div className="navbar-user-actions">
              {user ? (
                <>
                  <span className="user-name">👤 {user.nom}</span>
                  <button onClick={handleLogout} className="logout-button">
                    <LogOut size={18} /> Déconnexion
                  </button>
                </>
              ) : (
                <Link to="/login" className="login-button">
                  <LogIn size={18} /> Connexion
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
