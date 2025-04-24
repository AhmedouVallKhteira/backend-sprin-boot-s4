import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/UserDetailPage.css";
import StatCard from "../components/StatCard";
import ChartPieGenre from "../components/ChartPieGenre";
import ChartBarPrix from "../components/ChartBarPrix";
import ChartLineEvolution from "../components/ChartLineEvolution";
import ChartBarMonth from "../components/ChartBarMonth";
import { UserApi } from "../api/UserApi";
import { Role } from "../types/auth";
import AchatCard from "../components/AchatCard";
import { AchatDTO } from "../api/AchatApi";
import { getMonthName } from "../utils/dateUtils";

interface UserData {
  id: number;
  nom: string;
  email: string;
  role: Role;
  achats: AchatDTO[];
  utilisateursGeres?: number;
}

type UserDetailPageProps = {
  identifiant?: number; 
};

export default function UserDetailPage({ identifiant = 0 }: UserDetailPageProps): React.ReactElement {
  const { userID } = useParams();
  const id = userID ? parseInt(userID) : identifiant;
  const [user, setUser] = useState<UserData | null>(null);
  const [tab, setTab] = useState<"EN_ATTENTE" | "CONFIRME" | "REJETE">(
    "EN_ATTENTE"
  );

  useEffect(() => {
    if (id) {
      UserApi.getDetailById(Number(id))
        .then((res) => setUser(res.data))
        .catch((err) =>
          console.error("Erreur lors du chargement de l'utilisateur", err)
        );
    }
  }, [id]);

  if (!user) return <p>Chargement...</p>;

  const achatsFiltres = user.achats.filter((a) => a.status === tab);
  const totalLivres = user.achats.length;
  const totalMontant = user.achats.reduce((sum, a) => sum + a.montant, 0);
  const moyennePrix = totalLivres ? totalMontant / totalLivres : 0;

  const genres = user.achats.reduce((acc, a) => {
    acc[a.livre.genre] = (acc[a.livre.genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const genreFavori =
    Object.entries(genres).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  const sortedDates = user.achats
    .map((a) => new Date(a.date))
    .sort((a, b) => a.getTime() - b.getTime());
  const premierAchat = sortedDates[0]?.toLocaleDateString() || "-";
  const dernierAchat =
    sortedDates[sortedDates.length - 1]?.toLocaleDateString() || "-";

  const delais: number[] = [];
  for (let i = 1; i < sortedDates.length; i++) {
    const diff =
      (sortedDates[i].getTime() - sortedDates[i - 1].getTime()) /
      (1000 * 3600 * 24);
    delais.push(diff);
  }
  const delaiMoyen = delais.length
    ? (delais.reduce((a, b) => a + b, 0) / delais.length).toFixed(1) + " j"
    : "-";

  const achatsParMois = user.achats.reduce((acc, a) => {
    const mois = getMonthName(new Date(a.date));
    acc[mois] = (acc[mois] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const prixParDate = user.achats
    .map((a) => ({
      date: a.date,
      prix: a.livre.prix,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="user-detail-page">
      <p>
        <strong>Nom:</strong> {user.nom}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Rôle:</strong> {user.role}
      </p>

      {user.role === "USER" && (
        <>
          <div className="stat-cards">
            <StatCard icon="book" label="Livres achetés" value={totalLivres} />
            <StatCard icon="price" label="Total dépensé" value={totalMontant} />
            <StatCard 
              icon="average" 
              label="Prix moyen"
              value={moyennePrix.toFixed(1)}
            />
            <StatCard
              icon="calendar"
              label="1er / Dernier achat"
              value={`${premierAchat} / ${dernierAchat}`}
            />
            <StatCard icon="star" label="Genre préféré" value={genreFavori} />
            <StatCard icon="clock" label="Délai moyen" value={delaiMoyen} />
          </div>

          <div className="charts-grid">
            <ChartBarMonth
              data={Object.entries(achatsParMois).map(([mois, count]) => ({
                mois,
                count,
              }))}
            />
            <ChartLineEvolution
              data={prixParDate.map((e) => ({
                date: e.date,
                value: e.prix,
              }))}
            />
            <ChartPieGenre
              data={Object.entries(genres).map(([genre, count]) => ({
                genre,
                count,
              }))}
            />
          </div>

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

          <div className="achats-list">
            {achatsFiltres.map((achat) => (
              <AchatCard key={achat.id} achat={achat} role={user.role} />
            ))}
          </div>
        </>
      )}

      {user.role !== "USER" && (
        <>
          <div className="stat-cards">
            <StatCard
              icon="book"
              label="Livres confirmés"
              value={user.achats.filter((a) => a.status === "CONFIRME").length}
            />
            <StatCard
              icon="user"
              label="Utilisateurs gérés"
              value={user.utilisateursGeres || 0}
            />
            <StatCard
              icon="price"
              label="Montant confirmé"
              value={user.achats
                .filter((a) => a.status === "CONFIRME")
                .reduce((sum, a) => sum + a.montant, 0)}
            />
          </div>

          <div className="charts-grid">
            <ChartPieGenre
              data={Object.entries(genres).map(([genre, count]) => ({
                genre,
                count,
              }))}
            />
            <ChartBarPrix
              data={(() => {
                const ranges: Record<string, number> = {};
                user.achats.forEach(achat => {
                  const price = achat.livre.prix;
                  const range = `${Math.floor(price / 10) * 10}-${Math.floor(price / 10) * 10 + 10}€`;
                  ranges[range] = (ranges[range] || 0) + 1;
                });
                return Object.entries(ranges).map(([range, count]) => ({
                  range,
                  count
                }));
              })()}
            />
          </div>
        </>
      )}
    </div>
  );
}
