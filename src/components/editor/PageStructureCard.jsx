import React from 'react';
import { GripVertical, ChevronUp, ChevronDown, Trash2, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SectionPreview } from './SectionPreview';
import { copyText } from '@/libs/methods';

export function PageStructureCard({ sections, selectedSection, selectedId, themeColors, viewMode, liquidTemplate, jsonTemplate, setSelectedId, onDragStart, onDrop, moveSection, removeSection }) {
  return (
    <>
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
    </>
  );
}
