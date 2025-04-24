import React from "react";
import "../styles/AuteurCard.css";

interface AuteurCardProps {
  nom: string;
  photo: string;
  note: number;
  onDetailClick: () => void;
}

export default function AuteurCard({
  nom,
  photo,
  note,
  onDetailClick,
}: AuteurCardProps): React.ReactElement {
  const renderStars = (note: number): React.ReactNode => {
    const fullStars = Math.floor(note);
    const hasHalfStar = note % 1 >= 0.25 && note % 1 < 0.75;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <span key={`full-${i}`} className="star full">
              ★
            </span>
          ))}
        {hasHalfStar && (
          <span className="star half" key="half">
            ★
          </span>
        )}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <span key={`empty-${i}`} className="star empty">
              ☆
            </span>
          ))}
      </>
    );
  };

  return (
    <div className="auteur-card">
      <img src={photo} alt={nom} className="auteur-photo" />
      <h3>{nom}</h3>
      <div className="note-stars">{renderStars(note)}</div>
      <button onClick={onDetailClick}>Détails</button>
    </div>
  );
}
