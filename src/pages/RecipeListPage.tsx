import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
} from "lucide-react";
import { recipeApi } from "../api/recipeApi";
import type { Recipe } from "../types/recipe";
import RecipeCard from "../components/RecipeCard";
import { Loading, ErrorState, EmptyState } from "../components/State";
import { HERO } from "../utils";

export default function RecipeListPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("All recipes");
  const [params, setParams] = useSearchParams();
  const status = params.get("status") || "all";
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    recipeApi
      .list(controller.signal)
      .then(setRecipes)
      .catch((e) => {
        if (e?.code !== "ERR_CANCELED")
          setError(
            "Could not reach JSON Server.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [refresh]);

  const tags = useMemo(
    () => ["All recipes", ...new Set(recipes.flatMap((r) => r.tags))],
    [recipes],
  );

  const filtered = useMemo(
    () =>
      recipes.filter(
        (r) =>
          (status === "all" || r.status === status) &&
          (tag === "All recipes" || r.tags.includes(tag)) &&
          `${r.title} ${r.description} ${r.tags.join(" ")}`
            .toLowerCase()
            .includes(search.trim().toLowerCase()),
      ),
    [recipes, status, tag, search],
  );

  const isDraft = status === "draft";
  
  return (
    <>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-12 pt-12 sm:px-8 lg:grid-cols-[0.93fr_1.07fr] lg:gap-12 lg:pb-20 lg:pt-16">
        <div className="max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-terracotta">
            <Sparkles size={14} /> The joy of home cooking
          </div>
          <h1 className="font-display text-[clamp(3.5rem,6vw,5.65rem)] leading-[1.08] font-semibold tracking-[-0.06em]">
            Every great meal{" "}
            <span className="italic text-terracotta">starts here.</span>
          </h1>
          <p className="mt-7 max-w-md text-base leading-8 text-stone-500 sm:text-lg">
            Discover something delicious, save what you love, and make every
            recipe your own. Your next favorite dish is waiting.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#collection" className="btn-primary">
              Explore recipes <ArrowRight size={17} />
            </a>
            <Link
              to="/recipes/new"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-ink hover:text-terracotta"
            >
              Share a recipe <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="mt-12 flex items-center gap-8 border-t border-stone-200 pt-6">
            <div>
              <span className="font-display text-3xl font-semibold">
                {recipes.length || "16"}
                <span className="text-terracotta">+</span>
              </span>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-stone-400">
                Tasty recipes
              </p>
            </div>
            <div className="h-10 w-px bg-stone-200" />
            <div>
              <span className="font-display text-3xl font-semibold">100%</span>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-stone-400">
                Made with love
              </p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[1.14] overflow-hidden rounded-[34px] bg-orange-100 sm:aspect-[1.28] lg:aspect-[1.02]">
            <img
              src={HERO}
              alt="Beautifully prepared fresh food"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-4 rounded-2xl border border-stone-100 bg-white px-5 py-4 shadow-xl shadow-stone-900/10 sm:-left-5">
            <span className="text-2xl">🍋</span>
            <div className="mt-1 text-sm font-extrabold">
              Fresh ideas, daily.
            </div>
            <div className="mt-1 text-xs text-stone-500">
              A little inspiration for your plate
            </div>
          </div>
          <div className="absolute -right-3 -top-4 hidden size-24 rotate-12 items-center justify-center rounded-full bg-[#e4e8ce] text-center text-[11px] font-extrabold uppercase leading-4 tracking-wide text-leaf sm:flex">
            COOK
            <br />
            CREATE
            <br />
            REPEAT ✳
          </div>
        </div>
      </section>
      <section
        id="collection"
        className="border-t border-stone-200 bg-white/60 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-terracotta">
                A little inspiration
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                {isDraft ? "Your recipe drafts" : "Explore the collection"}
              </h2>
              <p className="mt-3 text-sm text-stone-500">
                {isDraft
                  ? "Pick up where you left off."
                  : "Something delicious for every craving and occasion."}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-stone-500">
              <span className="size-2 rounded-full bg-leaf" />
              {filtered.length} {filtered.length === 1 ? "recipe" : "recipes"}{" "}
              found
            </div>
          </div>
          <div className="mt-9 flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center">
            <label className="relative min-w-0 flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <span className="sr-only">Search recipes</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search recipes or ingredients..."
                className="input pl-11"
                type="search"
              />
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <SlidersHorizontal size={16} className="mr-1 text-stone-400" />
              <button
                onClick={() => setParams({})}
                className={`rounded-full px-4 py-2 text-xs font-bold ${status === "all" ? "bg-ink text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
              >
                All
              </button>
              <button
                onClick={() => setParams({ status: "published" })}
                className={`rounded-full px-4 py-2 text-xs font-bold ${status === "published" ? "bg-ink text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
              >
                Published
              </button>
              <button
                onClick={() => setParams({ status: "draft" })}
                className={`rounded-full px-4 py-2 text-xs font-bold ${status === "draft" ? "bg-ink text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
              >
                Drafts
              </button>
            </div>
          </div>
          <div
            className="mt-6 flex flex-wrap gap-2"
            aria-label="Filter by category"
          >
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={`rounded-full border px-4 py-2 text-xs font-bold transition ${tag === t ? "border-terracotta bg-orange-50 text-terracotta" : "border-stone-200 bg-white text-stone-500 hover:border-stone-400"}`}
              >
                {t}
              </button>
            ))}
            {(tag !== "All recipes" || search) && (
              <button
                className="flex items-center gap-1 rounded-full px-3 text-xs font-bold text-terracotta"
                onClick={() => {
                  setTag("All recipes");
                  setSearch("");
                }}
              >
                <X size={13} />
                Clear
              </button>
            )}
          </div>
          <div className="mt-9">
            {loading ? (
              <Loading />
            ) : error ? (
              <ErrorState
                message={error}
                onRetry={() => setRefresh((v) => v + 1)}
              />
            ) : filtered.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((r) => (
                  <RecipeCard key={r.id} recipe={r} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No recipes found"
                description="Try another category or search term, or create something new."
              />
            )}
          </div>
        </div>
      </section>
      <section className="bg-[#e9eddf] py-14">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 sm:px-8 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-leaf">
              From your kitchen to ours
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              Have something delicious to share?
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Give your go-to recipe a home.
            </p>
          </div>
          <Link to="/recipes/new" className="btn-primary shrink-0">
            Create a recipe <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
