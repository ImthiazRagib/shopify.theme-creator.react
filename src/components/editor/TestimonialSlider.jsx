import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function TestimonialSlider({ heading, testimonials, resolveBg, resolveText, TEXT_MUTED, TEXT_ON_LIGHT }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const list = testimonials.filter((t) => t && (t.quote || t.author));
  const count = list.length || 1;
  const current = list[activeIndex % count] || { quote: '', author: '' };

  return (
    <div className="border-b border-zinc-200 p-4 sm:p-6 md:p-8 relative overflow-hidden" style={{ background: resolveBg('#ffffff') }}>
      <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em]" style={{ color: TEXT_MUTED }}>{heading}</p>
      <blockquote className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl font-medium leading-relaxed sm:leading-8 min-h-[3rem] sm:min-h-[4rem]" style={{ color: TEXT_ON_LIGHT }}>
        &ldquo;{current.quote}&rdquo;
      </blockquote>
      <p className="mt-3 sm:mt-4 text-xs sm:text-sm" style={{ color: resolveText(TEXT_MUTED) }}>&mdash; {current.author}</p>
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => setActiveIndex((i) => (i - 1 + count) % count)}
            className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 border border-zinc-200 bg-white p-1.5 sm:p-2 hover:bg-zinc-50 transition touch-manipulation"
            title="Previous"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((i) => (i + 1) % count)}
            className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 border border-zinc-200 bg-white p-1.5 sm:p-2 hover:bg-zinc-50 transition touch-manipulation"
            title="Next"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <div className="mt-4 sm:mt-6 flex justify-center gap-1.5 sm:gap-2 pl-10 pr-10 sm:pl-12 sm:pr-12 md:pl-14 md:pr-14">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition touch-manipulation ${i === activeIndex ? 'bg-zinc-900' : 'bg-zinc-300 hover:bg-zinc-400'}`}
                title={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
