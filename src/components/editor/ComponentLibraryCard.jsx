import React from 'react';
import { Plus, LayoutTemplate } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { COMPONENT_LIBRARY } from '@/config/constants';

export function ComponentLibraryCard({ addSection }) {
  return (
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
  );
}
