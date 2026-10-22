"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IMAGE_BASE, NOUNS_CAROUSEL_PHOTOS, type GallerySlide } from "./nouns-events";

export const NOUNS_EVENTS_ANCHOR = "events";

// useLayoutEffect warns during SSR.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SWIPE_THRESHOLD = 40;
const CLICK_SLOP = 8;

type Mode = "desktop" | "mobile";

interface StageMetrics {
  mode: Mode;
  cardW: number;
  cardH: number;
  stageH: number;
  perspective: number;
}

interface SlideLayout {
  transform: string;
  opacity: number;
  zIndex: number;
  interactive: boolean;
}

const MOBILE_BREAKPOINT = 640;

const FAN = {
  desktop: {
    maxCardW: 490,
    cardRatioOfStage: 0.42,
    stageHeightFactor: 1.14,
    perspective: 1400,
    steps: [0.51, 0.82, 1.12],
    sideScale: 0.81,
    rotateY: 38,
    depth: 120,
    fadeLastStep: 0.5,
  },
  mobile: {
    maxCardW: 9999,
    cardRatioOfStage: 0.78,
    stageHeightFactor: 1.14,
    perspective: 900,
    steps: [0.64, 0.95],
    sideScale: 0.82,
    rotateY: 40,
    depth: 100,
    fadeLastStep: 0,
  },
} as const;

function metricsFor(stageW: number): StageMetrics {
  const mode: Mode = stageW < MOBILE_BREAKPOINT ? "mobile" : "desktop";
  const f = FAN[mode];
  const cardW = Math.round(Math.min(f.maxCardW, stageW * f.cardRatioOfStage));
  const cardH = Math.round(cardW / 1.6);
  return {
    mode,
    cardW,
    cardH,
    stageH: Math.round(cardH * f.stageHeightFactor),
    perspective: f.perspective,
  };
}

function loopOffset(index: number, active: number, count: number): number {
  let o = index - active;
  if (o > count / 2) o -= count;
  if (o < -count / 2) o += count;
  return o;
}

function layoutFor(offset: number, m: StageMetrics): SlideLayout {
  const f = FAN[m.mode];
  const a = Math.abs(offset);
  const dir = Math.sign(offset);
  const centre = "translate(-50%, -50%)";

  if (a === 0) {
    return { transform: `${centre} translate3d(0, 0, 0) scale(1)`, opacity: 1, zIndex: 30, interactive: true };
  }

  const last = f.steps.length;
  if (a <= last) {
    const x = dir * f.steps[a - 1] * m.cardW;
    const z = -f.depth * a;
    const isLast = a === last;
    const opacity = isLast ? f.fadeLastStep : 1;
    return {
      transform: `${centre} translate3d(${x.toFixed(1)}px, 0, ${z}px) rotateY(${-dir * f.rotateY}deg) scale(${f.sideScale})`,
      opacity,
      zIndex: 30 - a,
      interactive: opacity > 0.9,
    };
  }

  const x = dir * (f.steps[last - 1] + 0.2) * m.cardW;
  return {
    transform: `${centre} translate3d(${x.toFixed(1)}px, 0, ${-f.depth * (last + 1)}px) rotateY(${-dir * f.rotateY}deg) scale(${f.sideScale * 0.85})`,
    opacity: 0,
    zIndex: 0,
    interactive: false,
  };
}

export interface NounsInTheWildProps {
  slides?: GallerySlide[];
  title?: string;
  titleAccent?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  path?: string | null;
  imageBase?: string;
  onSlideChange?: (index: number, slide: GallerySlide, via: "arrow" | "swipe" | "key" | "card") => void;
  className?: string;
  id?: string;
}

