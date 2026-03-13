import React from 'react';
import { Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { COLOR_PALETTES } from '@/config/constants';

export function ThemeColorsCard({ themeColors, setThemeColors }) {
  return (
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
          <div className="flex gap-2">
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
          <div className="flex gap-2">
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
  );
}
