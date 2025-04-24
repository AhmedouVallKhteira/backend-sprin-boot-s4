import React from "react";
import CommentaireDetaille from "./CommentaireDetaille";
import "../styles/EvaluationDetaillee.css";

interface EvaluationProps {
  moyenne: number;
  total: number;
  stats: number[];
  commentaires: {
    utilisateur: string;
    note: number;
    commentaire: string;
  }[];
}

export default function EvaluationDetaillee({
  moyenne,
  total,
  stats,
  commentaires,
}: EvaluationProps): React.ReactElement {
  const renderStats = () => {
    return stats.map((count, index) => {
      const star = 5 - index;
      const pourcentage = total ? Math.round(count) : 0;
      return (
        <div className="stat-row" key={star}>
          <span>{star} ★</span>
          <div className="bar-container">
            <div className="bar-fill" style={{ width: `${pourcentage}%` }} />
          </div>
          <span className="stat-pourcent">{pourcentage}%</span>
        </div>
      );
    });
  };

  return (
    <div className="evaluation-detaillee">
      <div className="evaluation-global">
        <h3>
          Note moyenne :{" "}
          {typeof moyenne === "number" ? moyenne.toFixed(1) : "N/A"} / 5
        </h3>
        <p>{total} utilisateurs ont évalué</p>
        <div className="stats-stars">{renderStats()}</div>
      </div>

      <div className="evaluation-commentaires">
        <h4>Commentaires</h4>
        {Array.isArray(commentaires) && commentaires.length === 0 ? (
          <p>Aucun commentaire pour le moment.</p>
        ) : (
          (commentaires || []).map((com, i) => (
            <CommentaireDetaille key={i} {...com} type="livre" />
          ))
        )}
      </div>
    </div>
  );
}
