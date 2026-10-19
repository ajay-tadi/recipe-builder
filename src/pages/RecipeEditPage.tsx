import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RecipeForm from "../components/RecipeForm";
import { recipeApi } from "../api/recipeApi";
import type { Recipe, RecipePayload } from "../types/recipe";
import { Loading, ErrorState } from "../components/State";

export default function RecipeEditPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!id) return;
    const c = new AbortController();
    recipeApi
      .byId(id, c.signal)
      .then(setRecipe)
      .catch((e) => {
        if (e?.code !== "ERR_CANCELED") setError("Could not load the recipe.");
      })
      .finally(() => {
        if (!c.signal.aborted) setLoading(false);
      });
    return () => c.abort();
  }, [id]);

  async function save(data: RecipePayload) {
    if (!id) return;
    setBusy(true);
    setSaveError("");
    try {
      await recipeApi.update(id, data);
      nav(`/recipes/${id}`, { replace: true });
    } catch {
      setSaveError("Unable to save changes. Try again.");
      throw new Error("Save failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <Loading />;

  if (error || !recipe)
    return (
      <div className="mx-auto max-w-4xl p-10">
        <ErrorState message={error || "Recipe not found."} />
      </div>
    );

  return (
    <RecipeForm
      recipe={recipe}
      onSave={save}
      submitting={busy}
      error={saveError}
    />
  );
}
