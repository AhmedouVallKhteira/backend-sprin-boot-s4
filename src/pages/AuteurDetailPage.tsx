import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/AuteurDetailPage.css";
import SliderAuteursSimilaires from "../components/SliderAuteursSimilaires";
import TabSwitcher from "../components/TabSwitcher";
import EvaluationDetaillee from "../components/EvaluationDetaillee";
import LivreCard from "../components/LivreCard";
import { AuteurApi, AuteurDetailResponse } from "../api/AuteurApi";
import { apiClient } from "../api/apiClient";
import { useAuth } from "../hooks/useAuth";
import EvaluationModal from "../components/EvaluationModal";
import { EvaluationApi } from "../api/EvaluationApi";

interface Evaluation {
  id: number;
  note: number;
  commentaire: string;
  utilisateurID: number;
}

export default function AuteurDetailPage(): React.ReactElement {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [auteur, setAuteur] = useState<AuteurDetailResponse | null>(null);
  const [activeTab, setActiveTab] = useState<
    "livres" | "evaluations" | "mesevaluations"
  >("livres");
  const [showModal, setShowModal] = useState(false);
  const [editEval, setEditEval] = useState<Evaluation | null>(null);

  const refreshAuteur = async () => {
    if (!id) return;
    try {
      const res = await AuteurApi.getById(id);
      setAuteur(res.data);
      console.log(res.data)
    } catch (err) {
      console.error("Erreur lors du rafraîchissement :", err);
      navigate("/dashboard/auteurs");
    }
  };

  useEffect(() => {
    refreshAuteur();
    
  }, [id]);

  
  const handleDelete = async () => {
    if (!auteur) return;
    const confirm = window.confirm(
      "Voulez-vous vraiment supprimer cet auteur ?"
    );
    if (!confirm) return;
    try {
      await apiClient.delete(`/auteurs/${auteur.id}`);
      alert("Auteur supprimé avec succès !");
      navigate("/dashboard/auteurs");
    } catch (error) {
      alert("Erreur lors de la suppression.");
      console.error(error);
    }
  };

  const handleEvaluationSubmit = async (note: number, commentaire: string) => {
    if (!user || !auteur) return;
    try {
      if (editEval) {
        await EvaluationApi.update("auteur", editEval.id, {
          note,
          commentaire,
        });
        setEditEval(null);
      } else {
        await EvaluationApi.create("auteur", {
          note,
          commentaire,
          utilisateurId: user.id,
          cibleId: auteur.id,
        });
      }
      alert("✅ Évaluation traitée avec succès !");
      setShowModal(false);
      refreshAuteur();
    } catch (err) {
      console.error("Erreur lors de l'envoi de l'évaluation", err);
      alert("Erreur lors de l'envoi de l'évaluation");
    }
  };

  const handleDeleteEvaluation = async (evalId: number) => {
    const confirm = window.confirm("Voulez-vous supprimer cette évaluation ?");
    if (!confirm) return;
    try {
      await EvaluationApi.delete("auteur", evalId);
      alert("Évaluation supprimée avec succès.");
      refreshAuteur();
    } catch (err) {
      console.error("Erreur lors de la suppression de l'évaluation", err);
    }
  };

  if (!auteur) return <p>Chargement...</p>;
  
  const auteursSimilaires =
    auteur.auteursSimillers?.map((a) => ({
      nom: a.nom,
      note: a.evaluation,
      photo: a.imageUrl,
      onDetailClick: () =>
        user?.role === "USER"
          ? navigate(`/auteurs/${a.id}`)
          : navigate(`/dashboard/auteurs/${a.id}`),
    })) ?? [];
    
  return (
    <div className="auteur-detail-page">
      <div className="auteur-detail-header">
        <img src={auteur.imageUrl} alt={auteur.nom} className="auteur-photo" />
        <div className="auteur-info">
          <h2>{auteur.nom}</h2>
          <p>
            <strong>Biographie :</strong> {auteur.biographie}
          </p>
          <p>
            <strong>Nationalité :</strong> {auteur.nationalite}
          </p>
          <p>
            <strong>Date de naissance :</strong> {auteur.dateNaissance}
          </p>
          <p>
            <strong>Nombre de livres :</strong> {auteur.livres?.length ?? 0}
          </p>
          <div className="auteur-actions">
            {(user?.role === "ADMIN" || user?.role === "SUPERADMIN") && (
              <div>
                <button
                  className="btn-edit"
                  onClick={() =>
                    navigate(`/dashboard/auteurs/edit/${auteur.id}`)
                  }
                >
                  ✏️ Modifier
                </button>
                <button className="btn-delete" onClick={handleDelete}>
                  🗑️ Supprimer
                </button>
              </div>
            )}
            {user?.role === "USER" && (
              <button className="btn-edit" onClick={() => setShowModal(true)}>
                Évaluer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* <SliderAuteursSimilaires auteurs={auteursSimilaires} /> */}

      <TabSwitcher
        tabs={[
          {
            label: "Livres",
            key: "livres",
            content: (
                <div className="livres-list">
                {auteur.livres?.map((livre) => (
                  <LivreCard
                  key={livre.id}
                  titre={livre.titre}
                  image={livre.imageUrl}
                  note={livre.evaluation}
                  onBuy={() => {
                    if (!user) {
                    alert("Veuillez vous connecter pour acheter un livre");
                    return;
                    }
                    navigate(`/buy/${livre.id}`);
                  }}
                  onDetails={() => {
                    if (!user) {
                    navigate(`/livres/${livre.id}`);
                    return;
                    }
                    const path = user.role === "USER" 
                    ? `/livres/${livre.id}` 
                    : `/dashboard/livres/${livre.id}`;
                    navigate(path);
                  }}
                  />
                ))}
                </div>
            ),
          },
          {
            label: "Évaluations",
            key: "evaluations",
            content: (
              <EvaluationDetaillee
                moyenne={auteur.evaluation}
                total={auteur.statistiqueEvaluation?.totalEvaluations || 0}
                stats={[
                  auteur.statistiqueEvaluation?.pourcentage5 || 0,
                  auteur.statistiqueEvaluation?.pourcentage4 || 0,
                  auteur.statistiqueEvaluation?.pourcentage3 || 0,
                  auteur.statistiqueEvaluation?.pourcentage2 || 0,
                  auteur.statistiqueEvaluation?.pourcentage1 || 0,
                ]}
                commentaires={auteur.evaluations}
                currentUserId={user?.id}
                onUpdate={(id) => {
                  const evalToEdit = auteur.evaluations.find(
                    (e) => e.id === id
                  );
                  if (evalToEdit) {
                    setEditEval(evalToEdit);
                    setShowModal(true);
                  }
                }}
                onDelete={handleDeleteEvaluation}
              />
            ),
          },
          user?.role === "USER" && {
            label: "Mes évaluations",
            key: "mesevaluations",
            content: (
              <div>
                {(auteur.evaluations || [])
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