export function NounsInTheWild({
  slides = NOUNS_CAROUSEL_PHOTOS,
  title = "Nouns",
  titleAccent = "in the Wild",
  subtitle = "Where Nouns has been. The calendar says where it turns up next.",
  ctaLabel = "Upcoming events",
  ctaHref = "https://luma.com/nounsdao",
  path = "/root/launch/nouns/events",
  imageBase = IMAGE_BASE,
  onSlideChange,
  className,
  id,
}: NounsInTheWildProps) {
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [metrics, setMetrics] = useState<StageMetrics | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const headingId = useId();

  useIsoLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setMetrics(metricsFor(el.clientWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const go = useCallback(
    (next: number, via: "arrow" | "swipe" | "key" | "card") => {
      if (!count) return;
      const i = ((next % count) + count) % count;
      setActive(i);
      onSlideChange?.(i, slides[i], via);
    },
    [count, onSlideChange, slides]
  );

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(active - 1, "key");
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(active + 1, "key");
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0, "key");
    } else if (e.key === "End") {
      e.preventDefault();
      go(count - 1, "key");
    }
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { x: e.clientX, y: e.clientY, moved: false };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d && !d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) > CLICK_SLOP) d.moved = true;
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) go(active + (dx < 0 ? 1 : -1), "swipe");
    // Keep `moved` for the click that fires right after pointerup.
    setTimeout(() => {
      drag.current = null;
    }, 0);
  };

  const stageStyle = useMemo(
    () =>
      metrics
        ? ({
            "--niw-card-w": `${metrics.cardW}px`,
            "--niw-card-h": `${metrics.cardH}px`,
            "--niw-stage-h": `${metrics.stageH}px`,
            "--niw-perspective": `${metrics.perspective}px`,
          } as CSSProperties)
        : undefined,
    [metrics]
  );

  if (!count) return null;
  const current = slides[active];
  const isMobile = metrics?.mode === "mobile";

  return (
    <section
      id={id}
      className={cn("mt-36 scroll-mt-22 text-ink max-sm:mt-24", className)}
      aria-roledescription="carousel"
      aria-labelledby={headingId}
    >
      <div className="mb-5 flex items-end justify-between gap-4.5 max-sm:mb-3.5 max-sm:flex-col max-sm:items-start max-sm:gap-3.5">
        <div>
          {path && <span className="path-badge mb-0">{path}</span>}
          <h2
            className="mt-3 mb-1 text-[34px] leading-[1.05] font-bold tracking-[-0.025em] text-balance max-sm:mt-2.5 max-sm:text-[26px]"
            id={headingId}
          >
            {title} <span className="font-(family-name:--font-londrina) font-normal tracking-normal">{titleAccent}</span>
          </h2>
          <p className="max-w-[56ch] text-[15px] leading-normal text-muted max-sm:text-sm">{subtitle}</p>
        </div>
        <a
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0 no-underline max-sm:min-h-10")}
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          {ctaLabel} <span aria-hidden="true">↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>

      <div
        ref={stageRef}
        className={cn(
          "relative h-(--niw-stage-h) touch-pan-y overflow-hidden outline-none select-none perspective-(--niw-perspective)",
          "[--niw-card-h:306px] [--niw-card-w:490px] [--niw-perspective:1400px] [--niw-stage-h:349px]",
          "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-danger",
          isMobile
            ? "[mask-image:linear-gradient(90deg,transparent_0,#000_6%,#000_94%,transparent_100%)]"
            : "[mask-image:linear-gradient(90deg,transparent_0,#000_9%,#000_91%,transparent_100%)]"
        )}
        style={stageStyle}
        tabIndex={0}
        aria-label="Event photos. Use the left and right arrow keys to browse."
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        {slides.map((s, i) => {
          const o = loopOffset(i, active, count);
          const l = metrics ? layoutFor(o, metrics) : null;
          const isActive = i === active;
          const near = Math.abs(o) <= 4;
          return (
            <figure
              key={s.file}
              className={cn(
                "absolute top-1/2 left-1/2 h-(--niw-card-h) w-(--niw-card-w) overflow-hidden border-2 border-ink bg-white backface-hidden transform-3d will-change-[transform,opacity]",
                isMobile ? "rounded-xl" : "rounded-[14px]",
                isActive
                  ? cn("cursor-default", isMobile ? "shadow-[5px_5px_0_0_#1C1C27]" : "shadow-[8px_8px_0_0_#1C1C27]")
                  : "cursor-pointer saturate-[.72] hover:saturate-100",
                l
                  ? "[transition:transform_780ms_cubic-bezier(.16,1,.3,1),opacity_620ms_cubic-bezier(.16,1,.3,1),filter_620ms_ease,box-shadow_500ms_ease] motion-reduce:[transition:opacity_200ms_linear]"
                  : "opacity-0",
                !l?.interactive && "pointer-events-none"
              )}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${s.title ?? s.alt}`}
              aria-hidden={!isActive}
              style={l ? { transform: l.transform, opacity: l.opacity, zIndex: l.zIndex } : undefined}
              onClick={() => {
                if (drag.current?.moved || isActive) return;
                go(i, "card");
              }}
            >
              {near && (
                <Image
                  src={`${imageBase}/${s.file}.webp`}
                  fill
                  sizes={metrics ? `${metrics.cardW}px` : "490px"}
                  alt={s.alt}
                  loading={Math.abs(o) <= 1 ? "eager" : "lazy"}
                  draggable={false}
                  className="pointer-events-none bg-[#D8D4CC] object-cover"
                />
              )}
            </figure>
          );
        })}
      </div>

      <p
        className={cn(
          "flex min-h-[3.1em] flex-col items-center gap-1 text-center",
          isMobile ? "mt-3" : "mt-4"
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        {current.title && <b className={cn("font-bold tracking-[-0.01em]", isMobile ? "text-sm" : "text-[15px]")}>{current.title}</b>}
        <span className="font-['Space_Mono',monospace] text-[10px] tracking-widest text-muted uppercase">{current.place}</span>
      </p>

      <div className={cn("flex justify-center", isMobile ? "mt-4 gap-3.5" : "mt-5 gap-3")}>
        {[
          { label: "Previous photo", arrow: "←", step: -1 },
          { label: "Next photo", arrow: "→", step: 1 },
        ].map((b) => (
          <Button
            key={b.label}
            variant="outline"
            size={isMobile ? "icon-lg" : "icon-sm"}
            className="rounded-full hover:bg-yellow"
            aria-label={b.label}
            onClick={() => go(active + b.step, "arrow")}
          >
            <span aria-hidden="true">{b.arrow}</span>
          </Button>
        ))}
      </div>
    </section>
  );
}
