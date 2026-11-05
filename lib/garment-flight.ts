const GARMENT_W = 196;
const GARMENT_H = 185;
/** Where the garment image sits inside a 300×300 product card. */
const IMAGE_LEFT = 52;
const IMAGE_TOP = 26;

const PANEL_LEFT = 20;
const PANEL_HEIGHT = 590;
/** Centre of the landing spot inside the panel preview (screens 03 / 06). */
const LAND_X = 133.41;
const LAND_Y = 254.48;
const LAND_ROTATE = 14;
const LAND_SCALE_X = 98 / GARMENT_W;
const LAND_SCALE_Y = 92 / GARMENT_H;

/** Longer than the 760ms prototype path so the spin can be seen. The garment lands during "dressing". */
const FLIGHT_MS = 1100;
/** Slow start, long soft landing. */
const FLIGHT_EASING = "cubic-bezier(0.45, 0, 0.2, 1)";
/** How far the arc bulges, as a fraction of the card → panel distance. Higher is rounder. */
const ARC_HEIGHT = 0.28;
/** Full turns of the garment around itself. Negative turns the same way the arc travels. */
const SPIN_TURNS = -1;
/** Keyframes sampled along the arc. */
const ARC_STEPS = 60;

const FADE_IN_UNTIL = 0.15;
const FADE_OUT_FROM = 0.78;

/** Must match the open-panel `bottom` value in fitting-room-panel.tsx. */
function openPanelTop(viewportHeight: number) {
  const bottom = Math.max(12, Math.min(116, viewportHeight - 602));
  return viewportHeight - bottom - PANEL_HEIGHT;
}

function pose(
  centerX: number,
  centerY: number,
  rotate: number,
  scaleX: number,
  scaleY: number,
) {
  const x = centerX - GARMENT_W / 2;
  const y = centerY - GARMENT_H / 2;
  return `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scaleX}, ${scaleY})`;
}

function lerp(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function smoothstep(progress: number) {
  const clamped = Math.min(1, Math.max(0, progress));
  return clamped * clamped * (3 - 2 * clamped);
}

function opacityAt(progress: number) {
  return (
    smoothstep(progress / FADE_IN_UNTIL) *
    (1 - smoothstep((progress - FADE_OUT_FROM) / (1 - FADE_OUT_FROM)))
  );
}

/** A circular arc from start to end that bulges upwards. */
function createArc(startX: number, startY: number, endX: number, endY: number) {
  const dx = endX - startX;
  const dy = endY - startY;
  const chord = Math.hypot(dx, dy) || 1;

  // Unit vector perpendicular to the chord, pointing up the screen.
  const flip = dx > 0 ? -1 : 1;
  const normalX = (-dy / chord) * flip;
  const normalY = (dx / chord) * flip;

  const sagitta = chord * ARC_HEIGHT;
  const radius = (chord * chord) / (8 * sagitta) + sagitta / 2;
  const centerX = (startX + endX) / 2 + normalX * (sagitta - radius);
  const centerY = (startY + endY) / 2 + normalY * (sagitta - radius);

  const startAngle = Math.atan2(startY - centerY, startX - centerX);
  const endAngle = Math.atan2(endY - centerY, endX - centerX);
  // The arc is under a half circle, so the shortest way round is always the right one.
  const sweep = Math.atan2(
    Math.sin(endAngle - startAngle),
    Math.cos(endAngle - startAngle),
  );

  return (progress: number) => {
    const angle = startAngle + sweep * progress;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };
}

export function buildGarmentFlight(card: DOMRect, viewportHeight: number) {
  const startX = card.left + IMAGE_LEFT + GARMENT_W / 2;
  const startY = card.top + IMAGE_TOP + GARMENT_H / 2;
  const endX = PANEL_LEFT + LAND_X;
  const endY = openPanelTop(viewportHeight) + LAND_Y;
  const pointAt = createArc(startX, startY, endX, endY);
  const endRotate = SPIN_TURNS * 360 + LAND_ROTATE;

  const keyframes: Keyframe[] = Array.from(
    { length: ARC_STEPS + 1 },
    (_, step) => {
      const progress = step / ARC_STEPS;
      const { x, y } = pointAt(progress);
      return {
        offset: progress,
        opacity: opacityAt(progress),
        transform: pose(
          x,
          y,
          endRotate * progress,
          lerp(1, LAND_SCALE_X, progress),
          lerp(1, LAND_SCALE_Y, progress),
        ),
      };
    },
  );

  return {
    keyframes,
    duration: FLIGHT_MS,
    easing: FLIGHT_EASING,
    home: pose(startX, startY, 0, 1, 1),
  };
}
