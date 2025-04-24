import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AjouterAuteur.css";

export default function AjouterAuteur(): React.ReactElement {
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [biographie, setBiographie] = useState("");
  const [nationalite, setNationalite] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!photo) {
      alert("Veuillez sélectionner une photo !");
      return;
    }

    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("biographie", biographie);
    formData.append("nationalite", nationalite);
    formData.append("dateNaissance", dateNaissance);
    formData.append("photo", photo);

    try {
      const response = await fetch("http://localhost:8081/api/auteurs", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Auteur ajouté avec succès !");
        navigate("/dashboard/auteurs");
      } else {
        const data = await response.json();
        alert(`Erreur: ${data.message || "Échec de l'ajout de l'auteur."}`);
      }
    } catch (error) {
      alert("Erreur réseau : " + error);
    }
  };

  return (
    <div className="ajouter-auteur-page">
      <h2>Ajouter un Auteur</h2>
      <form className="ajouter-auteur-form" onSubmit={handleSubmit}>
        <label>
          Nom:
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </label>

        <label>
          Biographie:
          <textarea
            value={biographie}
            onChange={(e) => setBiographie(e.target.value)}
            required
          />
        </label>

        <label>
          Nationalité:
          <input
            type="text"
            value={nationalite}
            onChange={(e) => setNationalite(e.target.value)}
            required
          />
        </label>

        <label>
          Date de naissance:
          <input
            type="date"
            value={dateNaissance}
            onChange={(e) => setDateNaissance(e.target.value)}
            required
          />
        </label>

        <label>
          Photo:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            required
          />
        </label>

        <div className="form-buttons">
          <button type="submit" className="btn-submit">
            Enregistrer
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/dashboard/auteurs")}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
