import React, { useEffect, useState } from "react";
import "../styles/MesAchatsPage.css";
import AchatCard from "../components/AchatCard";
import { useAuth } from "../hooks/useAuth";
import { AchatApi, AchatDTO } from "../api/AchatApi";

export default function MesAchatsPage(): React.ReactElement {
  const { user } = useAuth();
  const [tab, setTab] = useState("EN_ATTENTE"); 
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [achats, setAchats] = useState<AchatDTO[]>([]);

  useEffect(() => {
    if (user) {
      const fetchAchats = async () => {
        try {
          let res;
          if (user.role === "SUPERADMIN") {
            res = await AchatApi.getAll();
          } else if (user.role === "ADMIN") {
            res = await AchatApi.getByAdmin(user.id);
          } else {
            res = await AchatApi.getByClient(user.id);
          }
          setAchats(res.data);
        } catch (error) {
          console.error("Erreur lors du chargement des achats", error);
        }
      };

      fetchAchats();
    }
  }, []);

  const achatsFiltres = achats.filter((achat) => {
    const dateMatch =
      (!dateDebut || achat.date >= dateDebut) &&
      (!dateFin || achat.date <= dateFin);
    return achat.status === tab && dateMatch;
  });

  return (
    <div className="mes-achats-page">
      <h2>📦 Les Achats</h2>

      <div className="tabs">
        <button
          className={tab === "EN_ATTENTE" ? "active" : ""}
          onClick={() => setTab("EN_ATTENTE")}
        >
          En attente
        </button>
        <button
          className={tab === "CONFIRME" ? "active" : ""}
          onClick={() => setTab("CONFIRME")}
        >
          Confirmé
        </button>
        <button
          className={tab === "REJETE" ? "active" : ""}
          onClick={() => setTab("REJETE")}
        >
          Rejeté
        </button>
      </div>

      <div className="filter-dates">
        <label>
          De :
          <input
            type="date"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
          />
        </label>
        <label>
          À :
          <input
            type="date"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
          />
        </label>
      </div>

      <div className="achats-list">
        {achatsFiltres.map((achat) => (
          <AchatCard
            key={achat.id}
            achat={achat}
            role={user?.role ?? "USER"}
          />
        ))}
      </div>
    </div>
  );
}
