import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LivreApi, LivreSimpleDTO } from "../api/LivreApi";
import { useAuth } from "../hooks/useAuth";
import { AchatApi } from "../api/AchatApi";
import "../styles/FaireAchatPage.css";

export default function FaireAchatPage(): React.ReactElement {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [livre, setLivre] = useState<LivreSimpleDTO | null>(null);
  const [banque, setBanque] = useState("Bankily");
  const [preuve, setPreuve] = useState<File | null>(null);

  useEffect(() => {
    if (id) {
      LivreApi.getById(id)
        .then((res) => setLivre(res.data))
        .catch(() => navigate("/dashboard/livres"));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!livre || !preuve || !user)
      return alert("Tous les champs sont requis.");

    const formData = new FormData();
    formData.append("livreId", livre.id.toString());
    formData.append("clientId", user.id.toString());
    formData.append("montant", livre.prix.toString());
    formData.append("banque", banque);
    formData.append("preuve", preuve);

    try {
      await AchatApi.faireAchat(formData);
      alert("Achat en attente de validation.");
      navigate("/mes-achats");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("Erreur lors de l'envoi de l'achat.");
    }
  };

  if (!livre) return <p>Chargement...</p>;

  return (
    <div className="faire-achat-page">
      <h2>💳 Faire un achat</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Livre ID</label>
          <input type="text" value={livre.id} disabled />
        </div>

        <div className="form-group">
          <label>Nom du livre</label>
          <input type="text" value={livre.titre} disabled />
        </div>

        <div className="form-group">
          <label>Montant</label>
          <input type="text" value={livre.prix + " MRU"} disabled />
        </div>

        <div className="form-group">
          <label>Banque</label>
          <select value={banque} onChange={(e) => setBanque(e.target.value)}>
            <option value="Bankily">Bankily</option>
            <option value="Bimbank">Bimbank</option>
            <option value="Sedad">Sedad</option>
            <option value="Masrivi">Masrivi</option>
          </select>
        </div>

        <div className="form-group">
          <label>Preuve de paiement (image)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPreuve(e.target.files?.[0] || null)}
            required
          />
        </div>

        <button type="submit" className="btn-submit">
          ✅ Valider l'achat
        </button>
      </form>
    </div>
  );
}
