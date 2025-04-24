import React from "react";
import "../styles/LivreCard.css";

interface LivreProps {
  titre: string;
  image: string;
  note: number;
  reduction?: number; 
  isUser?: boolean;
  onBuy: () => void;
  onDetails: () => void;
}

export default function LivreCard({
  titre,
  image,
  note,
  reduction,
  isUser,
  onBuy,
  onDetails,
}: LivreProps): React.ReactElement {
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const full = i + 1 <= note;
      const half = !full && i + 0.5 <= note;
      return (
        <span
          key={i}
          className={`star ${full ? "filled" : half ? "half" : "empty"}`}
        >
          ★
        </span>
      );
    });
  };

  return (
    <div className="livre-card">
      <div className="livre-image-wrapper">
        <img src={image} alt={titre} className="livre-image" />
        {reduction && <div className="livre-reduction">-{reduction}%</div>}
      </div>
      <div className="livre-info">
        <h3 className="livre-title">{titre}</h3>
        <div className="livre-stars">{renderStars()}</div>
        <div className="livre-actions">
            {isUser && (
            <button onClick={onBuy} className="btn-buy">
              Buy
            </button>
            )}
          <button onClick={onDetails} className="btn-details">
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
