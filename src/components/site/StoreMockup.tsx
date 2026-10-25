/** Illustrative Shopify-style storefront mockup (concept artwork, not a client store). */
function Product({ tone, name, price }: { tone: string; name: string; price: string }) {
  return (
    <div>
      <div className={`aspect-[4/5] rounded-lg ${tone}`} />
      <div className="mt-2 h-2 w-3/4 rounded bg-plum/70" aria-hidden />
      <p className="sr-only">{name}</p>
      <div className="mt-1.5 text-[0.6rem] font-bold text-berry">{price}</div>
    </div>
  );
}

export function StoreMockup() {
  return (
    <div className="relative mx-auto w-full max-w-xl" aria-label="Illustration of a Shopify storefront on desktop and mobile" role="img">
      <div className="rounded-2xl bg-card p-2 shadow-soft ring-1 ring-blush">
        <div className="flex items-center gap-1.5 px-2 py-1.5">
          <span className="h-2 w-2 rounded-full bg-blush" /><span className="h-2 w-2 rounded-full bg-blush" /><span className="h-2 w-2 rounded-full bg-blush" />
          <span className="ml-3 h-4 flex-1 rounded-full bg-muted" />
        </div>
        <div className="overflow-hidden rounded-xl bg-petal">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <span className="font-display text-sm text-oxblood">Maison Rosé</span>
            <span className="flex gap-3 text-[0.55rem] font-semibold uppercase tracking-widest text-plum/70"><span>Shop</span><span>New</span><span>Cart (2)</span></span>
          </div>
          <div className="grid grid-cols-5 gap-0">
            <div className="col-span-3 flex flex-col justify-center gap-2 bg-oxblood p-5">
              <span className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-blush">Autumn edit</span>
              <span className="font-display text-xl leading-tight text-petal sm:text-2xl">Pieces made to be lived in.</span>
              <span className="mt-1 w-fit rounded-full bg-berry px-3 py-1 text-[0.55rem] font-bold text-petal">Shop now</span>
            </div>
            <div className="col-span-2 bg-blush" />
          </div>
          <div className="grid grid-cols-4 gap-3 p-4">
            <Product tone="bg-blush" name="Linen tote" price="$48" />
            <Product tone="bg-secondary" name="Silk scarf" price="$62" />
            <Product tone="bg-berry/70" name="Candle" price="$28" />
            <Product tone="bg-muted" name="Ceramic cup" price="$34" />
          </div>
        </div>
      </div>
      <div className="absolute -bottom-8 -right-2 w-[30%] min-w-24 rounded-[1.4rem] bg-plum p-1.5 shadow-soft sm:-right-6">
        <div className="overflow-hidden rounded-[1.1rem] bg-petal">
          <div className="mx-auto mt-1.5 h-1.5 w-8 rounded-full bg-plum/20" />
          <div className="px-2.5 py-2 font-display text-[0.6rem] text-oxblood">Maison Rosé</div>
          <div className="aspect-[4/5] bg-blush" />
          <div className="space-y-1.5 p-2.5">
            <div className="h-1.5 w-3/4 rounded bg-plum/70" />
            <div className="text-[0.55rem] font-bold text-berry">$62</div>
            <div className="rounded-full bg-oxblood py-1 text-center text-[0.5rem] font-bold text-petal">Add to cart</div>
          </div>
        </div>
      </div>
    </div>
  );
}
