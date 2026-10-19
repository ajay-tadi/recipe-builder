import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock3,
  UsersRound,
  Pencil,
  Trash2,
  Minus,
  Plus,
  Check,
  Send,
  ImageOff,
} from "lucide-react";
import { recipeApi } from "../api/recipeApi";
import type { Recipe } from "../types/recipe";
import { minutes, scaleQuantity, validateRecipe } from "../utils/recipe";
import { Loading, ErrorState } from "../components/State";
import ConfirmDialog from "../components/ConfirmDialog";
export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [servings, setServings] = useState(1);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => {
    if (!id) return;
    const c = new AbortController();
    setLoading(true);
    recipeApi
      .byId(id, c.signal)
      .then((r) => {
        setRecipe(r);
        setServings(r.servings);
      })
      .catch((e) => {
        if (e?.code !== "ERR_CANCELED")
          setError("Recipe not found.");
      })
      .finally(() => {
        if (!c.signal.aborted) setLoading(false);
      });
    return () => c.abort();
  }, [id]);

  async function publish() {
    if (!recipe) return;
    const issues = validateRecipe(recipe, "published");
    if (Object.keys(issues).length) {
      setActionError(Object.values(issues)[0]);
      return;
    }
    setBusy(true);
    setActionError("");
    try {
      setRecipe(await recipeApi.publish(recipe.id));
    } catch {
      setActionError("Could not publish recipe. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!recipe) return;
    setBusy(true);
    try {
      await recipeApi.delete(recipe.id);
      navigate("/recipes");
    } catch {
      setActionError("Could not delete this recipe.");
      setDeleteOpen(false);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <Loading text="Bringing your recipe to the table..." />;

  if (error || !recipe)
    return (
      <div className="mx-auto max-w-5xl px-5 py-16">
        <ErrorState message={error || "Recipe not found."} />
      </div>
    );
    
  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-9 sm:px-8">
      <Link
        to="/recipes"
        className="inline-flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-terracotta"
      >
        <ArrowLeft size={16} /> Back to recipes
      </Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="overflow-hidden rounded-[30px] bg-orange-100">
          <div className="aspect-[1.18]">
            {recipe.image && !imageFailed ? (
              <img
                src={recipe.image}
                alt={recipe.title}
                onError={() => setImageFailed(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-stone-400">
                <ImageOff size={48} />
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="mb-5 flex flex-wrap gap-2">
            {recipe.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-[#e8eedf] px-3 py-1.5 text-xs font-bold text-leaf"
              >
                {t}
              </span>
            ))}
            {recipe.status === "draft" && (
              <span className="rounded-full bg-orange-100 px-3 py-1.5 text-xs font-bold text-terracotta">
                Draft
              </span>
            )}
          </div>
          <h1 className="font-display text-5xl leading-[1.12] font-semibold tracking-tight sm:text-6xl">
            {recipe.title}
          </h1>
          <p className="mt-5 text-base leading-8 text-stone-500">
            {recipe.description || "A delicious recipe waiting for its story."}
          </p>
          <div className="mt-8 flex flex-wrap gap-7 border-y border-stone-200 py-6 text-sm font-bold">
            <span className="flex items-center gap-2">
              <Clock3 size={20} className="text-terracotta" />
              {minutes(recipe)} minutes
            </span>
            <span className="flex items-center gap-2">
              <UsersRound size={20} className="text-terracotta" />
              {recipe.servings} servings
            </span>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to={`/recipes/${recipe.id}/edit`} className="btn-primary">
              <Pencil size={16} /> Edit recipe
            </Link>
            {recipe.status === "draft" && (
              <button onClick={publish} disabled={busy} className="btn-light">
                <Send size={16} /> Publish
              </button>
            )}
            <button
              className="btn-light text-red-600"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
          {actionError && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {actionError}
            </p>
          )}
        </div>
      </div>
      <div className="mt-16 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="card h-fit p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">
                What you'll need
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold">
                Ingredients
              </h2>
            </div>
            <div className="inline-flex items-center gap-3 rounded-full bg-stone-100 p-1.5">
              <button
                onClick={() => setServings((n) => Math.max(1, n - 1))}
                disabled={servings <= 1}
                aria-label="Decrease servings"
                className="grid size-8 place-items-center rounded-full bg-white disabled:opacity-40"
              >
                <Minus size={15} />
              </button>
              <span
                className="min-w-5 text-center text-sm font-extrabold"
                aria-live="polite"
              >
                {servings}
              </span>
              <button
                onClick={() => setServings((n) => n + 1)}
                aria-label="Increase servings"
                className="grid size-8 place-items-center rounded-full bg-white"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs text-stone-500">
            Adjust servings to scale quantities.
          </p>
          <ul className="mt-6 divide-y divide-stone-100">
            {recipe.ingredients.map((i) => (
              <li
                key={i.id}
                className="flex items-center justify-between gap-4 py-4 text-sm"
              >
                <span className="text-stone-700">{i.name}</span>
                <span className="whitespace-nowrap font-extrabold">
                  {scaleQuantity(i.quantity, recipe.servings, servings)}{" "}
                  {i.unit}
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">
            Let's get cooking
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold">
            Step-by-step
          </h2>
          <div className="mt-7 space-y-5">
            {[...recipe.steps]
              .sort((a, b) => a.order - b.order)
              .map((step, n) => (
                <div
                  className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-5"
                  key={step.id}
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e8eedf] text-sm font-extrabold text-leaf">
                    {String(n + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-bold">Step {n + 1}</h3>
                    <p className="mt-1 text-sm leading-7 text-stone-600">
                      {step.instruction}
                    </p>
                  </div>
                  <Check
                    size={17}
                    className="ml-auto shrink-0 text-stone-300"
                  />
                </div>
              ))}
          </div>
        </section>
      </div>
      {deleteOpen && (
        <ConfirmDialog
          onCancel={() => setDeleteOpen(false)}
          onConfirm={remove}
          busy={busy}
        />
      )}
    </div>
  );
}
