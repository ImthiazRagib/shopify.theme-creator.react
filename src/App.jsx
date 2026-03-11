import './App.css';
import React, { useMemo, useState } from 'react';
import {
  Plus,
  Trash2,
  GripVertical,
  Settings2,
  Eye,
  Code2,
  Copy,
  Download,
  LayoutTemplate,
  ChevronUp,
  ChevronDown,
  Package,
  Palette,
  Paintbrush,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { exportThemeAsZip } from './themeExport';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';

const COMPONENT_LIBRARY = [
  {
    type: 'announcement-bar',
    label: 'Announcement Bar',
    category: 'Header',
    defaults: {
      text: 'Free shipping on all orders over $50',
      background: '#111827',
      color: '#ffffff',
    },
  },
  {
    type: 'header',
    label: 'Header',
    category: 'Header',
    defaults: {
      logoText: 'Your Store',
      menu: 'Home, Shop, About, Contact',
      sticky: true,
    },
  },
  {
    type: 'hero',
    label: 'Hero Banner',
    category: 'Content',
    defaults: {
      heading: 'Build your next Shopify section visually',
      subheading: 'Drag, edit, reorder, and export your page layout structure.',
      buttonText: 'Shop now',
      buttonLink: '/collections/all',
      align: 'left',
    },
  },
  {
    type: 'rich-text',
    label: 'Rich Text',
    category: 'Content',
    defaults: {
      heading: 'Tell your brand story',
      body: 'Use this area to explain your brand, campaign, or featured collection.',
    },
  },
  {
    type: 'image-with-text',
    label: 'Image With Text',
    category: 'Content',
    defaults: {
      heading: 'Crafted for modern commerce',
      body: 'Pair strong content with visual merchandising sections.',
      imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop',
    },
  },
  {
    type: 'featured-collection',
    label: 'Featured Collection',
    category: 'Commerce',
    defaults: {
      heading: 'Featured collection',
      collectionHandle: 'frontpage',
      productsToShow: 4,
    },
  },
  {
    type: 'product-grid',
    label: 'Product Grid',
    category: 'Commerce',
    defaults: {
      heading: 'Best sellers',
      columns: 4,
      productsToShow: 8,
    },
  },
  {
    type: 'testimonial',
    label: 'Testimonials',
    category: 'Social Proof',
    defaults: {
      heading: 'What customers say',
      quote: 'Fast delivery, clean design, and smooth shopping experience.',
      author: 'A happy customer',
    },
  },
  {
    type: 'newsletter',
    label: 'Newsletter',
    category: 'Marketing',
    defaults: {
      heading: 'Stay in the loop',
      body: 'Subscribe for offers, product drops, and store updates.',
      placeholder: 'Enter your email',
      buttonText: 'Subscribe',
    },
  },
  {
    type: 'footer',
    label: 'Footer',
    category: 'Footer',
    defaults: {
      copyright: '© 2026 Your Store',
      links: 'Privacy Policy, Terms of Service, Contact',
    },
  },
];

const fieldConfigByType = {
  'announcement-bar': [
    { key: 'text', label: 'Text', type: 'textarea' },
    { key: 'background', label: 'Background', type: 'text' },
    { key: 'color', label: 'Text Color', type: 'text' },
  ],
  header: [
    { key: 'logoText', label: 'Logo Text', type: 'text' },
    { key: 'menu', label: 'Menu Items (comma separated)', type: 'textarea' },
    { key: 'sticky', label: 'Sticky Header', type: 'boolean' },
  ],
  hero: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'subheading', label: 'Subheading', type: 'textarea' },
    { key: 'buttonText', label: 'Button Text', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'align', label: 'Alignment', type: 'select', options: ['left', 'center', 'right'] },
  ],
  'rich-text': [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'body', label: 'Body', type: 'textarea' },
  ],
  'image-with-text': [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'body', label: 'Body', type: 'textarea' },
    { key: 'imageUrl', label: 'Image URL', type: 'text' },
  ],
  'featured-collection': [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'collectionHandle', label: 'Collection Handle', type: 'text' },
    { key: 'productsToShow', label: 'Products To Show', type: 'number' },
  ],
  'product-grid': [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'columns', label: 'Columns', type: 'number' },
    { key: 'productsToShow', label: 'Products To Show', type: 'number' },
  ],
  testimonial: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'quote', label: 'Quote', type: 'textarea' },
    { key: 'author', label: 'Author', type: 'text' },
  ],
  newsletter: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'body', label: 'Body', type: 'textarea' },
    { key: 'placeholder', label: 'Input Placeholder', type: 'text' },
    { key: 'buttonText', label: 'Button Text', type: 'text' },
  ],
  footer: [
    { key: 'copyright', label: 'Copyright', type: 'text' },
    { key: 'links', label: 'Footer Links (comma separated)', type: 'textarea' },
  ],
};

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createInstance(component) {
  return {
    id: uid(),
    type: component.type,
    label: component.label,
    settings: { ...component.defaults },
    styleOverrides: {},
  };
}

