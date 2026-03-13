import React from 'react';
import { Settings2, Paintbrush, Layers, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FieldRenderer } from './FieldRenderer';
import { fieldConfigByType } from '@/config/constants';
import { generateSectionMarkup } from '@/libs/methods';

export function InspectorCard({
  selectedSection,
  updateSetting,
  updateStyleOverride,
  applyThemeToSection,
  clearStyleOverrides,
}) {
  if (!selectedSection) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings2 className="h-5 w-5" />
            Inspector
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500">
            Select a section to edit its fields.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings2 className="h-5 w-5" />
          Inspector
        </CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
