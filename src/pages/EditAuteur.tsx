import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/EditAuteur.css";
import { AuteurApi } from "../api/AuteurApi";

export default function EditAuteur(): React.ReactElement {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [biographie, setBiographie] = useState("");
  const [nationalite, setNationalite] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      AuteurApi.getById(id)
        .then((res) => {
          const data = res.data;
          setNom(data.nom);
          setBiographie(data.biographie);
          setNationalite(data.nationalite);
          setDateNaissance(data.dateNaissance);
          setImageUrl(data.imageUrl); // ✅ enregistrer l’image du backend
        })
        .catch(() => {
          alert("Auteur non trouvé.");
          navigate("/dashboard/auteurs");
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("biographie", biographie);
    formData.append("nationalite", nationalite);
    formData.append("dateNaissance", dateNaissance);
    if (photo) formData.append("photo", photo);

    try {
      await fetch(`http://localhost:8081/api/auteurs/${id}`, {
        method: "PUT",
        body: formData,
      });

      alert("Auteur mis à jour avec succès !");
      navigate("/dashboard/auteurs");
    } catch (err) {
      alert("Erreur lors de la mise à jour !");
      console.error(err);
    }
  };

  return (
    <div className="edit-auteur-page">
      <h2>Modifier l'Auteur</h2>
      <form className="edit-auteur-form" onSubmit={handleSubmit}>
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
          Photo :
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
          />
        </label>

        {/* ✅ Affichage image actuelle ou nouvelle */}
        {photo ? (
          <div className="auteur-preview">
            <p>Nouvelle photo :</p>
            <img
              src={URL.createObjectURL(photo)}
              alt="Nouvelle"
              className="image-preview"
            />
          </div>
        ) : (
          imageUrl && (
            <div className="auteur-preview">
              <p>Photo actuelle :</p>
              <img src={imageUrl} alt="Actuelle" className="image-preview" />
            </div>
          )
        )}

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
