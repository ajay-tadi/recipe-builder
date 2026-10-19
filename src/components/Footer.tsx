import Logo from "./Logo";
export default function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Logo />
        <p className="text-sm text-stone-500">
          Good food. Good stories. Every day.
        </p>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
          Made for curious cooks ✳
        </p>
      </div>
    </footer>
  );
}
