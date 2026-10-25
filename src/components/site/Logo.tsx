import { Link } from "@tanstack/react-router";
import mark from "@/assets/de-monogram.png";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="Deborah Ezeadila — home">
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${light ? "bg-petal" : "bg-petal ring-1 ring-blush"}`}>
        <img src={mark} alt="" width={816} height={816} className="h-8 w-8 object-contain" />
      </span>
      <span className="leading-tight">
        <span className={`block font-display text-lg ${light ? "text-petal" : "text-oxblood"}`}>Deborah Ezeadila</span>
        <span className={`block text-[0.68rem] font-semibold uppercase tracking-[0.2em] ${light ? "text-blush" : "text-berry"}`}>
          Shopify Specialist
        </span>
      </span>
    </Link>
  );
}
