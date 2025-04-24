import { apiClient } from "./apiClient";

export interface AuteurResponse {
  id: number;
  nom: string;
  biographie: string;
  nationalite: string;
  dateNaissance: string;
  imageUrl: string;
  evaluation: number;
}

export interface LivreDTO {
  id: number;
  titre: string;
  description: string;
  prix: number;
  datePublication: string;
  imageUrl: string;
  evaluation: number;
}

export interface AuteurSimilaireDTO {
  id: number;
  nom: string;
  biographie: string;
  nationalite: string;
  dateNaissance: string;
  imageUrl: string;
  evaluation: number;
}

export interface CommentaireDTO {
  [x: string]: number | undefined;
  utilisateur: string;
  note: number;
  commentaire: string;
}

export interface AuteurDetailResponse {
  [x: string]: any;
  id: number;
  nom: string;
  biographie: string;
  nationalite: string;
  dateNaissance: string;
  imageUrl: string;
  evaluation: number;
  livres: LivreDTO[];
  evaluations: CommentaireDTO[];
  auteursSimillers: AuteurSimilaireDTO[];
}


export const AuteurApi = {
  getAll: () => apiClient.get<AuteurResponse[]>("/auteurs"),
  getById: (id: string | number) =>
    apiClient.get<AuteurDetailResponse>(`/auteurs/${id}`),
};
