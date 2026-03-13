import React from 'react';
import { Eye, Code2, Copy, Download, Package } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { copyText, downloadFile } from '@/libs/methods';
import { exportThemeAsZip } from '@/themeExport';

export function Toolbar({ viewMode, setViewMode, liquidTemplate, sections, themeColors }) {
  return (
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
  );
}
