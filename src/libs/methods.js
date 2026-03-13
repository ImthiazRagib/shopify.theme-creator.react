export function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createInstance(component) {
  return {
    id: uid(),
    type: component.type,
    label: component.label,
    settings: { ...component.defaults },
    styleOverrides: {},
  };
}

export function liquidValue(value) {
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) return JSON.stringify(value).replace(/"/g, '&quot;');
  return String(value ?? '').replace(/"/g, '&quot;');
}

export function generateSectionMarkup(section) {
  const settingPairs = Object.entries(section.settings)
    .map(([key, value]) => `${key}: "${liquidValue(value)}"`)
    .join(', ');

  return `{% render '${section.type}', ${settingPairs} %}`;
}

export function generateJsonTemplate(sections) {
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

export function copyText(value) {
  navigator.clipboard.writeText(value);
}

export function getContrastColor(hex) {
  if (!hex || hex.length < 7) return '#ffffff';
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const luminance = 0.299 * r + 0.589 * g + 0.114 * b;
  return luminance > 0.5 ? '#18181b' : '#ffffff';
}

export function downloadFile(filename, content, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
