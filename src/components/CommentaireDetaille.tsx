import React from "react";
import "../styles/CommentaireDetaille.css";
import { Star, Trash2 } from "lucide-react";
import { EvaluationApi } from "../api/EvaluationApi"; 
import { useAuth } from "../hooks/useAuth";

interface CommentaireProps {
  id?: number;
  utilisateur: string;
  note: number;
  commentaire: string;
  type?: "livre" | "auteur";
}

export default function CommentaireDetaille({
  id,
  utilisateur,
  note,
  commentaire,
  type = "livre",
}: CommentaireProps): React.ReactElement {
  const {user} = useAuth();
  const renderStars = () => {
    const fullStars = Math.floor(note);
    const hasHalfStar = note - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="comment-stars">
        {Array(fullStars)
          .fill(null)
          .map((_, i) => (
            <Star key={"full-" + i} fill="#facc15" stroke="#facc15" size={18} />
          ))}
        {hasHalfStar && (
          <Star
            key="half"
            fill="url(#halfGradient)"
            stroke="#facc15"
            size={18}
          />
        )}
        {Array(emptyStars)
          .fill(null)
          .map((_, i) => (
            <Star key={"empty-" + i} stroke="#facc15" size={18} />
          ))}
        <svg width="0" height="0">
          <defs>
            <linearGradient id="halfGradient">
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="50%" stopColor="white" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  };

  const handleDelete = async () => {
    if (!id) return;
    const confirm = window.confirm("Voulez-vous supprimer ce commentaire ?");
    if (!confirm) return;
    try {
      await EvaluationApi.delete(type, id);
      alert("Commentaire supprimé !");
      window.location.reload();
    } catch (err) {
      console.error("Erreur suppression commentaire", err);
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="comment-card">
      <div className="comment-header">
        <strong>{utilisateur}</strong>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {renderStars()}
          {id && (user?.role=="ADMIN" || user?.role=="SUPERADMIN") &&(
            <button
              onClick={handleDelete}
              className="btn-delete-comment"
              title="Supprimer le commentaire"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
      <p className="comment-text">{commentaire}</p>
    </div>
  );
}
