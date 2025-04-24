import React from "react";
import "../styles/AchatCard.css";
import { useNavigate } from "react-router-dom";
import { AchatDTO, ValiderAchatRequest } from "../api/AchatApi";
import { useAuth } from "../hooks/useAuth";
import { AchatApi } from "../api/AchatApi";

interface AchatProps {
  achat: AchatDTO;
  isAdmin?: boolean;
  role?:"USER" | "ADMIN" | "SUPERADMIN"
}

export default function AchatCard({
  achat,
  role = "USER",
}: AchatProps): React.ReactElement {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAccepter = async () => {
    if (!user) return;
    try {
      const data: ValiderAchatRequest = {
        achatId: achat.id,
        adminId: user.id,
      };
      await AchatApi.confirmerAchat(data);
      alert("✅ Achat accepté avec succès !");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'acceptation de l'achat.");
    }
  };

  const handleRejeter = async () => {
    if (!user) return;
    try {
      const data: ValiderAchatRequest = {
        achatId: achat.id,
        adminId: user.id,
      };
      await AchatApi.refuserAchat(data);
      alert("❌ Achat rejeté avec succès !");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Erreur lors du rejet de l'achat.");
    }
  };

  return (
    <div className={`achat-card status-${achat.status.toLowerCase()}`}>
      <div className="achat-info">
        <h4
          className="achat-livre"
          onClick={() => navigate(`/dashboard/livres/${achat.livre.id}`)}
        >
          📘 {achat.livre.titre}
        </h4>
        <p>Date : {achat.date}</p>
        <p>Montant : {achat.montant} MRU</p>
        <p>Banque : {achat.banque}</p>
        <p>
          Status : <strong>{achat.status.replace("_", " ")}</strong>
        </p>
        {(role === "ADMIN" || role === "SUPERADMIN") && achat.client && (
          <p className="user-link">
            Clinet :
            <span
              onClick={() =>
                navigate(`/dashboard/utilisateurs/${achat.client.id}`)
              }
            >
              {achat.client.nom}
            </span>
          </p>
        )}
        {(role === "SUPERADMIN") && achat.admin && (
          <p className="user-link">
            Utilisateur :
            <span
              onClick={() =>
                navigate(`/dashboard/utilisateurs/${achat.admin.id}`)
              }
            >
              {achat.admin.nom}
            </span>
          </p>
        )}
      </div>
      <div className="achat-preuve">
        <img src={achat.preuve} alt="Preuve de paiement" />
      </div>

      {(role === "ADMIN" || role === "SUPERADMIN") && (
        <div className="achat-actions">
          {(achat.status === "EN_ATTENTE" || achat.status === "REJETE") && (
            <button className="btn-accepter" onClick={handleAccepter}>
              Accepter
            </button>
          )}
          {(achat.status === "EN_ATTENTE" || achat.status === "CONFIRME") && (
            <button className="btn-rejeter" onClick={handleRejeter}>
              Rejeter
            </button>
          )}
        </div>
      )}
    </div>
  );
}
