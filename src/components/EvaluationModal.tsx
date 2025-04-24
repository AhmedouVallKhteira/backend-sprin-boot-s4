import React, { useEffect, useState } from "react";
import "../styles/EvaluationModal.css";

interface Props {
  onClose: () => void;
  onSubmit: (note: number, commentaire: string) => void;
  defaultNote?: number;
  defaultCommentaire?: string;
}

export default function EvaluationModal({
  onClose,
  onSubmit,
  defaultNote = 0,
  defaultCommentaire = "",
}: Props): React.ReactElement {
  const [note, setNote] = useState(defaultNote);
  const [commentaire, setCommentaire] = useState(defaultCommentaire);
  const [error, setError] = useState("");

  useEffect(() => {
    setNote(defaultNote);
    setCommentaire(defaultCommentaire);
  }, [defaultNote, defaultCommentaire]);

  const handleSubmit = () => {
    if (!commentaire.trim()) {
      setError("Le commentaire est requis.");
      return;
    }
    onSubmit(note, commentaire);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{defaultNote ? "Modifier" : "Ajouter"} une évaluation</h3>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              onClick={() => setNote(n)}
              style={{ cursor: "pointer", fontSize: 20 }}
            >
              {n <= note ? "⭐" : "☆"}
            </span>
          ))}
        </div>
        <textarea
          placeholder="Votre commentaire..."
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
        />
        {error && <p className="error-message">{error}</p>}

        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onClose}>
            Annuler
          </button>
          <button className="btn-submit" onClick={handleSubmit}>
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
