// LayoutAdmin.tsx
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Menu, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import "../styles/LayoutAdmin.css";

export default function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="admin-main">
        <header className="admin-header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="logo">
            📘 <b>Mon Admin</b>
          </div>
          <div
            className="admin-user"
            onClick={() => (window.location.href = "/profile")}
          >
            <User size={18} />
            <span>{user?.nom}</span>
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
