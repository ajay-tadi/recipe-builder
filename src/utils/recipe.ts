import type { Recipe, RecipePayload } from "../types/recipe";

export const minutes = (r: Pick<Recipe, "prepTime" | "cookTime">) =>
  r.prepTime + r.cookTime;

export const scaleQuantity = (
  amount: number,
  baseServings: number,
  servings: number,
) => Math.round(((amount * servings) / baseServings) * 100) / 100;

export function validateRecipe(
  recipe: RecipePayload,
  status: "draft" | "published",
) {
  const issues: Record<string, string> = {};
  if (!recipe.title.trim()) issues.title = "Add a recipe title.";
  if (!Number.isInteger(recipe.servings) || recipe.servings < 1)
    issues.servings = "Servings must be a positive whole number.";
  if (!Number.isFinite(recipe.prepTime) || recipe.prepTime < 0)
    issues.prepTime = "Enter a valid prep time.";
  if (!Number.isFinite(recipe.cookTime) || recipe.cookTime < 0)
    issues.cookTime = "Enter a valid cook time.";
  recipe.ingredients.forEach((i, n) => {
    if (
      (i.name.trim() || i.quantity !== 0 || i.unit.trim()) &&
      (!i.name.trim() || !Number.isFinite(i.quantity) || i.quantity <= 0)
    )
      issues[`ingredient-${n}`] =
        "Enter a name and quantity greater than zero.";
  });
  if (status === "published") {
    if (!recipe.description.trim())
      issues.description = "Add a description before publishing.";
    if (!recipe.ingredients.some((i) => i.name.trim() && i.quantity > 0))
      issues.ingredients = "Add at least one ingredient.";
    if (!recipe.steps.some((s) => s.instruction.trim()))
      issues.steps = "Add at least one step.";
  }
  return issues;
}
