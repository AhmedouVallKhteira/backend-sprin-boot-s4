import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LogOut, Book, User, Users, LayoutDashboard, X, ShoppingCart } from "lucide-react";
import "../styles/Sidebar.css";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout ,user} = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* X Close Icon on Mobile */}
      <div className="sidebar-close-icon">
        <button onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      <div className="sidebar-header">
        <h2>📚 Bibliothèque</h2>
      </div>

      <ul className="sidebar-links">
        <li>
          <Link to="/dashboard" onClick={onClose}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
        </li>

        {user?.role === "SUPERADMIN" && (
          <li>
            <Link to="/dashboard/users" onClick={onClose}>
              <Users size={18} />
              <span>Utilisateurs</span>
            </Link>
          </li>
        )}
        <li>
          <Link to="/dashboard/achats" onClick={onClose}>
            <ShoppingCart size={18} />
            <span>Achats</span>
          </Link>
        </li>

        <li>
          <Link to="/dashboard/livres" onClick={onClose}>
            <Book size={18} />
            <span>Livres</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard/auteurs" onClick={onClose}>
            <User size={18} />
            <span>Auteurs</span>
          </Link>
        </li>
      </ul>

      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
