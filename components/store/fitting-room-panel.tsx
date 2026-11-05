import type { CSSProperties, Ref } from "react";
import { isPanelOpen, type FittingRoomState } from "@/lib/fitting-room";
import { Asset } from "./asset";

const PICKS = [
  { src: "pick-trousers.jpg", alt: "Trousers" },
  { src: "pick-sneakers.jpg", alt: "Sneakers" },
  { src: "pick-sweater.jpg", alt: "Sweater" },
  { src: "pick-cap.jpg", alt: "Cap" },
];

function PickSlot({ left, children }: { left: number; children: React.ReactNode }) {
  return (
    <li
      className="absolute top-0 size-[46px] rounded-lg bg-input"
      style={{ left }}
    >
      {children}
      <span className="absolute top-[-6px] left-9 flex size-4 items-center justify-center rounded-full bg-chip">
        <Asset src="icon-x.svg" width={9} />
      </span>
    </li>
  );
}

type FittingRoomPanelProps = {
  state: FittingRoomState;
  onClose: () => void;
  ref?: Ref<HTMLElement>;
};

export function FittingRoomPanel({ state, onClose, ref }: FittingRoomPanelProps) {
  const { phase, productId, revealed } = state;
  const open = isPanelOpen(phase);
  const wearingTrench = revealed && productId === "trench";

  return (
    <section
      ref={ref}
      aria-label="Fitting room"
      data-open={open}
      className="panel-morph fixed bottom-14 left-5 z-40 h-[54px] w-[124px] overflow-hidden rounded-[27px] border border-white/6 bg-panel shadow-[0_16px_40px_rgba(0,0,0,0.45)] data-[open=true]:bottom-[max(12px,min(116px,calc(100dvh-602px)))] data-[open=true]:h-[590px] data-[open=true]:w-[292px] data-[open=true]:rounded-[18px]"
      style={
        {
          "--panel-motion": revealed
            ? "var(--motion-reveal)"
            : "var(--motion-nav)",
        } as CSSProperties
      }
    >
      {/* Closed pill */}
      <div
        aria-hidden={open}
        className={`panel-fade absolute top-0 left-0 h-[54px] w-[124px] ${
          open ? "opacity-0" : "opacity-100"
        }`}
      >
        <Asset
          src="avatar.png"
          width={42}
          className="absolute top-[5px] left-[5px]"
          eager
        />
        <p className="absolute top-[18px] left-[57px] text-13 font-medium whitespace-nowrap">
          Try it on
        </p>
      </div>

      {/* Open panel */}
      <div
        inert={!open}
        className={`panel-fade absolute top-0 left-0 h-[590px] w-[292px] ${
          open ? "opacity-100" : "opacity-0"
        }`}
      >
        <h2 className="absolute top-[17px] left-[17px] text-16 font-semibold">
          Fitting room
        </h2>
        <p className="absolute top-[42px] left-[17px] text-11 whitespace-nowrap text-secondary">
          Tap the hanger on any product to wear it.
        </p>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close fitting room"
          className="absolute top-[13px] left-[249px] flex size-[30px] cursor-pointer items-center justify-center rounded-full outline-primary focus-visible:outline-2"
        >
          <Asset src="icon-close.svg" width={18} />
        </button>

        <div className="absolute top-[71px] left-[17px] h-[340px] w-[256px] overflow-hidden rounded-xl bg-preview">
          <div
            className={`panel-motion absolute inset-0 ${
              revealed ? "blur-[0px]" : "blur-[9px]"
            }`}
          >
            <Asset
              src="model-puffer.jpg"
              width={256}
              height={340}
              alt={revealed ? "Model wearing the selected jacket" : ""}
              className="absolute inset-0 object-cover"
              eager
            />
            <Asset
              src="model-trench.jpg"
              width={256}
              height={340}
              className={`panel-motion absolute inset-0 object-cover ${
                wearingTrench ? "opacity-100" : "opacity-0"
              }`}
              eager
            />
          </div>

          <div
            aria-hidden
            className={`panel-motion absolute inset-0 bg-[rgba(23,20,26,0.82)] ${
              revealed ? "opacity-0" : "opacity-100"
            }`}
          >
            {/* Static in Figma only because prototypes can't loop a rotation. */}
            <Asset
              src="spinner.svg"
              width={28}
              className={`absolute top-32 left-[114px] ${
                open && !revealed ? "motion-safe:animate-spin" : ""
              }`}
              eager
            />
            <p className="absolute top-[170px] left-0 w-full text-center text-13 font-semibold">
              Dressing your model
            </p>
            <p className="absolute top-[194px] left-[43px] w-[170px] text-center text-10-5 leading-[1.4] text-secondary">
              The photo is being made for you. It takes a moment.
            </p>
          </div>

          <div
            aria-hidden
            className={`panel-motion absolute top-[306px] left-[222px] flex size-[26px] items-center justify-center rounded-full bg-[rgba(26,26,31,0.7)] ${
              revealed ? "opacity-100" : "opacity-0"
            }`}
          >
            <Asset src="icon-zoom.svg" width={14} />
          </div>
        </div>

        <span role="status" className="sr-only">
          {open ? (revealed ? "Your model is ready" : "Dressing your model") : ""}
        </span>

        <p className="absolute top-[425px] left-[17px] text-11 text-secondary">
          Your picks
        </p>
        <p className="absolute top-[425px] left-[228px] text-11 whitespace-nowrap text-secondary">
          5 pieces
        </p>

        <ul className="absolute top-[449px] left-[17px] h-[46px] w-[262px]">
          {PICKS.map((pick, index) => (
            <PickSlot key={pick.src} left={index * 52}>
              <Asset
                src={pick.src}
                width={46}
                alt={pick.alt}
                className="rounded-lg object-cover"
              />
            </PickSlot>
          ))}
          <PickSlot left={208}>
            <Asset
              src="pick-puffer.jpg"
              width={46}
              alt={productId === "trench" ? "" : "Puffer jacket"}
              className="absolute inset-0 rounded-lg object-cover"
              eager
            />
            <Asset
              src="pick-trench.jpg"
              width={46}
              alt={productId === "trench" ? "Trench coat" : ""}
              className={`panel-motion absolute inset-0 rounded-lg object-cover ${
                productId === "trench" ? "opacity-100" : "opacity-0"
              }`}
              eager
            />
          </PickSlot>
        </ul>

        <p
          className={`panel-motion absolute top-[509px] left-[17px] text-10-5 whitespace-nowrap text-secondary ${
            revealed ? "opacity-100" : "opacity-0"
          }`}
        >
          Add another piece and it goes on top.
        </p>

        <div className="absolute top-[541px] left-[17px] flex items-center gap-1.5 rounded-[14px] bg-chip py-1.5 pr-3 pl-2.5">
          <Asset src="icon-key.svg" width={12} />
          <span className="text-11 font-medium whitespace-nowrap">
            Your API key
          </span>
        </div>

        <button
          type="button"
          disabled={!revealed}
          onClick={onClose}
          className="absolute top-[547px] left-[204px] flex items-center gap-[5px] rounded outline-offset-2 outline-primary focus-visible:outline-2 enabled:cursor-pointer"
        >
          <span className="relative size-3">
            <Asset
              src="icon-rotate-grey.svg"
              width={12}
              className="absolute inset-0"
            />
            <Asset
              src="icon-rotate-orange.svg"
              width={12}
              className={`panel-motion absolute inset-0 ${
                revealed ? "opacity-100" : "opacity-0"
              }`}
            />
          </span>
          <span
            className={`panel-motion text-11 font-medium whitespace-nowrap ${
              revealed ? "text-orange-text" : "text-muted"
            }`}
          >
            Start over
          </span>
        </button>
      </div>
    </section>
  );
}
