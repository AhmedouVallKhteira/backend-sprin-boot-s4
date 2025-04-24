import { apiClient } from "./apiClient";

export interface UtilisateurSimpleDTO {
  id: number;
  nom: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface LivreSimpleDTO {
  id: number;
  titre: string;
  description: string;
  genre : string;
  prix: number;
  imageUrl: string;
  datePublication: string;
  evaluation: number;
}

export interface AchatDTO {
  id: number;
  livre: LivreSimpleDTO;
  montant: number;
  banque: string;
  status: "EN_ATTENTE" | "CONFIRME" | "REJETE";
  date: string;
  preuve: string;
  client: UtilisateurSimpleDTO;
  admin: UtilisateurSimpleDTO ;
}

export interface FaireAchatRequest {
  livreId: number;
  clientId: number;
  montant: number;
  banque: string;
  preuve: File;
}

export interface ValiderAchatRequest {
  achatId: number;
  adminId: number;
}

export const AchatApi = {
  faireAchat: (data: FormData) =>
    apiClient.post<AchatDTO>("/achats/faire", data),

  confirmerAchat: (data: ValiderAchatRequest) =>
    apiClient.post<AchatDTO>("/achats/confirmer", data),

  refuserAchat: (data: ValiderAchatRequest) =>
    apiClient.post<AchatDTO>("/achats/refuser", data),

  getByClient: (clientId: number) =>
    apiClient.get<AchatDTO[]>(`/achats/by-client/${clientId}`),

  getByAdmin: (adminId: number) =>
    apiClient.get<AchatDTO[]>(`/achats/by-admin/${adminId}`),

  getAll: () => apiClient.get<AchatDTO[]>("/achats/all"),
};
