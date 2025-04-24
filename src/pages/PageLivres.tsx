import React, { useEffect, useState } from "react";
import LivreCard from "../components/LivreCard";
import "../styles/PageLivres.css";
import { useNavigate } from "react-router-dom";
import { LivreApi, LivreSimpleDTO } from "../api/LivreApi";
import { useAuth } from "../hooks/useAuth";

export default function PageLivres(): React.ReactElement {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterNote, setFilterNote] = useState("");
  const [livres, setLivres] = useState<LivreSimpleDTO[]>([]);

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    LivreApi.getAll().then((res) => {
      setLivres(res.data);
    });
  }, []);

  const filteredLivres = livres.filter((livre) =>
    livre.titre.toLowerCase().includes(search.toLowerCase())
  );

  const handleBuy = (id: number) => {
    if (!isAuthenticated) {
      alert(`il faux login pour acheter`);
    } else {
      navigate(`/buy/${id}`);
    }
  };

  const handleDetails = (id: number) => {
    if (!isAuthenticated) {
      navigate(`/livres/${id}`);
      return;
    }
    navigate(`${id}`);
  };

  

  return (
    <div className="page-livres">
      <div className="page-header">
        <h1>📚 Les Livres</h1>
        <div className="page-actions">
          <input
            type="text"
            placeholder="🔍 Rechercher un livre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {(user && user.role !== "USER") && (
            <button className="btn-add" onClick={() => navigate("add")}>
              ➕ Ajouter
            </button>
          )}
        </div>
      </div>

      <div className="livres-list">
        {filteredLivres.map((livre) => (
          <LivreCard
            key={livre.id}
            titre={livre.titre}
            image={livre.imageUrl}
            note={livre.evaluation}
            isUser={user == null || user.role == "USER"}
            onBuy={() => handleBuy(livre.id)}
            onDetails={() => handleDetails(livre.id)}
          />
        ))}
      </div>
    </div>
  );
}
