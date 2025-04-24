
import AuteurCard from "./AuteurCard";
import "../styles/SliderAuteursSimilaires.css";

interface Auteur {
  nom: string;
  photo: string;
  note: number;
  onDetailClick: () => void;
}

interface Props {
  auteurs: Auteur[];
}

export default function SliderAuteursSimilaires({ auteurs }: Props) {
  return (
    <div className="slider-auteurs-similaires">
      <h3>Auteurs similaires</h3>
      <div className="slider-container">
        {auteurs.map((auteur, index) => (
          <AuteurCard
            key={index}
            nom={auteur.nom}
            photo={auteur.photo}
            note={auteur.note}
            onDetailClick={auteur.onDetailClick}
          />
        ))}
      </div>
    </div>
  );
}
