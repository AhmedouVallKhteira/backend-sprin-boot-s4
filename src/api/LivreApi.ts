import { apiClient } from "./apiClient";

export interface LivreSimpleDTO {
    id: number;
    titre: string;
    description: string;
    prix: number;
    imageUrl: string;
    datePublication: string;
    evaluation: number;
}

export interface AddLivreRequest {
    titre: string;
    description: string;
    prix: number;
    isbn: string;
    datePublication: string;
    image: File;
    auteurId: number;
}

export interface AuteurSimpleDTO {
  id: number;
  nom: string;
  biographie: string;
  nationalite: string;
  dateNaissance: string;
  imageUrl: string;
  evaluation: number;
}

export interface EvaluationLivre {
  [x: string]: number | undefined;
  id: number;
  utilisateur: string;
  commentaire: string;
  note: number;
  date: string;
}

export interface EvaluationStats {
  [x: string]: number;
  etoile1: number;
  etoile2: number;
  etoile3: number;
  etoile4: number;
  etoile5: number;
}

export interface LivreSimpleDTO {
  id: number;
  titre: string;
  description: string;
  prix: number;
  imageUrl: string;
  datePublication: string;
  evaluation: number;
  auteur: AuteurSimpleDTO;
}

export interface LivreDetailDTO {
  id: number;
  titre: string;
  description: string;
  genre: string;
  prix: number;
  isbn: string;
  datePublication: string;
  disponible: boolean;
  imageUrl: string;
  evaluation: number;
  auteur: AuteurSimpleDTO;
  evaluations: EvaluationLivre[];
  statistiqueEvaluation: EvaluationStats;
  livresSimillers: LivreSimpleDTO[];
}

export interface LivreDetailResponse {
  id: number;
  titre: string;
  description: string;
  genre: string;
  prix: number;
  isbn: string;
  datePublication: string;
  disponible: boolean;
  imageUrl: string;
  evaluation: number;
  auteur: AuteurSimpleDTO;
  evaluations: EvaluationLivre[];
  statistiqueEvaluation: EvaluationStats;
  livresSimillers: LivreSimpleDTO[];
}


export interface RemiseRequest {
  idLivre: number;
  remisePourcentage: number;
}

export const LivreApi = {
  getAll: () => apiClient.get<LivreSimpleDTO[]>("/livres"),
  getById: (id: string | number) => apiClient.get(`/livres/${id}`),
  ajouter: (data: FormData) =>
    apiClient.post("/livres", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  modifier: (id: string | number, data: FormData) =>
    apiClient.put(`/livres/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  supprimer: (id: string | number) => apiClient.delete(`/livres/${id}`),

  appliquerRemiseFixe: (request: RemiseRequest) => 
    apiClient.post("/livres/remise-fixe", request)
};
