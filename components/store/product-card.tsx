import type { MouseEvent } from "react";
import type { Product } from "@/lib/products";
import { Asset } from "./asset";

/** Figma variants: Default = shop, Fitting = fitting, Picked = picked. Hover variants are the `card-active:` classes. */
export type CardMode = "shop" | "fitting" | "picked";

const HANGER_BY_MODE: Record<CardMode, string> = {
  shop: "bg-orange opacity-0 card-active:opacity-100 [@media(hover:none)]:opacity-100",
  fitting: "bg-chip card-active:bg-chip-hover",
  picked: "bg-orange",
};

type ProductCardProps = {
  product: Product;
  mode: CardMode;
  onTryOn: (product: Product, card: HTMLElement) => void;
  onRemove: () => void;
};

export function ProductCard({
  product,
  mode,
  onTryOn,
  onRemove,
}: ProductCardProps) {
  const wearable = Boolean(product.wearableId);
  const picked = mode === "picked";

  // The prototype makes the whole card the click target, so the card and the
  // hanger button both start the try-on. The heart and bag icons stay out of it.
  function handleCardClick(event: MouseEvent<HTMLElement>) {
    const target = event.target as HTMLElement;
    if (!wearable || picked || target.closest("[data-card-action]")) return;
    onTryOn(product, event.currentTarget);
  }

  function handleHangerClick(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (picked) {
      onRemove();
      return;
    }
    const card = event.currentTarget.closest("article");
    if (card) onTryOn(product, card);
  }

  return (
    <article
      onClick={handleCardClick}
      className={`product-card relative size-[300px] overflow-hidden rounded-xl bg-surface ${
        wearable && !picked ? "cursor-pointer" : ""
      }`}
    >
      <Asset
        src={product.image}
        width={196}
        height={185}
        alt={product.name}
        className="absolute top-[26px] left-[52px] object-cover"
      />

      <Asset
        src="hover-corner-active.svg"
        width={180}
        className="card-motion pointer-events-none absolute top-[210px] left-[210px] scale-[0.13333] opacity-0 card-active:scale-100 card-active:opacity-100"
      />

      <div
        data-card-action
        className="absolute top-[19px] left-[17px] flex size-[34px] items-center justify-center rounded-full bg-chip"
      >
        <Asset src="icon-heart.svg" width={16} />
      </div>

      <button
        type="button"
        disabled={!wearable}
        onClick={handleHangerClick}
        aria-label={
          picked
            ? `Remove ${product.name} from the fitting room`
            : `Try on ${product.name}`
        }
        className={`card-motion absolute top-[59px] left-[17px] flex size-[34px] items-center justify-center rounded-full outline-offset-2 outline-primary focus-visible:outline-2 enabled:cursor-pointer ${HANGER_BY_MODE[mode]}`}
      >
        <span className="relative size-4">
          <Asset
            src="icon-hanger-white.svg"
            width={16}
            className="absolute inset-0"
          />
          <Asset
            src="icon-hanger-grey.svg"
            width={16}
            className={`card-motion absolute inset-0 ${
              mode === "fitting"
                ? "opacity-100 card-active:opacity-0"
                : "opacity-0"
            }`}
          />
        </span>
      </button>

      <div className="absolute top-[19px] right-[17px] flex items-center gap-1 rounded-[11px] bg-rating px-2 py-1">
        <Asset src="icon-star.svg" width={11} />
        <span className="text-11 font-semibold">{product.rating}</span>
      </div>

      <div className="absolute top-[246px] left-[17px] flex flex-col items-start gap-[3px]">
        <h2 className="text-12 font-normal text-secondary">{product.name}</h2>
        <div className="flex items-center gap-[7px]">
          <span
            className={`text-17 font-bold ${
              product.oldPrice ? "text-orange-text" : "text-primary"
            }`}
          >
            {product.price}
          </span>
          {product.oldPrice && (
            <>
              <s className="text-12 text-muted">{product.oldPrice}</s>
              <span className="rounded-[4px] bg-sale px-1.5 py-0.5 text-9-5 font-semibold text-orange-text">
                Sale
              </span>
            </>
          )}
        </div>
      </div>

      <div data-card-action className="absolute top-[260px] left-[258px]">
        <Asset src="icon-bag-plus.svg" width={20} />
      </div>

      <div
        aria-hidden
        className={`card-motion pointer-events-none absolute top-[96px] left-10 rounded-md border border-white/8 bg-panel px-2 py-1 text-9-5 font-medium whitespace-nowrap text-secondary opacity-0 ${
          picked ? "card-active:opacity-100" : ""
        }`}
      >
        Remove from the fitting room
      </div>
    </article>
  );
}
