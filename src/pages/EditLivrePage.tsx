import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/EditLivre.css";
import { AuteurApi } from "../api/AuteurApi";
import { LivreApi } from "../api/LivreApi";
import { LivreDetailResponse } from "../api/LivreApi";

export default function EditLivrePage(): React.ReactElement {
  const { id } = useParams();
  const navigate = useNavigate();

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [isbn, setIsbn] = useState("");
  const [datePublication, setDatePublication] = useState("");
  const [prix, setPrix] = useState("");
  const [auteurId, setAuteurId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [auteurs, setAuteurs] = useState<{ id: number; nom: string }[]>([]);
  
  useEffect(() => {
    AuteurApi.getAll().then((res) => setAuteurs(res.data));
    if (id) {
      LivreApi.getById(id)
        .then((res) => {
          const livre: LivreDetailResponse = res.data;
          setTitre(livre.titre);
          setDescription(livre.description);
          setIsbn(livre.isbn);
          setDatePublication(livre.datePublication);
          setPrix(String(livre.prix));
          setAuteurId(String(livre.auteur.id));
          setImageUrl(livre.imageUrl);
        })
        .catch(() => {
          alert("Livre non trouvé.");
          navigate("/dashboard/livres");
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("titre", titre);
    formData.append("description", description);
    formData.append("isbn", isbn);
    formData.append("datePublication", datePublication);
    formData.append("prix", prix);
    formData.append("auteurId", auteurId);
    if (image) formData.append("image", image);

    try {
      await LivreApi.modifier(Number(id), formData);
      navigate("/dashboard/livres");
    } catch (err) {
      alert("Erreur lors de la mise à jour du livre !");
      console.error(err);
    }
  };

  return (
    <div className="edit-livre-page">
      <h2>Modifier le Livre</h2>
      <form className="edit-livre-form" onSubmit={handleSubmit}>
        <label>
          Titre:
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label>
          ISBN:
          <input
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            required
          />
        </label>

        <label>
          Date de publication:
          <input
            type="date"
            value={datePublication}
            onChange={(e) => setDatePublication(e.target.value)}
            required
          />
        </label>

        <label>
          Prix:
          <input
            type="number"
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            required
          />
        </label>

        <label>
          Auteur:
          <select
            value={auteurId}
            onChange={(e) => setAuteurId(e.target.value)}
            required
          >
            <option value="">-- Choisir un auteur --</option>
            {auteurs.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nom}
              </option>
            ))}
          </select>
        </label>

        <label>
          Image:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </label>

        {image ? (
          <div className="livre-preview">
            <p>Nouvelle image :</p>
            <img
              src={URL.createObjectURL(image)}
              alt="nouvelle"
              className="image-preview"
            />
          </div>
        ) : (
          imageUrl && (
            <div className="livre-preview">
              <p>Image actuelle :</p>
              <img src={imageUrl} alt="actuelle" className="image-preview" />
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
            onClick={() => navigate("/dashboard/livres")}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
