import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-28 text-center">
      <div className="font-display text-8xl font-semibold text-terracotta">
        404
      </div>
      <h1 className="mt-4 font-display text-4xl">
        This page isn't on the menu.
      </h1>
      <p className="mt-4 text-stone-500">
        Let's get you back to something delicious.
      </p>
      <Link to="/recipes" className="btn-primary mt-8">
        <ArrowLeft size={16} /> Back to recipes
      </Link>
    </div>
  );
}
