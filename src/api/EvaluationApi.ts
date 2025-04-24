import { apiClient } from "./apiClient";

interface UpdateEvaluation {
  note: number;
  commentaire: string;
}

export const EvaluationApi = {
  create: (
    type: "livre" | "auteur",
    data: {
      note: number;
      commentaire: string;
      utilisateurId: number;
      cibleId: number;
    }
  ) => apiClient.post(`/evaluations/${type}`, data),
  delete: (type: "livre" | "auteur", id: number) =>
    apiClient.delete(`/evaluations/${type}/${id}`),
  update: (type: "livre" | "auteur", id: number, data: UpdateEvaluation) =>
    apiClient.put(`/evaluations/${type}/${id}`, data),
};
