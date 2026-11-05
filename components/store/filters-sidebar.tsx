import { CATEGORIES } from "@/lib/products";
import { Asset } from "./asset";

const SECTION_LABEL =
  "text-10-5 font-semibold tracking-[0.945px] text-secondary";

function PriceInput({ label }: { label: string }) {
  return (
    <div className="flex h-[34px] w-[98px] items-center gap-2 rounded-[10px] bg-input pl-3 text-12">
      <span className="text-muted">$</span>
      <span className="text-secondary">{label}</span>
    </div>
  );
}

export function FiltersSidebar() {
  return (
    <aside
      aria-label="Filters"
      className="hidden h-[700px] w-[270px] shrink-0 flex-col rounded-2xl bg-surface px-[22px] pt-7 lg:flex"
    >
      <div className="flex h-[18px] items-center justify-between">
        <h2 className="text-14 font-semibold">Filters</h2>
        <div className="flex items-center gap-[5px]">
          <Asset src="icon-rotate-orange.svg" width={12} />
          <span className="text-11-5 font-medium text-orange-text">
            Reset Filters
          </span>
        </div>
      </div>

      <div className="mt-7 flex h-[38px] items-center gap-2.5 rounded-[18px] bg-input pl-3.5">
        <Asset src="icon-search.svg" width={14} />
        <span className="text-12 text-muted">Search products...</span>
      </div>

      <h3 className={`mt-7 ${SECTION_LABEL}`}>CATEGORY</h3>
      <ul className="mt-[11px] flex flex-col gap-[7px]">
        {CATEGORIES.map((category) => (
          <li
            key={category.name}
            className={`flex h-[38px] items-center gap-3 rounded-[19px] pl-[5px] text-13 ${
              category.active
                ? "bg-active font-medium text-primary"
                : "text-secondary"
            }`}
          >
            <Asset src={category.image} width={28} />
            {category.name}
          </li>
        ))}
      </ul>

      <h3 className={`mt-[49px] ${SECTION_LABEL}`}>PRICE RANGE</h3>
      <Asset
        src="price-slider.svg"
        width={226}
        height={14}
        className="mt-[15px]"
      />
      <div className="mt-3.5 flex items-center gap-2">
        <PriceInput label="Min" />
        <span className="text-12 text-muted">–</span>
        <PriceInput label="Max" />
      </div>
    </aside>
  );
}
