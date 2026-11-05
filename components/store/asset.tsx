import Image from "next/image";
import type { Ref } from "react";

type AssetProps = {
  src: string;
  width: number;
  height?: number;
  alt?: string;
  className?: string;
  /** For images revealed by animation, which must already be loaded when they appear. */
  eager?: boolean;
  ref?: Ref<HTMLImageElement>;
};

/** A file from public/assets rendered at its exact design size. */
export function Asset({
  src,
  width,
  height = width,
  alt = "",
  className,
  eager,
  ref,
}: AssetProps) {
  return (
    <Image
      ref={ref}
      src={`/assets/${src}`}
      alt={alt}
      width={width}
      height={height}
      style={{ width, height }}
      className={className}
      loading={eager ? "eager" : undefined}
      unoptimized
    />
  );
}
