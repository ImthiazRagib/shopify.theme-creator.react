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
        className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${value ? 'border-black bg-black text-white' : 'border-zinc-200 bg-white text-zinc-900'}`}
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
        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none"
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

function SectionPreview({ section }) {
  const { type, settings } = section;

  if (type === 'announcement-bar') {
    return (
      <div className="rounded-2xl px-4 py-3 text-sm" style={{ background: settings.background, color: settings.color }}>
        {settings.text}
      </div>
    );
  }

  if (type === 'header') {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-lg font-semibold">{settings.logoText}</div>
          <div className="flex flex-wrap gap-4 text-sm text-zinc-600">
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
      <div className={`flex min-h-[260px] flex-col justify-center rounded-[28px] border border-zinc-200 bg-gradient-to-br from-zinc-50 to-zinc-100 p-8 ${alignment}`}>
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-zinc-900">{settings.heading}</h2>
        <p className="mt-3 max-w-2xl text-sm text-zinc-600">{settings.subheading}</p>
        <button className="mt-6 rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white">
          {settings.buttonText}
        </button>
      </div>
    );
  }

  if (type === 'rich-text') {
    return (
      <div className="rounded-[28px] border border-zinc-200 bg-white p-8">
        <h3 className="text-2xl font-semibold text-zinc-900">{settings.heading}</h3>
        <p className="mt-3 text-sm leading-6 text-zinc-600">{settings.body}</p>
      </div>
    );
  }

  if (type === 'image-with-text') {
    return (
      <div className="grid gap-4 rounded-[28px] border border-zinc-200 bg-white p-4 md:grid-cols-2 md:p-6">
        <img
          src={settings.imageUrl}
          alt={settings.heading}
          className="h-64 w-full rounded-2xl object-cover"
        />
        <div className="flex flex-col justify-center">
          <h3 className="text-2xl font-semibold text-zinc-900">{settings.heading}</h3>
          <p className="mt-3 text-sm leading-6 text-zinc-600">{settings.body}</p>
        </div>
      </div>
    );
  }

  if (type === 'featured-collection' || type === 'product-grid') {
    const count = Math.max(1, Math.min(Number(settings.productsToShow || 4), 8));
    return (
      <div className="rounded-[28px] border border-zinc-200 bg-white p-6">
        <h3 className="text-xl font-semibold text-zinc-900">{settings.heading}</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: count }).map((_, idx) => (
            <div key={idx} className="rounded-2xl border border-zinc-200 p-3">
              <div className="h-28 rounded-xl bg-zinc-100" />
              <div className="mt-3 h-4 w-2/3 rounded bg-zinc-200" />
              <div className="mt-2 h-3 w-1/3 rounded bg-zinc-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'testimonial') {
    return (
      <div className="rounded-[28px] border border-zinc-200 bg-white p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">{settings.heading}</p>
        <blockquote className="mt-4 text-xl font-medium leading-8 text-zinc-900">“{settings.quote}”</blockquote>
        <p className="mt-4 text-sm text-zinc-600">— {settings.author}</p>
      </div>
    );
  }

  if (type === 'newsletter') {
    return (
      <div className="rounded-[28px] border border-zinc-200 bg-zinc-900 p-8 text-white">
        <h3 className="text-2xl font-semibold">{settings.heading}</h3>
        <p className="mt-3 max-w-xl text-sm text-zinc-300">{settings.body}</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            disabled
            className="h-12 flex-1 rounded-2xl border border-zinc-700 bg-zinc-800 px-4 text-sm text-white"
            value={settings.placeholder}
            readOnly
          />
          <button className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-zinc-900">
            {settings.buttonText}
          </button>
        </div>
      </div>
    );
  }

  if (type === 'footer') {
    return (
      <div className="rounded-[28px] border border-zinc-200 bg-white p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-zinc-600">{settings.copyright}</p>
          <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
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

export default function LiquidEditorApp() {
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 text-zinc-900">
      <div className="mx-auto grid max-w-[1600px] gap-4 p-4 lg:grid-cols-[300px_minmax(0,1fr)_340px]">
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
                      className="flex w-full items-center justify-between rounded-2xl border-2 border-violet-200 bg-white px-3 py-3 text-left transition hover:border-violet-400 hover:bg-violet-50 hover:shadow-md"
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
                <Button variant={viewMode === 'preview' ? 'default' : 'outline'} onClick={() => setViewMode('preview')} className="rounded-2xl">
                  <Eye className="mr-2 h-4 w-4" /> Preview
                </Button>
                <Button variant={viewMode === 'code' ? 'default' : 'outline'} onClick={() => setViewMode('code')} className="rounded-2xl">
                  <Code2 className="mr-2 h-4 w-4" /> Code
                </Button>
                <Button variant="outline" className="rounded-2xl" onClick={() => copyText(liquidTemplate)}>
                  <Copy className="mr-2 h-4 w-4" /> Copy Liquid
                </Button>
                <Button variant="outline" className="rounded-2xl" onClick={() => downloadFile('page-template.liquid', liquidTemplate)}>
                  <Download className="mr-2 h-4 w-4" /> Export Liquid
                </Button>
                <Button variant="default" className="rounded-2xl" onClick={() => exportThemeAsZip(sections)}>
                  <Package className="mr-2 h-4 w-4" /> Export ZIP (Shopify)
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
                    className={`rounded-2xl border bg-white p-3 transition ${selectedSection?.id === section.id ? 'border-black ring-2 ring-black/5' : 'border-zinc-200 hover:border-zinc-400'}`}
                  >
                    <div className="flex items-start gap-3">
                      <button className="mt-1 cursor-grab text-zinc-400">
                        <GripVertical className="h-4 w-4" />
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold">{section.label}</p>
                          <Badge variant="secondary" className="rounded-full">#{index + 1}</Badge>
                        </div>
                        <p className="mt-1 truncate text-xs text-zinc-500">{section.type}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-xl" onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'up'); }}>
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-xl" onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'down'); }}>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-xl text-red-500 hover:text-red-600" onClick={(e) => { e.stopPropagation(); removeSection(section.id); }}>
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
                  <div className="space-y-4 rounded-[28px] bg-zinc-100 p-4">
                    {sections.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-500">
                        Add components from the left panel to start building your page.
                      </div>
                    ) : (
                      sections.map((section) => <SectionPreview key={section.id} section={section} />)
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-semibold">Liquid Template</p>
                        <Button variant="outline" className="rounded-2xl" onClick={() => copyText(liquidTemplate)}>
                          <Copy className="mr-2 h-4 w-4" /> Copy
                        </Button>
                      </div>
                      <pre className="overflow-x-auto rounded-[24px] bg-zinc-950 p-5 text-xs leading-6 text-zinc-100">{liquidTemplate}</pre>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-semibold">JSON Template</p>
                        <Button variant="outline" className="rounded-2xl" onClick={() => copyText(jsonTemplate)}>
                          <Copy className="mr-2 h-4 w-4" /> Copy
                        </Button>
                      </div>
                      <pre className="overflow-x-auto rounded-[24px] bg-zinc-950 p-5 text-xs leading-6 text-zinc-100">{jsonTemplate}</pre>
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
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-sm font-semibold">{selectedSection.label}</p>
                  <p className="mt-1 text-xs text-zinc-500">{selectedSection.type}</p>
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

                <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Rendered section call</p>
                  <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all text-xs leading-6 text-zinc-700">
                    {generateSectionMarkup(selectedSection)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500">
                Select a section to edit its fields.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
