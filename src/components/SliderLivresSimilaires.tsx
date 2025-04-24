import "../styles/SliderAuteursSimilaires.css";
import LivreCard from "./LivreCard";

interface Livre {
  titre: string;
  image: string;
  note: number;
  onBye: () => void;
  onDetailClick: () => void;
}

interface Props {
  livres: Livre[];
}

export default function SliderAuteursSimilaires({ livres }: Props) {
  return (
    <>
    </>
    // <div className="slider-auteurs-similaires">
    //   <h3>Livres similaires</h3>
    //   <div className="slider-container">
    //     {livres.map((livre, index) => (
    //       <LivreCard 
    //       key={index}
    //       titre={livre.titre} 
    //       image={livre.image} 
    //       note={livre.note} 
    //       onBuy={livre.onBye}
    //       onDetails={livre.onDetailClick} />
    //     ))}
    //   </div>
    // </div>
  );
}
