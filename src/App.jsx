import './App.css';
import React, { useMemo, useState } from 'react';
import { createInstance, generateSectionMarkup, generateJsonTemplate, getContrastColor } from '@/libs/methods';
import {
  COMPONENT_LIBRARY,
  DEFAULT_THEME,
  TEXT_ON_LIGHT,
} from '@/config/constants';
import {
  ThemeColorsCard,
  ComponentLibraryCard,
  Toolbar,
  PageStructureCard,
  InspectorCard,
} from '@/components/editor';

export default function LiquidEditorApp() {
  const [themeColors, setThemeColors] = useState(DEFAULT_THEME);
  const [sections, setSections] = useState([
    createInstance(COMPONENT_LIBRARY.find((x) => x.type === 'announcement-bar')),
    createInstance(COMPONENT_LIBRARY.find((x) => x.type === 'header')),
    createInstance(COMPONENT_LIBRARY.find((x) => x.type === 'hero')),
    createInstance(COMPONENT_LIBRARY.find((x) => x.type === 'featured-collection')),
    createInstance(COMPONENT_LIBRARY.find((x) => x.type === 'testimonial')),
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
          <ThemeColorsCard themeColors={themeColors} setThemeColors={setThemeColors} />
          <ComponentLibraryCard addSection={addSection} />
        </div>

        <div className="space-y-4">
          <div className="rounded-md border border-zinc-200 bg-white">
            <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Liquid Section Editor</h1>
                <p className="text-sm text-zinc-600">
                  Drag sections top to bottom, edit settings, and export template-ready code.
                </p>
              </div>
              <Toolbar
                viewMode={viewMode}
                setViewMode={setViewMode}
                liquidTemplate={liquidTemplate}
                sections={sections}
                themeColors={themeColors}
              />
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
            <PageStructureCard
              sections={sections}
              selectedSection={selectedSection}
              selectedId={selectedId}
              themeColors={themeColors}
              viewMode={viewMode}
              liquidTemplate={liquidTemplate}
              jsonTemplate={jsonTemplate}
              setSelectedId={setSelectedId}
              onDragStart={onDragStart}
              onDrop={onDrop}
              moveSection={moveSection}
              removeSection={removeSection}
            />
          </div>
        </div>

        <InspectorCard
          selectedSection={selectedSection}
          updateSetting={updateSetting}
          updateStyleOverride={updateStyleOverride}
          applyThemeToSection={applyThemeToSection}
          clearStyleOverrides={clearStyleOverrides}
        />
      </div>
    </div>
  );
}
