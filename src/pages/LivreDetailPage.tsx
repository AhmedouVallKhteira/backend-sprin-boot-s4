import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/AuteurDetailPage.css";
import TabSwitcher from "../components/TabSwitcher";
import EvaluationDetaillee from "../components/EvaluationDetaillee";
import { apiClient } from "../api/apiClient";
import { LivreDetailDTO } from "../api/LivreApi";
import { useAuth } from "../hooks/useAuth";
import EvaluationModal from "../components/EvaluationModal";
import { EvaluationApi } from "../api/EvaluationApi";
import AuteurCard from "../components/AuteurCard";
import SliderLivresSimilaires from "../components/SliderLivresSimilaires";

export default function LivreDetailPage(): React.ReactElement {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [livre, setLivre] = useState<LivreDetailDTO | null>(null);
  const [activeTab, setActiveTab] = useState<
    "evaluations" | "details" | "mesevaluations"
  >("details");
  const [showModal, setShowModal] = useState(false);
  const [editEval, setEditEval] = useState<any>(null);

  useEffect(() => {
    if (id) {
      apiClient
        .get(`/livres/${id}`)
        .then((res) => setLivre(res.data))
        .catch((err) => {
          // Récupérer le message d'erreur de la réponse backend ou utiliser un fallback
          const errorMessage =
            err.response?.data?.message || // message renvoyé par le backend
            err.message ||                 // message général de Axios
            "Erreur inconnue lors du chargement du livre.";
    
          console.error("Erreur de chargement du livre:", errorMessage);
    
    
          navigate("/dashboard/livres");
        });
    }
    
  }, [id]);

  const handleDelete = async () => {
    if (!livre) return;
    const confirm = window.confirm("Voulez-vous vraiment supprimer ce livre ?");
    if (!confirm) return;
    try {
      await apiClient.delete(`/livres/${livre.id}`);
      alert("Livre supprimé avec succès !");
      navigate("/dashboard/livres");
    } catch (error) {
      alert("Erreur lors de la suppression du livre.");
      console.error(error);
    }
  };

  const handleEvaluationSubmit = async (note: number, commentaire: string) => {
    if (!user || !livre) return;
    try {
      if (editEval) {
        await EvaluationApi.update("livre", editEval.id, {
          note,
          commentaire,
        });
        setEditEval(null);
      } else {
        await EvaluationApi.create("livre", {
          note,
          commentaire,
          utilisateurId: user.id,
          cibleId: livre.id,
        });
      }
      alert("✅ Évaluation enregistrée !");
      setShowModal(false);
      window.location.reload();
    } catch (err) {
      console.error("Erreur lors de l'envoi de l'évaluation", err);
      alert("Erreur lors de l'envoi de l'évaluation");
    }
  };

  const handleDeleteEvaluation = async (evalId: number) => {
    const confirm = window.confirm("Supprimer cette évaluation ?");
    if (!confirm) return;
    try {
      await EvaluationApi.delete("livre", evalId);
      alert("Évaluation supprimée !");
      window.location.reload();
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
    }
  };

  if (!livre) return <p>Chargement...</p>;

  const totalEvaluations = Object.values(
    livre.statistiqueEvaluation || {}
  ).reduce((sum, val) => sum + val, 0);

  return (
    <div className="auteur-detail-page">
      <div className="auteur-detail-header">
        <img src={livre.imageUrl} alt={livre.titre} className="auteur-photo" />
        <div className="auteur-info">
          <h2>{livre.titre}</h2>
          <p>
            <strong>Description:</strong> {livre.description}
          </p>
          <p>
            <strong>Genre:</strong> {livre.genre}
          </p>
          <p>
            <strong>Date de publication:</strong> {livre.datePublication}
          </p>
          <p>
            <strong>Prix:</strong> {livre.prix} MRU
          </p>
          <p>
            <strong>ISBN:</strong> {livre.isbn}
          </p>
          <p>
            <strong>Disponible:</strong> {livre.disponible ? "Oui" : "Non"}
          </p>

          <div className="auteur-actions">
            {(user?.role === "ADMIN" || user?.role === "SUPERADMIN") && (
              <>
                <button
                  className="btn-edit"
                  onClick={() => navigate(`/dashboard/livres/edit/${livre.id}`)}
                >
                  ✏️ Modifier
                </button>
                <button className="btn-delete" onClick={handleDelete}>
                  🗑️ Supprimer
                </button>
              </>
            )}
            {user?.role === "USER" && (
              <button className="btn-edit" onClick={() => setShowModal(true)}>
                Évaluer
              </button>
            )}
          </div>
        </div>
      </div>

      {<SliderLivresSimilaires
        livres={livre.livresSimillers.map((l) => ({
          titre: l.titre,
          note: l.evaluation,
          image: l.imageUrl,
          onDetailClick: () => {
            return user?.role === "USER"
              ? navigate(`/livres/${l.id}`)
              : navigate(`/dashboard/livres/${l.id}`);
          },
          onBye: () => {
            if (!user) {
              alert("Il faut se connecter pour acheter");
              return;
            }
            navigate(`/buy/${l.id}`);
          },
        }))}
      />
}

      <TabSwitcher
        tabs={[
          {
            label: "Auteur",
            content: (
              <div className="livres-list">
                <AuteurCard
                  key={livre.auteur.id}
                  nom={livre.auteur.nom ?? "Nom inconnu"}
                  photo={livre.auteur.imageUrl ?? "/img/default.png"}
                  note={livre.auteur.evaluation ?? 0}
                  onDetailClick={() => {
                    if (!user || user.role === "USER") {
                      navigate(`/auteurs/${livre.auteur.id}`);
                    } else {
                      navigate(`dashbord/auteurs/${livre.auteur.id}`);
                    }
                  }}
                />
              </div>
            ),
          },
          {
            label: "Évaluations",
            content: (
              <EvaluationDetaillee
                moyenne={livre.evaluation}
                total={livre.statistiqueEvaluation?.totalEvaluations || 0}
                stats={[
                  livre.statistiqueEvaluation?.pourcentage5 || 0,
                  livre.statistiqueEvaluation?.pourcentage4 || 0,
                  livre.statistiqueEvaluation?.pourcentage3 || 0,
                  livre.statistiqueEvaluation?.pourcentage2 || 0,
                  livre.statistiqueEvaluation?.pourcentage1 || 0,
                ]}
                commentaires={livre.evaluations}
                currentUserId={user?.id}
                onUpdate={(id) => {
                  const found = livre.evaluations.find((e) => e.id === id);
                  if (found) {
                    setEditEval(found);
                    setShowModal(true);
                  }
                }}
                onDelete={handleDeleteEvaluation}
              />
            ),
          },

          user?.role === "USER" && {
            label: "Mes évaluations",
            content: (
              <div>
                {livre.evaluations
                  .filter((e) => e.utilisateurID === user?.id)
                  .map((e) => (
                    <div key={e.id} className="user-evaluation-card">
                      <p>
                        <strong>Note:</strong> {e.note} ⭐
                      </p>
                      <p>
                        <strong>Commentaire:</strong> {e.commentaire}
                      </p>
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setEditEval(e);
                          setShowModal(true);
                        }}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteEvaluation(e.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
              </div>
            ),
          },
        ].filter(Boolean)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {showModal && (
        <EvaluationModal
          onClose={() => {
            setShowModal(false);
            setEditEval(null);
          }}
          onSubmit={handleEvaluationSubmit}
          defaultNote={editEval?.note}
          defaultCommentaire={editEval?.commentaire}
        />
      )}
    </div>
  );
}
