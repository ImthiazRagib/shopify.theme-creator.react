import React from 'react';
import { getContrastColor } from '@/libs/methods';
import { TestimonialSlider } from './TestimonialSlider';
import { TEXT_ON_LIGHT, TEXT_MUTED } from '@/config/constants';

export function SectionPreview({ section, themeColors = { primary: '#E94D4D', secondary: '#FDF8EE' } }) {
  const { type, settings, styleOverrides = {} } = section;
  const primary = themeColors.primary || '#E94D4D';
  const secondary = themeColors.secondary || '#FDF8EE';
  const textOnPrimary = getContrastColor(primary);
  const bg = styleOverrides.background?.trim() || undefined;
  const textColor = styleOverrides.textColor?.trim() || undefined;

  const resolveBg = (themeBg) => bg ?? themeBg;
  const resolveText = (themeText) => textColor ?? themeText;

  if (type === 'announcement-bar') {
    return (
      <div className="flex items-center justify-center px-4 py-3 text-sm font-medium" style={{ background: resolveBg(primary), color: resolveText(textOnPrimary) }}>
        <span className="text-center">{settings.text}</span>
      </div>
    );
  }

  if (type === 'header') {
    const hasLogo = settings.logoUrl && String(settings.logoUrl).trim().length > 0;
    return (
      <div className="border-b border-zinc-200 px-5 py-4" style={{ background: resolveBg('#ffffff') }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <a href="/" className="flex shrink-0 items-center">
            {hasLogo ? (
              <img src={settings.logoUrl} alt={settings.logoText || 'Logo'} className="header__logo-img h-10 w-auto max-w-[140px] object-contain object-left md:h-12 md:max-w-[180px]" />
            ) : (
              <span className="text-lg font-semibold" style={{ color: resolveText(TEXT_ON_LIGHT) }}>{settings.logoText}</span>
            )}
          </a>
          <div className="flex flex-wrap gap-4 text-sm" style={{ color: resolveText(TEXT_MUTED) }}>
            {String(settings.menu)
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
              .map((item) => (
                <span key={item}>{item}</span>
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'hero') {
    const alignment =
      settings.align === 'center'
        ? 'items-center text-center'
        : settings.align === 'right'
        ? 'items-end text-right'
        : 'items-start text-left';
    const hasImage = settings.imageUrl && String(settings.imageUrl).trim().length > 0;
    const textColor = hasImage ? '#ffffff' : resolveText(TEXT_ON_LIGHT);
    const subColor = hasImage ? 'rgba(255,255,255,0.9)' : resolveText(TEXT_MUTED);

    return (
      <div
        className={`relative flex min-h-[260px] flex-col justify-center overflow-hidden p-8 ${alignment}`}
        style={{
          background: hasImage ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${settings.imageUrl}) center/cover` : resolveBg(secondary),
        }}
      >
        <h2 className="relative max-w-2xl text-3xl font-bold tracking-tight" style={{ color: textColor }}>{settings.heading}</h2>
        <p className="relative mt-3 max-w-2xl text-sm" style={{ color: subColor }}>{settings.subheading}</p>
        <button className="relative mt-6 px-5 py-3 text-sm font-semibold" style={{ background: primary, color: textOnPrimary }}>
          {settings.buttonText}
        </button>
      </div>
    );
  }

  if (type === 'rich-text') {
    return (
      <div className="border-b border-zinc-200 p-8" style={{ background: resolveBg('#ffffff') }}>
        <h3 className="text-2xl font-semibold" style={{ color: resolveText(TEXT_ON_LIGHT) }}>{settings.heading}</h3>
        <p className="mt-3 text-sm leading-6" style={{ color: resolveText(TEXT_MUTED) }}>{settings.body}</p>
      </div>
    );
  }

  if (type === 'image-with-text') {
    return (
      <div className="grid gap-4 border-b border-zinc-200 p-4 md:grid-cols-2 md:p-6" style={{ background: resolveBg('#ffffff') }}>
        <img
          src={settings.imageUrl}
          alt={settings.heading}
          className="h-64 w-full object-cover"
        />
        <div className="flex flex-col justify-center">
          <h3 className="text-2xl font-semibold" style={{ color: resolveText(TEXT_ON_LIGHT) }}>{settings.heading}</h3>
          <p className="mt-3 text-sm leading-6" style={{ color: resolveText(TEXT_MUTED) }}>{settings.body}</p>
        </div>
      </div>
    );
  }

  if (type === 'featured-collection' || type === 'product-grid') {
    const count = Math.max(1, Math.min(Number(settings.productsToShow || 4), 8));
    return (
      <div className="border-b border-zinc-200 p-6" style={{ background: resolveBg('#ffffff') }}>
        <h3 className="text-xl font-semibold" style={{ color: resolveText(TEXT_ON_LIGHT) }}>{settings.heading}</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: count }).map((_, idx) => (
            <div key={idx} className="border border-zinc-200 p-3">
              <div className="h-28 bg-zinc-100" />
              <div className="mt-3 h-4 w-2/3 bg-zinc-200" />
              <div className="mt-2 h-3 w-1/3 bg-zinc-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'testimonial') {
    const testimonials = Array.isArray(settings.testimonials) ? settings.testimonials : [{ quote: settings.quote || '', author: settings.author || '' }];
    return (
      <TestimonialSlider
        heading={settings.heading}
        testimonials={testimonials}
        resolveBg={resolveBg}
        resolveText={resolveText}
        TEXT_MUTED={TEXT_MUTED}
        TEXT_ON_LIGHT={TEXT_ON_LIGHT}
      />
    );
  }

  if (type === 'newsletter') {
    return (
      <div className="p-8" style={{ background: resolveBg(primary) }}>
        <h3 className="text-2xl font-semibold" style={{ color: resolveText(textOnPrimary) }}>{settings.heading}</h3>
        <p className="mt-3 max-w-xl text-sm" style={{ color: resolveText(textOnPrimary), opacity: 0.9 }}>{settings.body}</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            disabled
            className="h-12 flex-1 border px-4 text-sm"
            style={{ borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.15)', color: resolveText(textOnPrimary) }}
            value={settings.placeholder}
            readOnly
          />
          <button className="px-5 py-3 text-sm font-semibold" style={{ background: '#ffffff', color: primary }}>
            {settings.buttonText}
          </button>
        </div>
      </div>
    );
  }

  if (type === 'footer') {
    const hasLogo = settings.logoUrl && String(settings.logoUrl).trim().length > 0;
    return (
      <div className="border-t border-zinc-200 p-6" style={{ background: resolveBg('#ffffff') }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            {hasLogo && (
              <a href="/" className="inline-block">
                <img src={settings.logoUrl} alt="Logo" className="footer__logo-img h-8 w-auto max-w-[100px] object-contain object-left md:h-10 md:max-w-[120px]" />
              </a>
            )}
            <p className="text-sm" style={{ color: resolveText(TEXT_MUTED) }}>{settings.copyright}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm" style={{ color: resolveText(TEXT_MUTED) }}>
            {String(settings.links)
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
              .map((item) => (
                <span key={item}>{item}</span>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
