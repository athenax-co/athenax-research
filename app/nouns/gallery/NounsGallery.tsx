"use client";

import { useCallback, useId, useRef, useState, type KeyboardEvent, type PointerEvent, type RefObject } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog } from "@base-ui/react";
import { parseAsInteger, parseAsStringLiteral, useQueryState } from "nuqs";
import { ArrowLeft, ArrowRight, ArrowUpRight, Download, Maximize, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useGlobal } from "@/components/GlobalProvider";
import { cn } from "@/lib/utils";
import {
  GALLERY_EVENTS,
  IMAGE_BASE,
  NOUNS_PHOTO_HIGHLIGHTS,
  NOUNS_PHOTOS,
  NOUNS_VIDEOS,
  type GalleryEventSlug,
  type GallerySlide,
  type GalleryVideo,
} from "@/app/launch/nouns-events";
import { featureSpans, type TileSpan } from "./feature-grid";

const TITLE = "Nouns";
const TITLE_ACCENT = "in the Wild";
const EVENTS_HREF = "https://luma.com/nounsdao";

const EVENT_SLUGS = GALLERY_EVENTS.map((e) => e.slug);

const SWIPE_THRESHOLD = 50;
const CLICK_SLOP = 8;
const MIN_SCALE = 1;
const MAX_SCALE = 4;
const ZOOM_STEP = 1.5;

const mono = "font-['Space_Mono',monospace]";
const capsLabel = cn(mono, "text-[11px] tracking-widest text-muted uppercase");

const srcFor = (s: GallerySlide) => `${IMAGE_BASE}/${s.file}.webp`;
const fileName = (s: GallerySlide) => `nouns-${s.file.split("/").pop()}.webp`;
const photoLabel = (s: GallerySlide, i: number) => `Open photo ${i + 1}${s.title ? `: ${s.title}` : ""}`;
const pad = (n: number) => String(n).padStart(2, "0");

