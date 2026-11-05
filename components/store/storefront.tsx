"use client";

import { useEffect, useReducer, useRef, type CSSProperties } from "react";
import {
  CLOSE_MS,
  INITIAL_STATE,
  TIMELINE,
  canPick,
  fittingRoomReducer,
  isPanelOpen,
} from "@/lib/fitting-room";
import { buildGarmentFlight } from "@/lib/garment-flight";
import { PRODUCTS, type Product, type WearableId } from "@/lib/products";
import { Asset } from "./asset";
import { FiltersSidebar } from "./filters-sidebar";
import { FittingRoomPanel } from "./fitting-room-panel";
import { NavBar } from "./nav-bar";
import { ProductCard, type CardMode } from "./product-card";

const WEARABLE_PRODUCTS = PRODUCTS.filter((product) => product.wearableId);

type ActiveFlight = {
  element: HTMLElement;
  animation: Animation;
  home: string;
};

export function Storefront() {
  const [state, dispatch] = useReducer(fittingRoomReducer, INITIAL_STATE);
  const { phase, productId } = state;
  const panelOpen = isPanelOpen(phase);

  const panelRef = useRef<HTMLElement>(null);
  const garmentRefs = useRef<Partial<Record<WearableId, HTMLImageElement>>>({});
  const flightRef = useRef<ActiveFlight | null>(null);
  const lastCardRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const step = TIMELINE[phase];
    if (!step) return;
    const timer = setTimeout(() => dispatch({ type: "advance" }), step.after);
    return () => clearTimeout(timer);
  }, [phase]);

  function launchGarment(id: WearableId, card: HTMLElement) {
    const element = garmentRefs.current[id];
    if (!element) return;
    const { keyframes, duration, easing, home } = buildGarmentFlight(
      card.getBoundingClientRect(),
      window.innerHeight,
    );
    flightRef.current = {
      element,
      animation: element.animate(keyframes, { duration, easing }),
      home,
    };
  }

  /** Closing mid-flight sends the garment back to its card, like 02 → 01 in the prototype. */
  function recallGarment() {
    const flight = flightRef.current;
    if (!flight || flight.animation.playState !== "running") return;
    const { transform, opacity } = getComputedStyle(flight.element);
    flight.animation.cancel();
    flight.element.animate(
      [
        { transform, opacity },
        { transform: flight.home, opacity: 0 },
      ],
      { duration: CLOSE_MS, easing: "ease-in-out" },
    );
  }

  function handleTryOn(product: Product, card: HTMLElement) {
    const id = product.wearableId;
    if (!id || !canPick(phase)) return;
    lastCardRef.current = card;
    const skipFlight = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!skipFlight) launchGarment(id, card);
    dispatch({ type: "pick", id, skipFlight });
  }

  function handleClose() {
    recallGarment();
    // The panel is about to become inert, so don't strand keyboard focus inside it.
    if (panelRef.current?.contains(document.activeElement)) {
      lastCardRef.current
        ?.querySelector("button")
        ?.focus({ preventScroll: true });
    }
    dispatch({ type: "close" });
  }

  function cardMode(product: Product): CardMode {
    if (!panelOpen) return "shop";
    return product.wearableId === productId ? "picked" : "fitting";
  }

  // Cards change mode with the screen transition; hover keeps its own timing.
  const cardMotion =
    phase === "lift" || phase === "closing" ? "var(--motion-nav)" : undefined;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 min-[1440px]:pr-[67px] min-[1440px]:pl-[68px]">
      <NavBar />

      <main>
        <div className="flex flex-wrap items-start justify-between gap-y-2 pt-1 lg:pr-[35px] lg:pl-[25px]">
          <div className="flex items-baseline gap-2.5">
            <h1 className="text-29 font-bold">
              New Arrivals
            </h1>
            <p className="text-13 text-secondary">5 products</p>
          </div>
          <div className="flex h-9 w-[180px] items-center justify-between rounded-[10px] bg-surface px-3.5">
            <span className="text-13">Newest</span>
            <Asset src="icon-chevron-sort.svg" width={14} />
          </div>
        </div>

        <div className="flex gap-8 pt-[21px] pb-[78px] lg:pr-[34px] lg:pl-[21px]">
          <FiltersSidebar />
          <div
            className="grid min-w-0 flex-1 grid-cols-[repeat(auto-fill,300px)] content-start justify-center gap-6"
            style={{ "--card-motion": cardMotion } as CSSProperties}
          >
            {PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                mode={cardMode(product)}
                onTryOn={handleTryOn}
                onRemove={handleClose}
              />
            ))}
          </div>
        </div>
      </main>

      <FittingRoomPanel ref={panelRef} state={state} onClose={handleClose} />

      {WEARABLE_PRODUCTS.map((product) => (
        <Asset
          key={product.id}
          ref={(element) => {
            if (element && product.wearableId) {
              garmentRefs.current[product.wearableId] = element;
            }
          }}
          src={`garment-${product.wearableId}.png`}
          width={196}
          height={185}
          className="pointer-events-none fixed top-0 left-0 z-50 object-cover opacity-0 [will-change:transform,opacity]"
          eager
        />
      ))}
    </div>
  );
}