function liquidValue(value) {
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  return String(value ?? '').replace(/"/g, '&quot;');
}

function generateSectionMarkup(section) {
  const settingPairs = Object.entries(section.settings)
    .map(([key, value]) => `${key}: "${liquidValue(value)}"`)
    .join(', ');

  return `{% render '${section.type}', ${settingPairs} %}`;
}

function generateJsonTemplate(sections) {
  const result = {
    sections: {},
    order: [],
  };

  sections.forEach((section, index) => {
    const sectionId = `${section.type.replace(/[^a-z0-9]/gi, '_')}_${index + 1}`;
    result.sections[sectionId] = {
      type: section.type,
      settings: section.settings,
    };
    result.order.push(sectionId);
  });

  return JSON.stringify(result, null, 2);
}

function copyText(value) {
  navigator.clipboard.writeText(value);
}

function getContrastColor(hex) {
  if (!hex || hex.length < 7) return '#ffffff';
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const luminance = 0.299 * r + 0.589 * g + 0.114 * b;
  return luminance > 0.5 ? '#18181b' : '#ffffff';
}

function downloadFile(filename, content, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function FieldRenderer({ field, value, onChange }) {
  if (field.type === 'textarea') {
    return (
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[110px]"
      />
    );
  }

  if (field.type === 'boolean') {
    return (
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`w-full border px-3 py-2 text-left text-sm transition ${value ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 bg-white text-zinc-900'}`}
      >
        {value ? 'Enabled' : 'Disabled'}
      </button>
    );
  }

  if (field.type === 'select') {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-zinc-200 bg-white px-3 py-2 text-sm outline-none"
      >
        {field.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  return (
    <Input
      type={field.type === 'number' ? 'number' : 'text'}
      value={value}
      onChange={(e) => onChange(field.type === 'number' ? Number(e.target.value) : e.target.value)}
    />
  );
}

const TEXT_ON_LIGHT = '#171717';
const TEXT_MUTED = '#525252';

function SectionPreview({ section, themeColors = { primary: '#E94D4D', secondary: '#FDF8EE' } }) {
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
      <div className="px-4 py-3 text-sm text-center font-medium" style={{ background: resolveBg(primary), color: resolveText(textOnPrimary) }}>
        {settings.text}
      </div>
    );
  }

  if (type === 'header') {
    return (
      <div className="border-b border-zinc-200 px-5 py-4" style={{ background: resolveBg('#ffffff') }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-lg font-semibold" style={{ color: resolveText(TEXT_ON_LIGHT) }}>{settings.logoText}</div>
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

    return (
      <div className={`flex min-h-[260px] flex-col justify-center p-8 ${alignment}`} style={{ background: resolveBg(secondary) }}>
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight" style={{ color: resolveText(TEXT_ON_LIGHT) }}>{settings.heading}</h2>
        <p className="mt-3 max-w-2xl text-sm" style={{ color: resolveText(TEXT_MUTED) }}>{settings.subheading}</p>
        <button className="mt-6 px-5 py-3 text-sm font-semibold" style={{ background: primary, color: textOnPrimary }}>
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
    return (
      <div className="border-b border-zinc-200 p-8" style={{ background: resolveBg('#ffffff') }}>
        <p className="text-sm font-medium uppercase tracking-[0.2em]" style={{ color: TEXT_MUTED }}>{settings.heading}</p>
        <blockquote className="mt-4 text-xl font-medium leading-8" style={{ color: TEXT_ON_LIGHT }}>“{settings.quote}”</blockquote>
        <p className="mt-4 text-sm" style={{ color: resolveText(TEXT_MUTED) }}>— {settings.author}</p>
      </div>
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
    return (
      <div className="border-t border-zinc-200 p-6" style={{ background: resolveBg('#ffffff') }}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm" style={{ color: resolveText(TEXT_MUTED) }}>{settings.copyright}</p>
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

const DEFAULT_THEME = { primary: '#E94D4D', secondary: '#FDF8EE' };

const COLOR_PALETTES = [
  { name: 'Classic Red', primary: '#E94D4D', secondary: '#FDF8EE' },
  { name: 'Ocean Blue', primary: '#2563eb', secondary: '#eff6ff' },
  { name: 'Forest Green', primary: '#059669', secondary: '#ecfdf5' },
  { name: 'Sunset', primary: '#ea580c', secondary: '#fff7ed' },
  { name: 'Violet', primary: '#7c3aed', secondary: '#f5f3ff' },
  { name: 'Slate', primary: '#475569', secondary: '#f8fafc' },
  { name: 'Rose', primary: '#e11d48', secondary: '#fff1f2' },
  { name: 'Teal', primary: '#0d9488', secondary: '#f0fdfa' },
];

export default function LiquidEditorApp() {
  const [themeColors, setThemeColors] = useState(DEFAULT_THEME);
  const [sections, setSections] = useState([
    createInstance(COMPONENT_LIBRARY.find((x) => x.type === 'announcement-bar')),
    createInstance(COMPONENT_LIBRARY.find((x) => x.type === 'header')),
    createInstance(COMPONENT_LIBRARY.find((x) => x.type === 'hero')),
    createInstance(COMPONENT_LIBRARY.find((x) => x.type === 'featured-collection')),
    createInstance(COMPONENT_LIBRARY.find((x) => x.type === 'newsletter')),
    createInstance(COMPONENT_LIBRARY.find((x) => x.type === 'footer')),
  ]);
  const [selectedId, setSelectedId] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const [viewMode, setViewMode] = useState('preview');

  const selectedSection = useMemo(
    () => sections.find((section) => section.id === selectedId) || sections[0] || null,
    [sections, selectedId]
  );

  const addSection = (component) => {
    const next = createInstance(component);
    setSections((prev) => [...prev, next]);
    setSelectedId(next.id);
  };

  const removeSection = (id) => {
    setSections((prev) => prev.filter((section) => section.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const updateSetting = (id, key, value) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id
          ? { ...section, settings: { ...section.settings, [key]: value } }
          : section
      )
    );
  };

  const updateStyleOverride = (id, key, value) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id
          ? { ...section, styleOverrides: { ...(section.styleOverrides || {}), [key]: value } }
          : section
      )
    );
  };

  const applyThemeToSection = (id, variant) => {
    const primary = themeColors.primary || '#E94D4D';
    const secondary = themeColors.secondary || '#FDF8EE';
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== id) return section;
        const overrides = section.styleOverrides || {};
        if (variant === 'primary') {
          return { ...section, styleOverrides: { ...overrides, background: primary, textColor: getContrastColor(primary) } };
        }
        return { ...section, styleOverrides: { ...overrides, background: secondary, textColor: TEXT_ON_LIGHT } };
      })
    );
  };

  const clearStyleOverrides = (id) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, styleOverrides: {} } : section
      )
    );
  };

  const moveSection = (id, direction) => {
    setSections((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index === -1) return prev;
      const nextIndex = direction === 'up' ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const copy = [...prev];
      [copy[index], copy[nextIndex]] = [copy[nextIndex], copy[index]];
      return copy;
    });
  };

  const onDragStart = (id) => setDraggedId(id);

  const onDrop = (targetId) => {
    if (!draggedId || draggedId === targetId) return;

    setSections((prev) => {
      const draggedIndex = prev.findIndex((item) => item.id === draggedId);
      const targetIndex = prev.findIndex((item) => item.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1) return prev;

      const next = [...prev];
      const [draggedItem] = next.splice(draggedIndex, 1);
      next.splice(targetIndex, 0, draggedItem);
      return next;
    });

    setDraggedId(null);
  };

  const liquidTemplate = useMemo(
    () => sections.map((section) => generateSectionMarkup(section)).join('\n\n'),
    [sections]
  );

  const jsonTemplate = useMemo(() => generateJsonTemplate(sections), [sections]);

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <div className="mx-auto grid max-w-[1600px] gap-4 p-4 lg:grid-cols-[300px_minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Palette className="h-5 w-5" />
                Theme Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="mb-2 block text-xs font-medium text-zinc-600">Presets</label>
                <div className="flex flex-wrap gap-1.5">
                  {COLOR_PALETTES.map((palette) => {
                    const isActive = themeColors.primary?.toLowerCase() === palette.primary.toLowerCase() && themeColors.secondary?.toLowerCase() === palette.secondary.toLowerCase();
                    return (
                    <button
                      key={palette.name}
                      type="button"
                      onClick={() => setThemeColors({ primary: palette.primary, secondary: palette.secondary })}
                      className={`flex items-center gap-1.5 border px-2 py-1.5 text-xs font-medium transition hover:border-zinc-400 ${
                        isActive ? 'border-zinc-900 ring-2 ring-zinc-900/10 bg-zinc-50' : 'border-zinc-200 bg-white hover:bg-zinc-50'
                      }`}
                      title={palette.name}
                    >
                      <span className="h-4 w-4 border border-zinc-200" style={{ background: palette.primary }} />
                      <span className="h-4 w-4 border border-zinc-200" style={{ background: palette.secondary }} />
                      <span className="hidden sm:inline text-zinc-700">{palette.name}</span>
                    </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Primary</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={themeColors.primary}
                    onChange={(e) => setThemeColors((t) => ({ ...t, primary: e.target.value }))}
                    className="h-9 w-14 cursor-pointer border border-zinc-200 bg-white p-0"
                  />
                  <input
                    type="text"
                    value={themeColors.primary}
                    onChange={(e) => setThemeColors((t) => ({ ...t, primary: e.target.value }))}
                    className="flex-1 border border-zinc-200 bg-white px-2 py-1.5 text-xs font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Secondary</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={themeColors.secondary}
                    onChange={(e) => setThemeColors((t) => ({ ...t, secondary: e.target.value }))}
                    className="h-9 w-14 cursor-pointer border border-zinc-200 bg-white p-0"
                  />
                  <input
                    type="text"
                    value={themeColors.secondary}
                    onChange={(e) => setThemeColors((t) => ({ ...t, secondary: e.target.value }))}
                    className="flex-1 border border-zinc-200 bg-white px-2 py-1.5 text-xs font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <LayoutTemplate className="h-5 w-5" />
              Component Library
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {['Header', 'Content', 'Commerce', 'Social Proof', 'Marketing', 'Footer'].map((group) => (
              <div key={group}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{group}</p>
                <div className="space-y-2">
                  {COMPONENT_LIBRARY.filter((item) => item.category === group).map((component) => (
                    <button
                      key={component.type}
                      onClick={() => addSection(component)}
                      className="flex w-full items-center justify-between border border-zinc-200 bg-white px-3 py-3 text-left transition hover:border-zinc-400 hover:bg-zinc-50"
                    >
                      <div>
                        <p className="text-sm font-medium">{component.label}</p>
                        <p className="text-xs text-zinc-500">{component.type}</p>
                      </div>
                      <Plus className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Liquid Section Editor</h1>
                <p className="text-sm text-zinc-600">
                  Drag sections top to bottom, edit settings, and export template-ready code.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="icon" variant={viewMode === 'preview' ? 'default' : 'outline'} onClick={() => setViewMode('preview')} title="Preview">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="icon" variant={viewMode === 'code' ? 'default' : 'outline'} onClick={() => setViewMode('code')} title="Code">
                  <Code2 className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" onClick={() => copyText(liquidTemplate)} title="Copy Liquid">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" onClick={() => downloadFile('page-template.liquid', liquidTemplate)} title="Export Liquid">
                  <Download className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="default" onClick={() => exportThemeAsZip(sections, themeColors)} title="Export ZIP (Shopify)">
                  <Package className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Page Structure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    draggable
                    onDragStart={() => onDragStart(section.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => onDrop(section.id)}
                    onClick={() => setSelectedId(section.id)}
                    className={`border bg-white p-3 transition ${selectedSection?.id === section.id ? 'border-zinc-900 ring-2 ring-zinc-900/10' : 'border-zinc-200 hover:border-zinc-400'}`}
                  >
                    <div className="flex items-start gap-3">
                      <button type="button" className="mt-1 cursor-grab text-zinc-400" title="Drag to reorder">
                        <GripVertical className="h-4 w-4" />
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold">{section.label}</p>
                          <Badge variant="secondary">#{index + 1}</Badge>
                        </div>
                        <p className="mt-1 truncate text-xs text-zinc-500">{section.type}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'up'); }} title="Move up">
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'down'); }} title="Move down">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700" onClick={(e) => { e.stopPropagation(); removeSection(section.id); }} title="Remove section">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{viewMode === 'preview' ? 'Live Preview' : 'Generated Code'}</CardTitle>
              </CardHeader>
              <CardContent>
                {viewMode === 'preview' ? (
                  <div className="space-y-0 border border-zinc-200 p-0" style={{ background: themeColors.secondary }}>
                    {sections.length === 0 ? (
                      <div className="border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500">
                        Add components from the left panel to start building your page.
                      </div>
                    ) : (
                      sections.map((section) => <SectionPreview key={section.id} section={section} themeColors={themeColors} />)
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-semibold">Liquid Template</p>
                        <Button size="icon" variant="outline" onClick={() => copyText(liquidTemplate)} title="Copy Liquid">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <pre className="overflow-x-auto border border-zinc-800 bg-zinc-950 p-5 text-xs leading-6 text-zinc-100">{liquidTemplate}</pre>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-semibold">JSON Template</p>
                        <Button size="icon" variant="outline" onClick={() => copyText(jsonTemplate)} title="Copy JSON">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <pre className="overflow-x-auto border border-zinc-800 bg-zinc-950 p-5 text-xs leading-6 text-zinc-100">{jsonTemplate}</pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings2 className="h-5 w-5" />
              Inspector
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSection ? (
              <div className="space-y-4">
                <div className="border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-sm font-semibold">{selectedSection.label}</p>
                  <p className="mt-1 text-xs text-zinc-500">{selectedSection.type}</p>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Colors</p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => applyThemeToSection(selectedSection.id, 'primary')} title="Apply Primary">
                      <Paintbrush className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => applyThemeToSection(selectedSection.id, 'secondary')} title="Apply Secondary">
                      <Layers className="h-4 w-4" />
                    </Button>
                    {Object.keys(selectedSection.styleOverrides || {}).length > 0 && (
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => clearStyleOverrides(selectedSection.id)} title="Reset colors">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-zinc-600">Background</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={(selectedSection.styleOverrides || {}).background || '#ffffff'}
                          onChange={(e) => updateStyleOverride(selectedSection.id, 'background', e.target.value)}
                          className="h-9 w-12 shrink-0 cursor-pointer border border-zinc-200 bg-white p-0"
                        />
                        <input
                          type="text"
                          value={(selectedSection.styleOverrides || {}).background ?? ''}
                          onChange={(e) => updateStyleOverride(selectedSection.id, 'background', e.target.value)}
                          placeholder="Use theme"
                          className="min-w-0 flex-1 border border-zinc-200 bg-white px-2 py-1.5 text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-zinc-600">Text</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={(selectedSection.styleOverrides || {}).textColor || '#171717'}
                          onChange={(e) => updateStyleOverride(selectedSection.id, 'textColor', e.target.value)}
                          className="h-9 w-12 shrink-0 cursor-pointer border border-zinc-200 bg-white p-0"
                        />
                        <input
                          type="text"
                          value={(selectedSection.styleOverrides || {}).textColor ?? ''}
                          onChange={(e) => updateStyleOverride(selectedSection.id, 'textColor', e.target.value)}
                          placeholder="Use theme"
                          className="min-w-0 flex-1 border border-zinc-200 bg-white px-2 py-1.5 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {(fieldConfigByType[selectedSection.type] || []).map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">{field.label}</label>
                    <FieldRenderer
                      field={field}
                      value={selectedSection.settings[field.key]}
                      onChange={(value) => updateSetting(selectedSection.id, field.key, value)}
                    />
                  </div>
                ))}

                <div className="border border-dashed border-zinc-300 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Rendered section call</p>
                  <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all text-xs leading-6 text-zinc-700">
                    {generateSectionMarkup(selectedSection)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500">
                Select a section to edit its fields.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