function useDownload() {
  const { showToast } = useGlobal();

  return async (s: GallerySlide) => {
    try {
      // R2 sends CORS for our origins; no-store skips a cached non-CORS copy from the <img> loads.
      const res = await fetch(srcFor(s), { mode: "cors", cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName(s);
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      showToast("Couldn't download — right-click the photo and choose Save Image As.", "error");
    }
  };
}

const SPAN_CLASS: Record<TileSpan, string> = {
  big: "lg:col-span-2 lg:row-span-2",
  single: "",
  wide: "lg:col-span-2",
  full: "lg:col-span-full",
};

export default function NounsGallery() {
  const [eventSlug, setEventSlug] = useQueryState("event", parseAsStringLiteral(EVENT_SLUGS));
  const [photo, setPhoto] = useQueryState("photo", parseAsInteger);
  const event = GALLERY_EVENTS.find((e) => e.slug === eventSlug);
  const slides = event ? NOUNS_PHOTOS.filter((s) => s.place === event.place) : NOUNS_PHOTOS;
  const videos = event ? NOUNS_VIDEOS.filter((v) => v.place === event.place) : NOUNS_VIDEOS;
  const [video, setVideo] = useState<number | null>(null);
  const active = photo != null && photo >= 1 && photo <= slides.length ? photo - 1 : null;
  const download = useDownload();
  const spans = featureSpans(slides.length);
  const headingId = useId();

  const open = (i: number) => setPhoto(i + 1);
  const filter = (slug: GalleryEventSlug | null) => {
    setEventSlug(slug);
    setPhoto(null);
    setVideo(null);
  };
  const openFromFilm = (p: GallerySlide) => {
    setEventSlug(null);
    setPhoto(NOUNS_PHOTOS.indexOf(p) + 1);
  };

  return (
    <article className="bg-cream text-ink" aria-labelledby={headingId}>
      <header className="page-wrap pt-14 pb-11 max-sm:pt-6 max-sm:pb-7">
        <Link href="/launch?category=nouns#events" className="link-arrow mb-0">
          ← Back to Nouns on Launch
        </Link>
        <div className="mt-6 max-sm:mt-4">
          <span className="path-badge mb-0">/root/nouns/gallery</span>
        </div>
        <h1 id={headingId} className="mt-4 mb-3 text-[64px] leading-[0.98] font-bold tracking-[-0.035em] max-sm:mt-3.5 max-sm:text-[40px]">
          {TITLE} <span className="font-(family-name:--font-londrina) font-normal tracking-normal">{TITLE_ACCENT}</span>
        </h1>
        <p className="m-0 max-w-[52ch] text-[17px] leading-normal text-muted max-sm:text-[15px]">
          Photos and videos from the Community Kickoff at The Spot — the rooms, walls and people where Nouns showed up.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 max-sm:mt-5">
          <div className="flex flex-wrap gap-3.5" role="group" aria-label="Filter photos by event">
            <FilterPill label="All" active={!event} onClick={() => filter(null)} />
            {GALLERY_EVENTS.map((e) => (
              <FilterPill
                key={e.slug}
                label={e.label}
                active={event?.slug === e.slug}
                onClick={() => filter(e.slug)}
              />
            ))}
          </div>
          <UpcomingEventsLink className="max-sm:w-full max-sm:justify-center" />
        </div>
      </header>

      <Filmstrip onOpen={openFromFilm} />

      {videos.length > 0 && (
        <section className="page-wrap pt-19 max-sm:pt-7" aria-labelledby={`${headingId}-videos`}>
          <SectionHeader id={`${headingId}-videos`} title="Videos" hint="Click to play" />
          <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 sm:gap-6">
            {videos.map((v, i) => (
              <li key={v.src} className="min-w-0">
                <VideoTile video={v} onOpen={() => setVideo(i)} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section
        className={cn("page-wrap pb-18 max-sm:pt-7 max-sm:pb-10", videos.length > 0 ? "pt-20" : "pt-14")}
        aria-labelledby={`${headingId}-all`}
      >
        <SectionHeader id={`${headingId}-all`} title="Photos" hint="Click to view full size" />

        <div className="@container">
          <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 lg:grid-cols-4 lg:gap-5 lg:auto-rows-[calc((100cqw-60px)/4/1.5)]">
            {slides.map((s, i) => (
              <li key={s.file} className={cn("min-w-0", SPAN_CLASS[spans[i]])}>
                <button
                  type="button"
                  className="relative block aspect-[3/2] w-full cursor-zoom-in overflow-hidden rounded-[10px] border-2 border-ink bg-[#D8D4CC] p-0 shadow-[3px_3px_0_0_#1C1C27] transition-[translate,box-shadow] duration-250 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-x-0.75 hover:-translate-y-0.75 hover:shadow-[7px_7px_0_0_#1C1C27] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-danger lg:aspect-auto lg:h-full lg:rounded-xl lg:shadow-[4px_4px_0_0_#1C1C27]"
                  aria-label={photoLabel(s, i)}
                  onClick={() => open(i)}
                >
                  <Image
                    src={srcFor(s)}
                    alt={s.alt}
                    fill
                    sizes={spans[i] === "single" ? "(min-width: 1024px) 300px, 50vw" : "(min-width: 1024px) 600px, 50vw"}
                    className="object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Lightbox slides={slides} index={active} onIndexChange={(i) => setPhoto(i + 1)} onClose={() => setPhoto(null)} onDownload={download} />
      <VideoPlayer videos={videos} index={video} onIndexChange={setVideo} onClose={() => setVideo(null)} />
    </article>
  );
}

function SectionHeader({ id, title, hint }: { id: string; title: string; hint: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 max-sm:mb-4.5 max-sm:border-b-2 max-sm:border-ink max-sm:pb-2.5">
      <h2 id={id} className="m-0 text-[28px] leading-[1.15] font-bold tracking-[-0.02em] max-sm:text-2xl">
        {title}
      </h2>
      <span className={capsLabel}>{hint}</span>
    </div>
  );
}

function VideoTile({ video, onOpen }: { video: GalleryVideo; onOpen: () => void }) {
  return (
    <button
      type="button"
      className="relative block aspect-video w-full cursor-pointer overflow-hidden rounded-[10px] border-2 border-ink bg-ink p-0 shadow-[3px_3px_0_0_#1C1C27] transition-[translate,box-shadow] duration-250 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-x-0.75 hover:-translate-y-0.75 hover:shadow-[7px_7px_0_0_#1C1C27] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-danger lg:rounded-xl lg:shadow-[4px_4px_0_0_#1C1C27]"
      aria-label={`Play video: ${video.title}`}
      onClick={onOpen}
    >
      <Image src={video.poster} alt="" fill sizes="(min-width: 640px) 600px, 100vw" className="object-cover" />
      <span className="absolute inset-0 bg-ink/16" aria-hidden="true" />
      <span
        className="absolute top-1/2 left-1/2 grid size-16 -translate-1/2 place-items-center rounded-[10px] border-2 border-ink bg-white shadow-[4px_4px_0_0_#1C1C27] max-sm:size-13"
        aria-hidden="true"
      >
        <Play className="size-5.5 fill-ink" />
      </span>
    </button>
  );
}

const formatTime = (t: number) => {
  const s = Number.isFinite(t) ? Math.floor(t) : 0;
  return `${Math.floor(s / 60)}:${pad(s % 60)}`;
};

const togglePlay = (v: HTMLVideoElement | null) => {
  if (!v) return;
  if (v.paused) v.play().catch(() => {});
  else v.pause();
};

const SEEK_STEP = 5;
const controlButton =
  "grid size-9 flex-none cursor-pointer place-items-center rounded-lg border-2 border-ink p-0 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-danger";

interface VideoPlayerProps {
  videos: GalleryVideo[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

function VideoPlayer({ videos, index, onIndexChange, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  if (index == null || !videos[index]) return <Dialog.Root open={false} />;

  const video = videos[index];
  const go = (step: -1 | 1) => {
    const next = index + step;
    if (next >= 0 && next < videos.length) onIndexChange(next);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "ArrowRight") go(1);
    else if (e.key === " ") togglePlay(videoRef.current);
    else return;
    e.preventDefault();
  };

  // Wrapper keeps the overlay open: a disabled .btn has pointer-events: none, so clicks land on it instead.
  const arrow = (step: -1 | 1, className: string) => (
    <span className={className} data-keep-open>
      <Button
        variant="outline"
        className="size-13 p-0"
        aria-label={step < 0 ? "Previous video" : "Next video"}
        disabled={step < 0 ? index === 0 : index === videos.length - 1}
        onClick={() => go(step)}
      >
        {step < 0 ? <ArrowLeft className="size-5" /> : <ArrowRight className="size-5" />}
      </Button>
    </span>
  );

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Popup
          className="fixed inset-0 z-150 flex flex-col bg-cream text-ink outline-none transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0"
          initialFocus={closeRef}
          onKeyDown={onKeyDown}
          onClick={(e) => {
            if (!(e.target as Element).closest("[data-keep-open]")) onClose();
          }}
        >
          <Dialog.Title className="sr-only">{video.title}</Dialog.Title>
          <div className="flex items-center justify-between gap-4 px-7 py-5 max-sm:px-4 max-sm:py-3" data-keep-open>
            <span className={capsLabel}>Video</span>
            <Dialog.Close ref={closeRef} className={cn(buttonVariants({ variant: "outline" }), "size-12 p-0")} aria-label="Close video">
              <X className="size-5" />
            </Dialog.Close>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-8 px-7 pb-10 max-sm:grid-cols-2 max-sm:content-center max-sm:gap-x-3.5 max-sm:gap-y-5 max-sm:px-4 max-sm:pb-6 max-sm:[grid-template-areas:'fig_fig'_'prev_next']">
            {arrow(-1, "max-sm:[grid-area:prev] max-sm:justify-self-end")}
            <div className="flex min-w-0 justify-center max-sm:[grid-area:fig]">
              {/* Keyed so switching videos remounts the element: the old one stops and the controls reset. */}
              <VideoStage key={video.src} video={video} videoRef={videoRef} />
            </div>
            {arrow(1, "max-sm:[grid-area:next] max-sm:justify-self-start")}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function VideoStage({ video, videoRef }: { video: GalleryVideo; videoRef: RefObject<HTMLVideoElement | null> }) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  const seek = (t: number) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    v.currentTime = clamp(t, 0, duration);
    setTime(v.currentTime);
  };
  const seekAt = (clientX: number, bar: HTMLElement) => {
    const r = bar.getBoundingClientRect();
    seek(((clientX - r.left) / r.width) * duration);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else if (frameRef.current?.requestFullscreen) frameRef.current.requestFullscreen().catch(() => {});
    // iOS Safari only supports fullscreen on the <video> itself.
    else (videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null)?.webkitEnterFullscreen?.();
  };

  return (
    <div
      ref={frameRef}
      className="relative aspect-video w-full max-w-[min(1080px,calc((100dvh-200px)*16/9))] overflow-hidden rounded-xl border-2 border-ink bg-ink shadow-[6px_6px_0_0_#1C1C27] max-sm:shadow-[4px_4px_0_0_#1C1C27] [&:fullscreen]:max-w-none [&:fullscreen]:rounded-none [&:fullscreen]:border-0"
      data-keep-open
    >
      <video
        ref={videoRef}
        src={video.src}
        poster={video.poster}
        autoPlay
        playsInline
        preload="metadata"
        className="size-full cursor-pointer object-contain"
        onClick={() => togglePlay(videoRef.current)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
      />

      <div className="absolute inset-x-4 bottom-4 flex items-center gap-4 rounded-[10px] border-2 border-ink bg-white px-3.5 py-2.5 max-sm:inset-x-2 max-sm:bottom-2 max-sm:gap-2.5 max-sm:px-2 max-sm:py-1.5">
        <button type="button" className={cn(controlButton, "bg-yellow")} aria-label={playing ? "Pause" : "Play"} onClick={() => togglePlay(videoRef.current)}>
          {playing ? <Pause className="size-4 fill-ink" /> : <Play className="size-4 fill-ink" />}
        </button>
        <span className={cn(mono, "text-xs tabular-nums")}>{formatTime(time)}</span>
        <div
          role="slider"
          tabIndex={0}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(time)}
          aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
          className="min-w-0 flex-1 cursor-pointer touch-none py-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-danger"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            seekAt(e.clientX, e.currentTarget);
          }}
          onPointerMove={(e) => {
            if (e.currentTarget.hasPointerCapture(e.pointerId)) seekAt(e.clientX, e.currentTarget);
          }}
          onKeyDown={(e) => {
            if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
            // Stop here so the overlay doesn't switch videos.
            e.stopPropagation();
            e.preventDefault();
            seek(time + (e.key === "ArrowLeft" ? -SEEK_STEP : SEEK_STEP));
          }}
        >
          <div className="relative h-2 overflow-hidden rounded-full border-2 border-ink bg-white">
            <span className="absolute inset-y-0 left-0 bg-ink" style={{ width: `${duration ? (time / duration) * 100 : 0}%` }} />
          </div>
        </div>
        <span className={cn(mono, "text-xs tabular-nums")}>{formatTime(duration)}</span>
        <button
          type="button"
          className={cn(controlButton, "bg-white")}
          aria-label={muted ? "Unmute" : "Mute"}
          onClick={() => {
            if (videoRef.current) videoRef.current.muted = !videoRef.current.muted;
          }}
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
        <button type="button" className={cn(controlButton, "bg-white")} aria-label="Toggle fullscreen" onClick={toggleFullscreen}>
          <Maximize className="size-4" />
        </button>
      </div>
    </div>
  );
}

function UpcomingEventsLink({ className }: { className?: string }) {
  return (
    <a href={EVENTS_HREF} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "outline" }), "no-underline", className)}>
      Upcoming events <ArrowUpRight className="size-4" aria-hidden="true" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <Button variant={active ? "secondary" : "outline"} aria-pressed={active} onClick={onClick}>
      {label}
    </Button>
  );
}

function Filmstrip({ onOpen }: { onOpen: (p: GallerySlide) => void }) {
  return (
    <section
      className="group overflow-hidden border-y-2 border-ink bg-white py-4.5 max-sm:border-0 max-sm:bg-transparent max-sm:pt-1 max-sm:pb-2"
      aria-label="Highlights"
    >
      <div className={cn("page-wrap hidden justify-between pb-3 max-sm:flex", capsLabel)} aria-hidden="true">
        <span>Highlights</span>
        <span>Swipe →</span>
      </div>
      <div
        className={cn(
          "flex w-max gap-4 animate-film-roll group-hover:paused group-focus-within:paused",
          "motion-reduce:w-auto motion-reduce:animate-none motion-reduce:overflow-x-auto",
          "max-sm:w-auto max-sm:animate-none max-sm:snap-x max-sm:snap-mandatory max-sm:gap-3.5 max-sm:overflow-x-auto max-sm:scroll-px-(--page-gutter) max-sm:px-(--page-gutter) max-sm:pt-0.5 max-sm:pb-3.5 max-sm:[scrollbar-width:none]"
        )}
      >
        {[0, 1].map((copy) =>
          NOUNS_PHOTO_HIGHLIGHTS.map((s, i) => (
            <button
              key={`${copy}-${s.file}`}
              type="button"
              className={cn(
                "relative h-45 w-[288px] flex-none cursor-zoom-in overflow-hidden rounded-[10px] border-2 border-ink bg-[#D8D4CC] p-0 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-danger",
                "max-sm:h-50 max-sm:w-80 max-sm:snap-start max-sm:rounded-xl max-sm:shadow-[4px_4px_0_0_#1C1C27]",
                copy === 1 && "max-sm:hidden motion-reduce:hidden"
              )}
              aria-label={photoLabel(s, i)}
              aria-hidden={copy === 1 || undefined}
              tabIndex={copy === 1 ? -1 : 0}
              onClick={() => onOpen(s)}
            >
              <Image src={srcFor(s)} alt="" fill sizes="320px" loading={copy === 0 && i < 5 ? "eager" : "lazy"} className="object-cover" />
            </button>
          ))
        )}
      </div>
    </section>
  );
}

interface Point {
  x: number;
  y: number;
}
interface View extends Point {
  scale: number;
}
type Gesture = { kind: "pan"; view: View; start: Point; moved: boolean } | { kind: "pinch"; view: View; dist: number; mid: Point };

const IDENTITY: View = { scale: 1, x: 0, y: 0 };
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

function clampView(v: View, box: { width: number; height: number }): View {
  const scale = clamp(v.scale, MIN_SCALE, MAX_SCALE);
  const mx = ((scale - 1) * box.width) / 2;
  const my = ((scale - 1) * box.height) / 2;
  return { scale, x: clamp(v.x, -mx, mx), y: clamp(v.y, -my, my) };
}

function zoomAt(v: View, scale: number, at: Point, box: { width: number; height: number }): View {
  const k = clamp(scale, MIN_SCALE, MAX_SCALE) / v.scale;
  return clampView({ scale: v.scale * k, x: at.x - k * (at.x - v.x), y: at.y - k * (at.y - v.y) }, box);
}

interface LightboxProps {
  slides: GallerySlide[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  onDownload: (s: GallerySlide) => void;
}

function Lightbox({ slides, index, onIndexChange, onClose, onDownload }: LightboxProps) {
  const count = slides.length;
  // Direction of the last step; null right after opening so the first photo doesn't slide in.
  const [dir, setDir] = useState<1 | -1 | null>(null);
  const [zoom, setZoom] = useState<{ index: number; view: View; animate: boolean }>({ index: -1, view: IDENTITY, animate: false });
  const view = zoom.index === index ? zoom.view : IDENTITY;
  const zoomed = view.scale > 1;
  const setView = (v: View, animate = false) => setZoom({ index: index ?? -1, view: v, animate });

  const boxRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const pointers = useRef(new Map<number, Point>());
  const gesture = useRef<Gesture | null>(null);

  // React's onWheel is passive; native listener so trackpad pinch can preventDefault page zoom.
  const attachBox = useCallback(
    (el: HTMLDivElement | null) => {
      boxRef.current = el;
      if (!el || index == null) return;
      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        if (!e.ctrlKey) return;
        const r = el.getBoundingClientRect();
        const c = { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 };
        setZoom((z) => {
          const v = z.index === index ? z.view : IDENTITY;
          return { index, view: zoomAt(v, v.scale * Math.exp(-e.deltaY * 0.01), c, r), animate: false };
        });
      };
      el.addEventListener("wheel", onWheel, { passive: false });
      return () => el.removeEventListener("wheel", onWheel);
    },
    [index]
  );

  // A ref callback, not an effect: on open the portal mounts after effects run.
  const centerThumb = useCallback(
    (el: HTMLButtonElement | null) => {
      const strip = el?.closest<HTMLElement>("[data-thumbs]");
      if (!el || !strip || index == null) return;
      const s = strip.getBoundingClientRect();
      const t = el.getBoundingClientRect();
      strip.scrollTo({ left: strip.scrollLeft + t.left - s.left - (s.width - t.width) / 2, behavior: dir ? "smooth" : "instant" });
    },
    [index, dir]
  );

  if (index == null) return <Dialog.Root open={false} />;

  const slide = slides[index];
  const show = (i: number, d: 1 | -1) => {
    setDir(d);
    onIndexChange(i);
  };
  const go = (step: 1 | -1) => show((((index + step) % count) + count) % count, step);
  const close = () => {
    setDir(null);
    onClose();
  };

  const rel = (x: number, y: number): Point => {
    const r = boxRef.current!.getBoundingClientRect();
    return { x: x - r.left - r.width / 2, y: y - r.top - r.height / 2 };
  };
  const boxRect = () => boxRef.current!.getBoundingClientRect();
  const zoomBy = (factor: number) => setView(zoomAt(view, view.scale * factor, { x: 0, y: 0 }, boxRect()), true);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "ArrowRight") go(1);
    else if (e.key === "+" || e.key === "=") zoomBy(ZOOM_STEP);
    else if (e.key === "-") zoomBy(1 / ZOOM_STEP);
    else if (e.key === "0") setView(IDENTITY, true);
    else return;
    e.preventDefault();
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      gesture.current = { kind: "pan", view, start: { x: e.clientX, y: e.clientY }, moved: false };
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current = { kind: "pinch", view, dist: Math.hypot(a.x - b.x, a.y - b.y), mid: rel((a.x + b.x) / 2, (a.y + b.y) / 2) };
    }
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (!g) return;

    if (g.kind === "pinch" && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      const scale = clamp(g.view.scale * (Math.hypot(a.x - b.x, a.y - b.y) / g.dist), MIN_SCALE, MAX_SCALE);
      const mid = rel((a.x + b.x) / 2, (a.y + b.y) / 2);
      const k = scale / g.view.scale;
      setView(clampView({ scale, x: mid.x - k * (g.mid.x - g.view.x), y: mid.y - k * (g.mid.y - g.view.y) }, boxRect()));
    } else if (g.kind === "pan") {
      const dx = e.clientX - g.start.x;
      const dy = e.clientY - g.start.y;
      if (!g.moved && Math.hypot(dx, dy) > CLICK_SLOP) g.moved = true;
      if (g.view.scale > 1) setView(clampView({ ...g.view, x: g.view.x + dx, y: g.view.y + dy }, boxRect()));
    }
  };

  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.delete(e.pointerId)) return;
    const g = gesture.current;

    if (g?.kind === "pinch") {
      const rest = [...pointers.current.values()][0];
      gesture.current = rest ? { kind: "pan", view, start: rest, moved: true } : null;
      if (view.scale < 1.05) setView(IDENTITY, true);
      return;
    }

    gesture.current = null;
    if (g?.kind === "pan" && g.view.scale === 1 && e.type === "pointerup") {
      const dx = e.clientX - g.start.x;
      const dy = e.clientY - g.start.y;
      if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    }
  };

  const arrow = (step: -1 | 1, className: string) => (
    <Button
      variant="ghost"
      size="icon-lg"
      className={className}
      aria-label={step < 0 ? "Previous photo" : "Next photo"}
      data-keep-open
      onClick={() => go(step)}
    >
      {step < 0 ? <ArrowLeft className="size-5" /> : <ArrowRight className="size-5" />}
    </Button>
  );

  return (
    <Dialog.Root open onOpenChange={(open) => !open && close()}>
      <Dialog.Portal>
        <Dialog.Popup
          className="fixed inset-0 z-150 flex flex-col bg-cream text-ink outline-none transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0"
          aria-label={`${TITLE} ${TITLE_ACCENT} photo viewer`}
          initialFocus={closeRef}
          onKeyDown={onKeyDown}
          onClick={(e) => {
            if (!(e.target as Element).closest("[data-keep-open]")) close();
          }}
        >
          <div className="flex items-center justify-between gap-4 border-b-2 border-ink px-7 py-3.5 max-sm:px-4 max-sm:py-3" data-keep-open>
            <span className={cn(mono, "min-w-16 text-xs tracking-widest")} aria-live="polite">
              {pad(index + 1)} / {pad(count)}
            </span>
            <span className="text-sm font-semibold max-sm:hidden">
              {TITLE} {TITLE_ACCENT}
            </span>
            <div className="flex items-center gap-2.5">
              <Button variant="outline" className="min-h-11" onClick={() => onDownload(slide)}>
                <Download className="size-3.5" /> Download<span className="sr-only"> photo {index + 1}</span>
              </Button>
              <Dialog.Close ref={closeRef} className={buttonVariants({ variant: "ghost", size: "icon-lg" })} aria-label="Close viewer">
                <X className="size-4.5" />
              </Dialog.Close>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-7 px-7 py-6 max-sm:grid-cols-2 max-sm:content-center max-sm:gap-x-3.5 max-sm:gap-y-4 max-sm:px-4 max-sm:py-5 max-sm:[grid-template-areas:'fig_fig'_'prev_next']">
            {arrow(-1, "max-sm:[grid-area:prev] max-sm:justify-self-end")}

            <figure className="m-0 flex min-w-0 flex-col items-center gap-3.5 max-sm:[grid-area:fig] max-sm:gap-3">
              <div
                ref={attachBox}
                className={cn(
                  "relative aspect-[3/2] w-full max-w-[min(1080px,calc((100dvh-290px)*1.5))] touch-none overflow-hidden rounded-[14px] border-2 border-ink bg-ink shadow-[8px_8px_0_0_#1C1C27] select-none",
                  "max-sm:max-w-[calc(60dvh*1.5)] max-sm:rounded-xl max-sm:shadow-[5px_5px_0_0_#1C1C27]",
                  zoomed && "cursor-grab active:cursor-grabbing"
                )}
                data-keep-open
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerEnd}
                onPointerCancel={onPointerEnd}
              >
                <div
                  key={slide.file}
                  className={cn(
                    "absolute inset-0 motion-reduce:animate-none",
                    dir === 1 && "animate-photo-in-next",
                    dir === -1 && "animate-photo-in-prev"
                  )}
                >
                  <Image
                    src={srcFor(slide)}
                    alt={slide.alt}
                    fill
                    unoptimized
                    priority
                    draggable={false}
                    className={cn(
                      "object-contain will-change-transform",
                      zoom.animate && "transition-transform duration-300 ease-out motion-reduce:transition-none"
                    )}
                    style={{ transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})` }}
                  />
                </div>
              </div>
              <figcaption
                className="flex min-h-[3.1em] flex-col items-center gap-1 text-center"
                data-keep-open
              >
                {slide.title && (
                  <Dialog.Title render={<b />} className="text-base tracking-[-0.01em] max-sm:text-[15px]">
                    {slide.title}
                  </Dialog.Title>
                )}
                <Dialog.Description render={<span />} className={cn(mono, "text-[10px] tracking-widest text-muted uppercase")}>
                  {slide.place}
                </Dialog.Description>
              </figcaption>
              <p className={cn(mono, "m-0 hidden text-[10px] tracking-[0.08em] text-muted uppercase max-sm:block")} aria-hidden="true">
                Swipe the photo · pinch to zoom
              </p>
            </figure>

            {arrow(1, "max-sm:[grid-area:next] max-sm:justify-self-start")}
          </div>

          <div
            data-thumbs
            className="overflow-x-auto border-t-2 border-ink px-7 py-3.5 [scrollbar-width:none] max-sm:px-4 max-sm:py-3"
            data-keep-open
          >
            <div className="mx-auto flex w-max gap-2.5 max-sm:mx-0 max-sm:gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.file}
                  ref={i === index ? centerThumb : undefined}
                  type="button"
                  className={cn(
                    "relative h-11.5 w-18 flex-none cursor-pointer overflow-hidden rounded-md p-0 transition-opacity max-sm:h-10.5 max-sm:w-16.5",
                    i === index ? "border-3 border-ink opacity-100" : "border-2 border-[#D8D4CC] opacity-55 hover:opacity-85"
                  )}
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => i !== index && show(i, i > index ? 1 : -1)}
                >
                  <Image src={srcFor(s)} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
