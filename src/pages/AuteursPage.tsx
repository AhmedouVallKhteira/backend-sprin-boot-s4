import React, { useEffect, useState } from "react";
import "../styles/AuteursPage.css";
import AuteurCard from "../components/AuteurCard";
import { useNavigate } from "react-router-dom";
import { AuteurApi, AuteurResponse } from "../api/AuteurApi";
import { useAuth } from "../hooks/useAuth";

export default function AuteursPage(): React.ReactElement {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [auteurs, setAuteurs] = useState<AuteurResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    AuteurApi.getAll()
      .then((res) => {
        setAuteurs(res.data);
      })
      .catch((err) => {
        console.error("Erreur de chargement des auteurs :", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const auteursFiltres = auteurs.filter(
    (a) => a.nom && a.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = () => {
    console.log("🔍 Recherche :", searchTerm);
  };

  return (
    <div className="auteurs-page">
      <h2 className="auteurs-header">Liste des Auteurs</h2>

      <div className="auteurs-controls">
        <div className="search-group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un auteur..."
          />
          <button className="btn-search" onClick={handleSearch}>
            Rechercher
          </button>
        </div>
        {}
        {user && user.role !== "USER" && (
          <button className="btn-add" onClick={() => navigate("add")}>
            ➕ Ajouter
          </button>
        )}
      </div>

      {loading ? (
        <p>Chargement des auteurs...</p>
      ) : (
        <div className="auteurs-list">
          {auteursFiltres.map((auteur) => (
            <AuteurCard
              key={auteur.id}
              nom={auteur.nom ?? "Nom inconnu"}
              photo={auteur.imageUrl ?? "/img/default.png"}
              note={auteur.evaluation ?? 0}
              onDetailClick={() => navigate(`${auteur.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
