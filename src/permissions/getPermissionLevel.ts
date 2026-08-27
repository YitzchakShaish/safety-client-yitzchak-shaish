export type PermissionLevel = "basic" | "advanced" | "admin";

const RANK_TO_PERMISSION: Record<string, PermissionLevel> = {
  "טוראי": "basic",
  "טוראי ראשון": "basic",

  "סמל": "advanced",
  "סמל ראשון": "advanced",
  "רב סמל": "advanced",

  "סרן": "admin",
  "רב סרן": "admin",
  "אלוף משנה": "admin",
  "תת אלוף": "admin",
  "אלוף": "admin",
  "רב אלוף": "admin",
};

export function getPermissionLevel(rank?: string): PermissionLevel {
  return RANK_TO_PERMISSION[rank ?? ""] ?? "basic";
}
