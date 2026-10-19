export type RecipeStatus = 'draft' | 'published';
export interface Ingredient { id: string; name: string; quantity: number; unit: string }
export interface RecipeStep { id: string; order: number; instruction: string }
export interface Recipe {
  id: string;
  title: string;
  description: string;
  servings: number;
  prepTime: number;
  cookTime: number;
  tags: string[];
  status: RecipeStatus;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  image?: string;
}
export type RecipePayload = Omit<Recipe, 'id'>;
