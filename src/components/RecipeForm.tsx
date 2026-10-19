import { useEffect, useMemo, useState } from "react";
import { Link, useBlocker, useBeforeUnload } from "react-router-dom";
import {
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  Send,
  Image as ImageIcon,
  X,
} from "lucide-react";
import type {
  Recipe,
  RecipePayload,
  Ingredient,
  RecipeStep,
  RecipeStatus,
} from "../types/recipe";
import { validateRecipe } from "../utils/recipe";
const uid = () => crypto.randomUUID();
const blankIngredient = (): Ingredient => ({
  id: uid(),
  name: "",
  quantity: 0,
  unit: "",
});
const blankStep = (): RecipeStep => ({ id: uid(), order: 1, instruction: "" });
const empty = (): RecipePayload => ({
  title: "",
  description: "",
  servings: 2,
  prepTime: 10,
  cookTime: 20,
  tags: [],
  status: "draft",
  image: "",
  ingredients: [blankIngredient()],
  steps: [blankStep()],
});

export default function RecipeForm({
  recipe,
  onSave,
  submitting,
  error,
}: {
  recipe?: Recipe;
  onSave: (data: RecipePayload) => Promise<void>;
  submitting: boolean;
  error: string;
}) {
  const [data, setData] = useState<RecipePayload>(() =>
    recipe ? (({ id: _, ...rest }) => rest)(recipe) : empty(),
  );
  const [tagText, setTagText] = useState(() => recipe?.tags.join(", ") || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty && !saved && currentLocation.pathname !== nextLocation.pathname,
  );
  useBeforeUnload((e) => {
    if (dirty && !saved) {
      e.preventDefault();
      e.returnValue = "";
    }
  });

  useEffect(() => {
    if (recipe) {
      const { id: _, ...body } = recipe;
      setData(body);
      setTagText(recipe.tags.join(", "));
      setDirty(false);
      setSaved(false);
    }
  }, [recipe]);

  const set = <K extends keyof RecipePayload>(
    key: K,
    value: RecipePayload[K],
  ) => {
    setDirty(true);
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => {
      const copy = { ...e };
      delete copy[key];
      return copy;
    });
  };

  const normalized = useMemo(
    () => ({
      ...data,
      tags: [
        ...new Set(
          tagText
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        ),
      ],
      ingredients: data.ingredients.filter(
        (i) => i.name.trim() || i.quantity > 0 || i.unit.trim(),
      ),
      steps: data.steps
        .filter((s) => s.instruction.trim())
        .map((s, index) => ({ ...s, order: index + 1 })),
    }),
    [data, tagText],
  );

  async function submit(status: RecipeStatus) {
    const next = { ...normalized, status };
    const validation = validateRecipe(next, status);
    setErrors(validation);
    if (Object.keys(validation).length) {
      document.getElementById("recipe-title")?.focus();
      return;
    }
    setDirty(false);
    try {
      await onSave(next);
      setSaved(true);
    } catch {
      setDirty(true); /* Error is shown by page */
    }
  }

  function updateIngredient(
    id: string,
    key: keyof Ingredient,
    value: string | number,
  ) {
    setDirty(true);
    setData((d) => ({
      ...d,
      ingredients: d.ingredients.map((i) =>
        i.id === id ? { ...i, [key]: value } : i,
      ),
    }));
  }

  function updateStep(id: string, instruction: string) {
    setDirty(true);
    setData((d) => ({
      ...d,
      steps: d.steps.map((s) => (s.id === id ? { ...s, instruction } : s)),
    }));
  }
  
  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-9 sm:px-8">
      <Link
        to="/recipes"
        className="inline-flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-terracotta"
      >
        <ArrowLeft size={16} /> Back to recipes
      </Link>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-terracotta">
            Your kitchen notebook
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
            {recipe ? "Edit your recipe" : "Create something delicious"}
          </h1>
          <p className="mt-3 text-sm text-stone-500">
            From the first ingredient to the finishing touch, tell your food
            story.
          </p>
        </div>
        <div className="rounded-full bg-[#e8eedf] px-4 py-2 text-xs font-extrabold text-leaf">
          {data.status === "draft" ? "● Draft" : "● Published"}
        </div>
      </div>
      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
        >
          {error}
        </div>
      )}
      <form
        className="mt-9 grid gap-7 lg:grid-cols-[1.25fr_0.75fr]"
        onSubmit={(e) => {
          e.preventDefault();
          void submit("draft");
        }}
        noValidate
      >
        <div className="space-y-7">
          <section className="card p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-orange-100 font-extrabold text-terracotta">
                01
              </span>
              <h2 className="font-display text-2xl font-semibold">
                Recipe details
              </h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="label" htmlFor="recipe-title">
                  Recipe title <span className="text-terracotta">*</span>
                </label>
                <input
                  className="input"
                  id="recipe-title"
                  value={data.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Sunday lemon pasta"
                  aria-invalid={!!errors.title}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-600">{errors.title}</p>
                )}
              </div>
              <div>
                <label className="label" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  className="input min-h-30 resize-y"
                  value={data.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="What makes this recipe special?"
                  aria-invalid={!!errors.description}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>
              <div>
                <label className="label" htmlFor="tags">
                  Categories & tags
                </label>
                <input
                  id="tags"
                  className="input"
                  value={tagText}
                  onChange={(e) => {
                    setDirty(true);
                    setTagText(e.target.value);
                  }}
                  placeholder="Italian, Dinner, Vegetarian"
                />
                <p className="mt-1.5 text-xs text-stone-400">
                  Separate tags with commas
                </p>
              </div>
            </div>
          </section>
          <section className="card p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-orange-100 font-extrabold text-terracotta">
                02
              </span>
              <h2 className="font-display text-2xl font-semibold">
                Ingredients
              </h2>
            </div>
            <div className="space-y-4">
              {data.ingredients.map((i, n) => (
                <div
                  key={i.id}
                  className="grid grid-cols-[1fr_92px] gap-2 sm:grid-cols-[1fr_100px_110px_36px]"
                >
                  <label className="sr-only" htmlFor={`ingredient-${i.id}`}>
                    Ingredient {n + 1}
                  </label>
                  <input
                    id={`ingredient-${i.id}`}
                    className="input"
                    placeholder="Ingredient"
                    value={i.name}
                    onChange={(e) =>
                      updateIngredient(i.id, "name", e.target.value)
                    }
                  />
                  <label className="sr-only" htmlFor={`quantity-${i.id}`}>
                    Quantity {n + 1}
                  </label>
                  <input
                    id={`quantity-${i.id}`}
                    className="input"
                    type="number"
                    min="0"
                    step="any"
                    value={i.quantity || ""}
                    placeholder="Qty"
                    onChange={(e) =>
                      updateIngredient(
                        i.id,
                        "quantity",
                        e.target.value === "" ? 0 : Number(e.target.value),
                      )
                    }
                  />
                  <label className="sr-only" htmlFor={`unit-${i.id}`}>
                    Unit {n + 1}
                  </label>
                  <input
                    id={`unit-${i.id}`}
                    className="input"
                    value={i.unit}
                    placeholder="g / cups"
                    onChange={(e) =>
                      updateIngredient(i.id, "unit", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    aria-label={`Remove ingredient ${n + 1}`}
                    disabled={data.ingredients.length === 1}
                    className="grid h-11 w-9 place-items-center text-stone-400 hover:text-red-600 disabled:opacity-25"
                    onClick={() =>
                      set(
                        "ingredients",
                        data.ingredients.filter((row) => row.id !== i.id),
                      )
                    }
                  >
                    <Trash2 size={17} />
                  </button>
                  {errors[`ingredient-${n}`] && (
                    <p className="col-span-full text-xs text-red-600">
                      {errors[`ingredient-${n}`]}
                    </p>
                  )}
                </div>
              ))}
              {errors.ingredients && (
                <p className="text-xs text-red-600">{errors.ingredients}</p>
              )}
              <button
                type="button"
                className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-terracotta"
                onClick={() =>
                  set("ingredients", [...data.ingredients, blankIngredient()])
                }
              >
                <Plus size={16} /> Add ingredient
              </button>
            </div>
          </section>
          <section className="card p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-orange-100 font-extrabold text-terracotta">
                03
              </span>
              <h2 className="font-display text-2xl font-semibold">
                Cooking steps
              </h2>
            </div>
            <div className="space-y-4">
              {data.steps.map((s, n) => (
                <div className="flex items-start gap-3" key={s.id}>
                  <span className="mt-2 grid size-9 shrink-0 place-items-center rounded-full bg-[#e8eedf] text-sm font-extrabold text-leaf">
                    {n + 1}
                  </span>
                  <label className="sr-only" htmlFor={`step-${s.id}`}>
                    Step {n + 1}
                  </label>
                  <textarea
                    id={`step-${s.id}`}
                    rows={2}
                    className="input flex-1 resize-y"
                    placeholder="Describe this step..."
                    value={s.instruction}
                    onChange={(e) => updateStep(s.id, e.target.value)}
                  />
                  <button
                    type="button"
                    aria-label={`Remove step ${n + 1}`}
                    disabled={data.steps.length === 1}
                    className="mt-2 text-stone-400 hover:text-red-600 disabled:opacity-25"
                    onClick={() =>
                      set(
                        "steps",
                        data.steps.filter((row) => row.id !== s.id),
                      )
                    }
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
              {errors.steps && (
                <p className="text-xs text-red-600">{errors.steps}</p>
              )}
              <button
                type="button"
                className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-terracotta"
                onClick={() =>
                  set("steps", [
                    ...data.steps,
                    { ...blankStep(), order: data.steps.length + 1 },
                  ])
                }
              >
                <Plus size={16} /> Add step
              </button>
            </div>
          </section>
        </div>
        <aside className="space-y-7">
          <section className="card p-6">
            <h2 className="font-display text-2xl font-semibold">At a glance</h2>
            <div className="mt-6 space-y-5">
              <div>
                <label htmlFor="servings" className="label">
                  Servings
                </label>
                <input
                  id="servings"
                  type="number"
                  min="1"
                  step="1"
                  className="input"
                  value={data.servings}
                  onChange={(e) => set("servings", Number(e.target.value))}
                />
                {errors.servings && (
                  <p className="mt-1 text-xs text-red-600">{errors.servings}</p>
                )}
              </div>
              <div>
                <label htmlFor="prep" className="label">
                  Prep time (minutes)
                </label>
                <input
                  id="prep"
                  type="number"
                  min="0"
                  className="input"
                  value={data.prepTime}
                  onChange={(e) => set("prepTime", Number(e.target.value))}
                />
                {errors.prepTime && (
                  <p className="mt-1 text-xs text-red-600">{errors.prepTime}</p>
                )}
              </div>
              <div>
                <label htmlFor="cook" className="label">
                  Cook time (minutes)
                </label>
                <input
                  id="cook"
                  type="number"
                  min="0"
                  className="input"
                  value={data.cookTime}
                  onChange={(e) => set("cookTime", Number(e.target.value))}
                />
                {errors.cookTime && (
                  <p className="mt-1 text-xs text-red-600">{errors.cookTime}</p>
                )}
              </div>
            </div>
          </section>
          <section className="card p-6">
            <div className="mb-5 flex items-center gap-2">
              <ImageIcon size={19} className="text-terracotta" />
              <h2 className="font-display text-2xl font-semibold">
                Cover photo
              </h2>
            </div>
            <label className="label" htmlFor="image">
              Image URL
            </label>
            <input
              id="image"
              className="input"
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={data.image || ""}
              onChange={(e) => set("image", e.target.value)}
            />
            {data.image && (
              <div className="mt-4 overflow-hidden rounded-xl bg-stone-100">
                <img
                  src={data.image}
                  alt="Recipe preview"
                  className="aspect-[1.5] w-full object-cover"
                />
              </div>
            )}
            <p className="mt-3 text-xs leading-5 text-stone-400">
              Paste an image link. This project stores URLs in JSON Server
              rather than uploading image files.
            </p>
          </section>
          <section className="card sticky top-24 p-6">
            <h2 className="font-display text-2xl font-semibold">
              Ready to save?
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              Save a draft to finish later, or publish to add it to the
              collection.
            </p>
            <div className="mt-5 grid gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="btn-light w-full"
              >
                <Save size={17} />
                {submitting ? "Saving..." : "Save as draft"}
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => void submit("published")}
                className="btn-primary w-full"
              >
                <Send size={17} />
                {submitting ? "Publishing..." : "Publish recipe"}
              </button>
            </div>
          </section>
        </aside>
      </form>
      {blocker.state === "blocked" && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/50 p-5">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="leave-title"
            className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 id="leave-title" className="font-display text-2xl">
                Discard your changes?
              </h2>
              <button
                className="rounded-lg p-2 hover:bg-stone-100"
                aria-label="Close"
                onClick={() => blocker.reset()}
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-3 text-sm text-stone-500">
              You have unsaved changes that will be lost if you leave.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button className="btn-light" onClick={() => blocker.reset()}>
                Keep editing
              </button>
              <button
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white"
                onClick={() => blocker.proceed()}
              >
                Discard changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
