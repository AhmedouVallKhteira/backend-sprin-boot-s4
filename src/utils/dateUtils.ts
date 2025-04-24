
const moisFrancais = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

/**
 * Retourne le nom du mois en français pour une date donnée.
 * @param date Une instance de Date
 * @returns string - nom du mois (ex: "Mars")
 */
export function getMonthName(date: Date): string {
  return moisFrancais[date.getMonth()];
}

/**
 * Trie un tableau de données contenant des clés de mois français dans l’ordre correct (Janvier → Décembre).
 * @param data Tableau à trier (doit contenir une clé `mois`)
 */
export function sortByMonth<T extends { mois: string }>(data: T[]): T[] {
  return data.sort(
    (a, b) => moisFrancais.indexOf(a.mois) - moisFrancais.indexOf(b.mois)
  );
}
