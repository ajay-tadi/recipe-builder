import { API_ENDPOINTS as EP } from "./constants";
import { get, post, patch, remove } from "./apiMethods";
import type { Recipe, RecipePayload } from "../types/recipe";
export const recipeApi = {
  list: (signal?: AbortSignal) => get<Recipe[]>(EP.recipes, { signal }),
  byId: (id: string, signal?: AbortSignal) =>
    get<Recipe>(EP.recipe(id), { signal }),
  create: (data: RecipePayload) =>
    post<Recipe, RecipePayload>(EP.recipes, data),
  update: (id: string, data: Partial<RecipePayload>) =>
    patch<Recipe, Partial<RecipePayload>>(EP.recipe(id), data),
  publish: (id: string) =>
    patch<Recipe, { status: "published" }>(EP.recipe(id), {
      status: "published",
    }),
  delete: (id: string) => remove(EP.recipe(id)),
};
