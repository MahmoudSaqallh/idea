import type { WearableId } from "./products";

/**
 * Durations come from the prototype reactions in Figma:
 * 01→02 Smart Animate 350ms ease-in-out, then after 10ms
 * 02→03 400ms ease-out, then after 1.6s 03→04 450ms ease-out.
 */
export const LIFT_MS = 350;
export const HOLD_MS = 10;
export const LAND_MS = 400;
export const DRESSING_MS = 1600;
export const CLOSE_MS = 350;

export type Phase =
  | "closed"
  | "lift" // screens 02 / 05
  | "land" // screens 03 / 06
  | "dressing" // screens 03 / 06
  | "worn" // screens 04 / 07
  | "closing";

export type FittingRoomState = {
  phase: Phase;
  productId: WearableId | null;
  /** True once the model photo is shown. Survives "closing" so the panel doesn't flash the dressing state. */
  revealed: boolean;
};

export type FittingRoomAction =
  | { type: "pick"; id: WearableId; skipFlight: boolean }
  | { type: "advance" }
  | { type: "close" };

export const INITIAL_STATE: FittingRoomState = {
  phase: "closed",
  productId: null,
  revealed: false,
};

export const TIMELINE: Partial<Record<Phase, { after: number; next: Phase }>> = {
  lift: { after: LIFT_MS + HOLD_MS, next: "land" },
  land: { after: LAND_MS, next: "dressing" },
  dressing: { after: DRESSING_MS, next: "worn" },
  closing: { after: CLOSE_MS, next: "closed" },
};

export function canPick(phase: Phase) {
  return phase === "closed" || phase === "worn";
}

export function isPanelOpen(phase: Phase) {
  return phase !== "closed" && phase !== "closing";
}

export function fittingRoomReducer(
  state: FittingRoomState,
  action: FittingRoomAction,
): FittingRoomState {
  switch (action.type) {
    case "pick":
      if (!canPick(state.phase)) return state;
      return {
        phase: action.skipFlight ? "dressing" : "lift",
        productId: action.id,
        revealed: false,
      };
    case "advance": {
      const next = TIMELINE[state.phase]?.next;
      if (!next) return state;
      if (next === "closed") return INITIAL_STATE;
      return { ...state, phase: next, revealed: next === "worn" };
    }
    case "close":
      if (!isPanelOpen(state.phase)) return state;
      return { ...state, phase: "closing" };
  }
}
