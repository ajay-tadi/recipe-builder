import { Clock3, UsersRound, ArrowUpRight, ImageOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import type { Recipe } from "../types/recipe";
import { minutes } from "../utils/recipe";
export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [failed, setFailed] = useState(false);
  return (
    <article className="group overflow-hidden rounded-[22px] border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/60">
      <Link
        to={`/recipes/${recipe.id}`}
        className="block overflow-hidden"
        aria-label={`View ${recipe.title}`}
      >
        <div className="relative h-52 overflow-hidden bg-orange-50 sm:h-56">
          {recipe.image && !failed ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              loading="lazy"
              onError={() => setFailed(true)}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-stone-400">
              <ImageOff size={36} />
            </div>
          )}
          <div className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-extrabold shadow-sm">
            {recipe.tags[0] || "Homemade"}
          </div>
          {recipe.status === "draft" && (
            <span className="absolute top-4 right-4 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800">
              Draft
            </span>
          )}
        </div>
      </Link>
      <div className="p-5">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-terracotta">
          {recipe.tags.slice(1, 3).join("  ·  ") || "Fresh inspiration"}
        </div>
        <Link
          to={`/recipes/${recipe.id}`}
          className="flex items-start justify-between gap-2"
        >
          <h3 className="font-display text-[23px] leading-snug font-semibold tracking-tight group-hover:text-terracotta">
            {recipe.title}
          </h3>
          <ArrowUpRight
            size={19}
            className="mt-2 shrink-0 text-stone-400 transition group-hover:text-terracotta"
          />
        </Link>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-relaxed text-stone-500">
          {recipe.description}
        </p>
        <div className="mt-5 flex items-center gap-5 border-t border-stone-100 pt-4 text-xs font-semibold text-stone-500">
          <span className="flex items-center gap-1.5">
            <Clock3 size={16} className="text-terracotta" />
            {minutes(recipe)} min
          </span>
          <span className="flex items-center gap-1.5">
            <UsersRound size={16} className="text-terracotta" />
            {recipe.servings} servings
          </span>
        </div>
      </div>
    </article>
  );
}
