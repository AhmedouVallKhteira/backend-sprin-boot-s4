// UsersPage.tsx
import React, { useEffect, useState } from "react";
import "../styles/UtilisateursPage.css";
import { useNavigate } from "react-router-dom";
import { Role } from "../types/auth";
import { UserApi } from "../api/UserApi";

interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  role: Role;
}

export default function UsersPage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<Role>("USER");
  const [users, setUsers] = useState<Utilisateur[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await UserApi.getAll();
        setUsers(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des utilisateurs", err);
      }
    };
    fetchUsers();
  }, []);

  const handleChangeRole = async (id: number, role: Role) => {
    try {
      await UserApi.changeRole(id, role);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    } catch (err) {
      console.error("Erreur lors du changement de rôle", err);
    }
  };

  const utilisateursFiltres = users.filter((u) => u.role === activeTab);

  return (
    <div className="users-page">
      <h2>👥 Liste des Utilisateurs</h2>

      <div className="user-tabs">
        <button
          className={activeTab === "USER" ? "active" : ""}
          onClick={() => setActiveTab("USER")}
        >
          Utilisateurs
        </button>
        <button
          className={activeTab === "ADMIN" ? "active" : ""}
          onClick={() => setActiveTab("ADMIN")}
        >
          Admins
        </button>
      </div>

      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {utilisateursFiltres.map((user) => (
              <tr key={user.id}>
                <td>{user.nom}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="btn-info"
                    onClick={() => navigate(`/dashboard/users/${user.id}`)}
                  >
                    Info
                  </button>
                  {user.role === "USER" ? (
                    <button
                      className="btn-admin"
                      onClick={() => handleChangeRole(user.id, "ADMIN")}
                    >
                      Make Admin
                    </button>
                  ) : (
                    <button
                      className="btn-revoke"
                      onClick={() => handleChangeRole(user.id, "USER")}
                    >
                      Revoke Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
