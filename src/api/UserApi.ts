import { apiClient } from "./apiClient";
import { Role } from "../types/auth";
import { AchatDTO } from "./AchatApi";


interface UserData {
  id: number;
  nom: string;
  email: string;
  role: Role;
  achats: AchatDTO [];
}

export interface UtilisateurDTO {
  id: number;
  nom: string;
  email: string;
  role: Role;
}

export const UserApi = {
  getAll: () => apiClient.get<UtilisateurDTO[]>("/utilisateurs"),

  changeRole: (id: number, role: Role) =>
    apiClient.put(`/utilisateurs/${id}/changer-role`, { role }),

  getDetailById: (id: number) => apiClient.get<UserData>(`/utilisateurs/${id}/detail`)

};
