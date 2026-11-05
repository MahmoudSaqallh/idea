import { Asset } from "./asset";

const LINKS = ["HOME", "SHOP", "NEW ARRIVALS", "SALE"];

export function NavBar() {
  return (
    <header className="relative flex h-[60px] items-center justify-between rounded-b-2xl bg-nav px-4 lg:px-[26px]">
      <ul className="hidden items-center gap-[30px] text-13 opacity-85 lg:flex">
        {LINKS.map((link) => (
          <li key={link}>{link}</li>
        ))}
      </ul>

      <p className="text-20 font-medium tracking-[7.6px] lg:absolute lg:top-[calc(50%-12.5px)] lg:left-[calc(50%-44px)]">
        STORE
      </p>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-1.5 rounded-2xl bg-surface px-2.5 py-[7px] sm:flex">
          <Asset src="icon-flag-us.svg" width={18} height={12} />
          <span className="text-12 font-medium">EN</span>
          <Asset src="icon-chevron-language.svg" width={12} />
        </div>
        <Asset src="icon-sun.svg" width={16} />
        <div className="hidden w-[138px] items-center gap-2 rounded-[17px] bg-surface py-[7px] pr-2 pl-3 sm:flex">
          <Asset src="icon-search.svg" width={14} />
          <span className="flex-1 text-12 text-secondary">Search</span>
          <span className="rounded-[5px] bg-chip px-1.5 py-0.5 text-9 font-medium text-secondary">
            ⌘K
          </span>
        </div>
        <Asset src="icon-user.svg" width={17} />
        <div className="relative size-[22px]">
          <Asset
            src="icon-bag.svg"
            width={18}
            className="absolute top-[3px] left-0"
          />
          <span className="absolute top-[-3px] left-[11px] flex size-3.5 items-center justify-center rounded-full bg-orange text-8-5 font-bold">
            2
          </span>
        </div>
      </div>
    </header>
  );
}
