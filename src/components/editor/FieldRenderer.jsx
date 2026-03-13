import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

export function FieldRenderer({ field, value, onChange }) {
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

  if (field.type === 'image') {
    const hasImage = value && String(value).trim().length > 0;
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... or upload below"
            className="flex-1 text-sm"
          />
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => onChange(reader.result);
                  reader.readAsDataURL(file);
                }
                e.target.value = '';
              }}
            />
            <span className="inline-flex items-center border border-zinc-200 bg-white px-3 py-2 text-xs font-medium hover:bg-zinc-50">
              Upload
            </span>
          </label>
        </div>
        {hasImage && (
          <div className="flex items-center gap-2">
            <img src={value} alt="Preview" className="h-16 w-auto max-w-[120px] object-contain border border-zinc-200" />
            <Button variant="ghost" size="sm" onClick={() => onChange('')} className="text-red-600">Remove</Button>
          </div>
        )}
      </div>
    );
  }

  if (field.type === 'testimonials') {
    const list = Array.isArray(value) && value.length > 0 ? value : [{ quote: '', author: '' }];
    return (
      <div className="space-y-3">
        {list.map((item, i) => (
          <div key={i} className="border border-zinc-200 bg-white p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Testimonial {i + 1}</span>
              <Button size="icon" variant="ghost" className="h-6 w-6 text-red-600" onClick={() => {
                const next = [...list];
                next.splice(i, 1);
                onChange(next.length ? next : [{ quote: '', author: '' }]);
              }} title="Remove">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <Textarea
              value={item.quote || ''}
              onChange={(e) => {
                const next = [...list];
                next[i] = { ...next[i], quote: e.target.value };
                onChange(next);
              }}
              placeholder="Quote"
              className="mb-2 min-h-[60px] text-sm"
            />
            <Input
              value={item.author || ''}
              onChange={(e) => {
                const next = [...list];
                next[i] = { ...next[i], author: e.target.value };
                onChange(next);
              }}
              placeholder="Author"
              className="text-sm"
            />
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => onChange([...list, { quote: '', author: '' }])}>
          <Plus className="mr-1 h-3 w-3" /> Add testimonial
        </Button>
      </div>
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
