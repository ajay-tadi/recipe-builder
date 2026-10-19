import { ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
export default function Logo() {
  return (
    <Link
      to="/recipes"
      className="inline-flex items-center gap-2.5 font-extrabold tracking-[-0.06em] text-2xl text-ink"
      aria-label="Plate and Story home"
    >
      <span className="grid size-9 place-items-center rounded-xl bg-terracotta text-white">
        <ChefHat size={21} />
      </span>
      plate<span className="text-terracotta">&</span>story
      <span className="text-terracotta">.</span>
    </Link>
  );
}
