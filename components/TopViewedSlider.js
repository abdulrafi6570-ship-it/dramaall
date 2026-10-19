'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Play, ChevronLeft, ChevronRight, Flame, Film } from 'lucide-react';

export default function TopViewedSlider({ items = [] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = items.length;

  // Otomatis geser slide setiap 4 detik
  useEffect(() => {
    if (total <= 1 || paused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 4000);
    return () => clearInterval(timer);
  }, [total, paused]);

  if (total === 0) return null;

  const prevSlide = () => setCurrent((c) => (c - 1 + total) % total);
  const nextSlide = () => setCurrent((c) => (c + 1) % total);

  const activeItem = items[current];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative overflow-hidden rounded-3xl border-[3px] border-border bg-card shadow-neo"
    >
      <div className="relative h-[280px] sm:h-[340px] w-full overflow-hidden bg-black">
        {/* Latar: poster yang sama, diburamkan, mengisi seluruh banner */}
        {activeItem.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`bg-${activeItem.id}`}
            src={activeItem.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-125 object-cover opacity-60 blur-2xl"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-secondary/40 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/60" />

        {/* Badge Peringkat & Jumlah Penonton */}
        <div className="absolute left-3 right-3 top-3 z-10 flex items-center justify-between gap-2 sm:left-4 sm:right-4 sm:top-3.5">
          <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full border-2 border-border bg-highlight px-2.5 py-1 text-[11px] font-extrabold text-highlight-foreground shadow-neo-sm sm:px-3 sm:text-xs">
            <Flame size={14} className="shrink-0 fill-current" />
            <span className="truncate">#{current + 1} Paling Banyak Ditonton</span>
          </span>

          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-white/30 bg-black/60 px-2.5 py-1 text-[11px] font-extrabold text-white backdrop-blur-md sm:px-3 sm:text-xs">
            <Eye size={14} className="text-primary" />
            <span>{activeItem.views}x</span>
            <span className="hidden sm:inline">ditonton</span>
          </span>
        </div>

        {/* Isi: poster utuh (tidak dipotong) di kiri, info di kanan */}
        <div className="relative z-10 flex h-full items-center gap-3 px-11 pb-5 pt-14 sm:gap-8 sm:px-20 sm:pb-6 sm:pt-16">
          <div className="flex h-full shrink-0 items-center">
            {activeItem.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={activeItem.id}
                src={activeItem.image}
                alt={activeItem.title}
                className="h-full max-w-[30vw] rounded-xl border-[3px] border-border bg-black/40 object-contain shadow-neo sm:max-w-[300px]"
              />
            ) : activeItem.video_url ? (
              <video
                key={activeItem.id}
                src={activeItem.video_url}
                muted
                playsInline
                preload="metadata"
                className="h-full max-w-[30vw] rounded-xl border-[3px] border-border bg-black/40 object-contain shadow-neo sm:max-w-[300px]"
              />
            ) : (
              <div className="grid h-full aspect-[2/3] place-items-center rounded-xl border-[3px] border-border bg-black/50 text-white/60">
                <Film size={32} />
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-2 text-white sm:gap-3">
            {activeItem.dramaTitle && (
              <div className="inline-flex max-w-full items-center gap-1 rounded-md border border-border bg-primary/90 px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                <Film size={12} className="shrink-0" />
                <span className="truncate">{activeItem.dramaTitle}</span>
              </div>
            )}
            <h2 className="line-clamp-3 text-base font-extrabold leading-tight drop-shadow-md sm:line-clamp-2 sm:text-3xl">
              {activeItem.title}
            </h2>
            {activeItem.description && (
              <p className="hidden text-sm text-white/80 line-clamp-2 sm:block">
                {activeItem.description}
              </p>
            )}
            <Link
              href={activeItem.href}
              className="mt-1 inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-2xl border-[3px] border-border bg-primary px-3 py-2 text-xs font-extrabold text-primary-foreground shadow-neo-sm transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <Play size={16} fill="currentColor" />
              <span>Tonton Klip</span>
            </Link>
          </div>
        </div>

        {/* Tombol Panah Kiri & Kanan */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Slide Sebelumnya"
              className="absolute left-1.5 sm:left-2.5 top-1/2 -translate-y-1/2 z-20 grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full border-2 border-border bg-card/90 text-foreground shadow-neo-sm hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Slide Berikutnya"
              className="absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 z-20 grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full border-2 border-border bg-card/90 text-foreground shadow-neo-sm hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Indikator Titik Slide di Bawah */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-2 border-t-2 border-border bg-card py-2.5">
          {items.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrent(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-2.5 rounded-full border border-border transition-all ${
                idx === current ? 'w-7 bg-primary' : 'w-2.5 bg-muted hover:bg-secondary'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
