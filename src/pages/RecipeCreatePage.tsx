import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeForm from "../components/RecipeForm";
import { recipeApi } from "../api/recipeApi";
import type { RecipePayload } from "../types/recipe";

export default function RecipeCreatePage() {
  const nav = useNavigate();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");

  async function save(data: RecipePayload) {
    setBusy(true);
    setError("");
    try {
      const created = await recipeApi.create(data);
      nav(`/recipes/${created.id}`, { replace: true });
    } catch {
      setError("Unable to save. Make sure JSON Server is running.");
      throw new Error("Save failed");
    } finally {
      setBusy(false);
    }
  }

  return <RecipeForm onSave={save} submitting={busy} error={error} />;
}
