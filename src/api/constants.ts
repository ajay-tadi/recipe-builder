export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
export const API_ENDPOINTS = {
  recipes: "/recipes",
  recipe: (id: string) => `/recipes/${encodeURIComponent(id)}`,
} as const;
