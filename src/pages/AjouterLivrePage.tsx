import React, { useEffect, useState } from "react";
import "../styles/AjouterLivre.css";
import { AuteurApi } from "../api/AuteurApi";
import { LivreApi } from "../api/LivreApi";
import { useNavigate } from "react-router-dom";

interface Auteur {
  id: number;
  nom: string;
}

export default function AjouterLivrePage(): React.ReactElement {
  const navigate = useNavigate();
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [isbn, setIsbn] = useState("");
  const [datePublication, setDatePublication] = useState("");
  const [prix, setPrix] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [auteurId, setAuteurId] = useState<number | null>(null);
  const [searchAuteur, setSearchAuteur] = useState("");
  const [auteurs, setAuteurs] = useState<Auteur[]>([]);
  const [filtrés, setFiltrés] = useState<Auteur[]>([]);
  const [erreurs, setErreurs] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    AuteurApi.getAll().then((res) => {
      const clean = res.data.filter((a) => a.id && a.nom);
      setAuteurs(clean);
    });
  }, []);

  const validerChamps = (): string[] => {
    const erreurs: string[] = [];
    if (!titre.trim()) erreurs.push("Le titre est requis.");
    if (!description.trim()) erreurs.push("La description est requise.");
    if (!isbn.trim() || !/^\d{13}$/.test(isbn)) erreurs.push("ISBN invalide.");
    if (!datePublication) erreurs.push("La date de publication est requise.");
    if (!prix || parseFloat(prix) <= 0) erreurs.push("Prix invalide.");
    if (!image) erreurs.push("Veuillez importer une image.");
    if (!auteurId) erreurs.push("Veuillez sélectionner un auteur valide.");
    return erreurs;
  };

  const handleAuteurSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setSearchAuteur(input);
    const matchList = auteurs.filter((a) =>
      a.nom.toLowerCase().includes(input.toLowerCase())
    );
    setFiltrés(matchList);
    const exactMatch = matchList.find(
      (a) => a.nom.toLowerCase() === input.toLowerCase()
    );
    setAuteurId(exactMatch ? exactMatch.id : null);
  };

  const handleAuteurSelect = (auteur: Auteur) => {
    setSearchAuteur(auteur.nom);
    setAuteurId(auteur.id);
    setFiltrés([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const erreursTrouvees = validerChamps();
    if (erreursTrouvees.length > 0) {
      setErreurs(erreursTrouvees);
      setSuccessMessage("");
      return;
    }

    const formData = new FormData();
    formData.append("titre", titre);
    formData.append("description", description);
    formData.append("isbn", isbn);
    formData.append("prix", prix);
    formData.append("datePublication", datePublication);
    if (auteurId) formData.append("auteurId", auteurId.toString());
    if (image) formData.append("image", image);

    try {
      await LivreApi.ajouter(formData);
      setErreurs([]);
      setSuccessMessage("📘 Livre ajouté avec succès !");
      setTimeout(() => navigate("/dashboard/livres"), 1500);
    } catch (err) {
      console.error(err);
      setSuccessMessage("");
      setErreurs(["Erreur lors de l'ajout !"]);
    }
  };

  return (
    <div className="ajouter-livre-container">
      <h2>Ajouter un Livre</h2>

      {erreurs.length > 0 && (
        <div className="erreur-message">
          <ul>
            {erreurs.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="ajouter-livre-form">
        <div className="row-inline">
          <label>
            Titre du livre:
            <input
              required
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
            />
          </label>

          <label>
            ISBN (13 chiffres):
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <input
                required
                maxLength={13}
                value={isbn}
                onChange={(e) => setIsbn(e.target.value.replace(/\D/g, ""))}
                style={{ flex: 1 }}
              />
              <span
                style={{
                  fontSize: "0.85rem",
                  color: isbn.length === 13 ? "green" : "gray",
                }}
              >
                {isbn.length}/13
              </span>
            </div>
          </label>
        </div>

        <label>
          Description:
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label>
          Date de publication:
          <input
            type="date"
            required
            value={datePublication}
            onChange={(e) => setDatePublication(e.target.value)}
          />
        </label>

        <div className="row-inline">
          <label>
            Prix (MRU):
            <input
              type="number"
              required
              value={prix}
              onChange={(e) => setPrix(e.target.value)}
            />
          </label>

          <div className="custom-file-upload">
            <label htmlFor="image-upload" className="file-label">
              {image ? `📁 ${image.name}` : "Importer une image"}
            </label>
            <input
              required
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        <label>
          Auteur:
          <input
            type="text"
            value={searchAuteur}
            onChange={handleAuteurSearch}
            placeholder="Tapez pour chercher un auteur..."
            required
            autoComplete="off"
          />
          {filtrés.length > 0 && (
            <ul className="autocomplete-list">
              {filtrés.map((a) => (
                <li key={a.id} onClick={() => handleAuteurSelect(a)}>
                  {a.nom}
                </li>
              ))}
            </ul>
          )}
        </label>

        <button type="submit" className="btn-submit">
          Ajouter
        </button>
      </form>
    </div>
  );
}
