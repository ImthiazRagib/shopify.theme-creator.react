import JSZip from 'jszip';

function getContrastColor(hex) {
  if (!hex || hex.length < 7) return '#ffffff';
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const luminance = 0.299 * r + 0.589 * g + 0.114 * b;
  return luminance > 0.5 ? '#171717' : '#ffffff';
}

const SECTION_SCHEMAS = {
  'announcement-bar': {
    name: 'Announcement Bar',
    settings: [
      { type: 'textarea', id: 'text', label: 'Text', default: 'Free shipping on all orders over $50' },
      { type: 'color', id: 'background', label: 'Background', default: '#111827' },
      { type: 'color', id: 'color', label: 'Text Color', default: '#ffffff' },
    ],
  },
  header: {
    name: 'Header',
    settings: [
      { type: 'text', id: 'logoText', label: 'Logo Text (fallback)', default: 'Your Store' },
      { type: 'text', id: 'logoUrl', label: 'Logo Image URL', default: '' },
      { type: 'textarea', id: 'menu', label: 'Menu Items (comma separated)', default: 'Home, Shop, About, Contact' },
      { type: 'checkbox', id: 'sticky', label: 'Sticky Header', default: true },
      { type: 'color', id: 'background', label: 'Background', default: '#ffffff' },
      { type: 'color', id: 'text_color', label: 'Text Color', default: '#171717' },
    ],
  },
  hero: {
    name: 'Hero Banner',
    settings: [
      { type: 'text', id: 'heading', label: 'Heading', default: 'Build your next Shopify section visually' },
      { type: 'textarea', id: 'subheading', label: 'Subheading', default: 'Drag, edit, reorder, and export your page layout structure.' },
      { type: 'text', id: 'imageUrl', label: 'Banner Image URL', default: '' },
      { type: 'text', id: 'buttonText', label: 'Button Text', default: 'Shop now' },
      { type: 'url', id: 'buttonLink', label: 'Button Link', default: '/collections/all' },
      { type: 'select', id: 'align', label: 'Alignment', default: 'left', options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ]},
      { type: 'color', id: 'background', label: 'Background', default: '#FDF8EE' },
      { type: 'color', id: 'text_color', label: 'Text Color', default: '#171717' },
    ],
  },
  'rich-text': {
    name: 'Rich Text',
    settings: [
      { type: 'text', id: 'heading', label: 'Heading', default: 'Tell your brand story' },
      { type: 'richtext', id: 'body', label: 'Body', default: 'Use this area to explain your brand, campaign, or featured collection.' },
      { type: 'color', id: 'background', label: 'Background', default: '#ffffff' },
      { type: 'color', id: 'text_color', label: 'Text Color', default: '#171717' },
    ],
  },
  'image-with-text': {
    name: 'Image With Text',
    settings: [
      { type: 'text', id: 'heading', label: 'Heading', default: 'Crafted for modern commerce' },
      { type: 'richtext', id: 'body', label: 'Body', default: 'Pair strong content with visual merchandising sections.' },
      { type: 'text', id: 'imageUrl', label: 'Image URL (or use Theme Editor to pick image)', default: '' },
      { type: 'color', id: 'background', label: 'Background', default: '#ffffff' },
      { type: 'color', id: 'text_color', label: 'Text Color', default: '#171717' },
    ],
  },
  'featured-collection': {
    name: 'Featured Collection',
    settings: [
      { type: 'text', id: 'heading', label: 'Heading', default: 'Featured collection' },
      { type: 'text', id: 'collectionHandle', label: 'Collection handle (e.g. frontpage)', default: 'frontpage' },
      { type: 'range', id: 'productsToShow', label: 'Products to show', min: 1, max: 8, default: 4 },
      { type: 'color', id: 'background', label: 'Background', default: '#ffffff' },
      { type: 'color', id: 'text_color', label: 'Text Color', default: '#171717' },
    ],
  },
  'product-grid': {
    name: 'Product Grid',
    settings: [
      { type: 'text', id: 'heading', label: 'Heading', default: 'Best sellers' },
      { type: 'range', id: 'columns', label: 'Columns', min: 2, max: 4, default: 4 },
      { type: 'range', id: 'productsToShow', label: 'Products to show', min: 2, max: 12, default: 8 },
      { type: 'color', id: 'background', label: 'Background', default: '#ffffff' },
      { type: 'color', id: 'text_color', label: 'Text Color', default: '#171717' },
    ],
  },
  testimonial: {
    name: 'Testimonials',
    settings: [
      { type: 'text', id: 'heading', label: 'Heading', default: 'What customers say' },
      { type: 'textarea', id: 'testimonials', label: 'Testimonials (JSON)', default: '[{"quote":"Fast delivery, clean design, and smooth shopping experience.","author":"A happy customer"}]' },
      { type: 'color', id: 'background', label: 'Background', default: '#ffffff' },
      { type: 'color', id: 'text_color', label: 'Text Color', default: '#171717' },
    ],
  },
  newsletter: {
    name: 'Newsletter',
    settings: [
      { type: 'text', id: 'heading', label: 'Heading', default: 'Stay in the loop' },
      { type: 'textarea', id: 'body', label: 'Body', default: 'Subscribe for offers, product drops, and store updates.' },
      { type: 'text', id: 'placeholder', label: 'Input Placeholder', default: 'Enter your email' },
      { type: 'text', id: 'buttonText', label: 'Button Text', default: 'Subscribe' },
      { type: 'color', id: 'background', label: 'Background', default: '#E94D4D' },
      { type: 'color', id: 'text_color', label: 'Text Color', default: '#ffffff' },
    ],
  },
  footer: {
    name: 'Footer',
    settings: [
      { type: 'text', id: 'copyright', label: 'Copyright', default: '© 2026 Your Store' },
      { type: 'text', id: 'logoUrl', label: 'Logo Image URL', default: '' },
      { type: 'textarea', id: 'links', label: 'Footer Links (comma separated)', default: 'Privacy Policy, Terms of Service, Contact' },
      { type: 'color', id: 'background', label: 'Background', default: '#ffffff' },
      { type: 'color', id: 'text_color', label: 'Text Color', default: '#525252' },
    ],
  },
};

function buildSectionSchema(sectionType) {
  const schema = SECTION_SCHEMAS[sectionType];
  if (!schema) return { name: sectionType, settings: [] };
  const settings = schema.settings.map((set) => {
    const base = { type: set.type, id: set.id, label: set.label };
    if (set.default !== undefined) base.default = set.default;
    if (set.options) base.options = set.options;
    if (set.min !== undefined) base.min = set.min;
    if (set.max !== undefined) base.max = set.max;
    return base;
  });
  return { name: schema.name, settings };
}

function generateSectionLiquid(type) {
  const schemaObj = buildSectionSchema(type);
  const schemaJson = JSON.stringify(schemaObj, null, 2);

  const templates = {
    'announcement-bar': `<div class="announcement-bar" style="background: {{ section.settings.background }}; color: {{ section.settings.color }};">
  <div class="page-width announcement-bar__inner">
    <p class="announcement-bar__text">{{ section.settings.text }}</p>
  </div>
</div>`,
    header: `<header class="section-header" {% if section.settings.background != blank %}style="background: {{ section.settings.background }};"{% endif %}>
  <div class="page-width">
    <div class="header__inner" {% if section.settings.text_color != blank %}style="color: {{ section.settings.text_color }};"{% endif %}>
      <a href="/" class="header__logo">
        {% if section.settings.logoUrl != blank %}
          <img src="{{ section.settings.logoUrl }}" alt="{{ section.settings.logoText | default: 'Logo' }}" class="header__logo-img" loading="eager" width="180" height="48">
        {% else %}
          {{ section.settings.logoText }}
        {% endif %}
      </a>
      <nav class="header__nav">
        {% assign menu_items = section.settings.menu | split: ',' %}
        {% for item in menu_items %}
          <a href="#" class="header__link">{{ item | strip }}</a>
        {% endfor %}
      </nav>
    </div>
  </div>
</header>`,
    hero: `<section class="hero hero--{{ section.settings.align }}" {% if section.settings.imageUrl != blank %}style="background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url({{ section.settings.imageUrl }}) center/cover;"{% elsif section.settings.background != blank %}style="background: {{ section.settings.background }};"{% endif %}>
  <div class="page-width">
    <h1 class="hero__heading" {% if section.settings.text_color != blank %}style="color: {{ section.settings.text_color }};"{% endif %}>{{ section.settings.heading }}</h1>
    <p class="hero__subheading" {% if section.settings.text_color != blank %}style="color: {{ section.settings.text_color }}; opacity: 0.8;"{% endif %}>{{ section.settings.subheading }}</p>
    <a href="{{ section.settings.buttonLink }}" class="hero__button button">{{ section.settings.buttonText }}</a>
  </div>
</section>`,
    'rich-text': `<section class="rich-text" {% if section.settings.background != blank %}style="background: {{ section.settings.background }};"{% endif %}>
  <div class="page-width">
    <h2 class="rich-text__heading" {% if section.settings.text_color != blank %}style="color: {{ section.settings.text_color }};"{% endif %}>{{ section.settings.heading }}</h2>
    <div class="rich-text__body" {% if section.settings.text_color != blank %}style="color: {{ section.settings.text_color }}; opacity: 0.9;"{% endif %}>{{ section.settings.body }}</div>
  </div>
</section>`,
    'image-with-text': `<section class="image-with-text" {% if section.settings.background != blank %}style="background: {{ section.settings.background }};"{% endif %}>
  <div class="page-width">
    <div class="image-with-text__grid">
      <div class="image-with-text__media">
        {% if section.settings.imageUrl != blank %}
          <img src="{{ section.settings.imageUrl }}" alt="{{ section.settings.heading }}" loading="lazy" width="1200" height="800">
        {% else %}
          {{ 'image' | placeholder_svg_tag: 'placeholder' }}
        {% endif %}
      </div>
      <div class="image-with-text__content" {% if section.settings.text_color != blank %}style="color: {{ section.settings.text_color }};"{% endif %}>
        <h2 class="image-with-text__heading">{{ section.settings.heading }}</h2>
        <div class="image-with-text__body" style="opacity: 0.9;">{{ section.settings.body }}</div>
      </div>
    </div>
  </div>
</section>`,
    'featured-collection': `<section class="featured-collection" {% if section.settings.background != blank %}style="background: {{ section.settings.background }};"{% endif %}>
  <div class="page-width" {% if section.settings.text_color != blank %}style="color: {{ section.settings.text_color }};"{% endif %}>
    <h2 class="section-heading">{{ section.settings.heading }}</h2>
    <div class="product-grid">
      {% assign col = collections[section.settings.collectionHandle] | default: collections.frontpage %}
      {% for product in col.products limit: section.settings.productsToShow %}
        {% render 'product-card', product: product %}
      {% endfor %}
      {% assign product_count = col.products.size | default: 0 %}
      {% if product_count < section.settings.productsToShow %}
        {% assign placeholders = section.settings.productsToShow | minus: product_count %}
        {% for i in (1..placeholders) %}
          {% render 'product-card-placeholder' %}
        {% endfor %}
      {% endif %}
    </div>
  </div>
</section>`,
    'product-grid': `<section class="product-grid-section" {% if section.settings.background != blank %}style="background: {{ section.settings.background }};"{% endif %}>
  <div class="page-width" {% if section.settings.text_color != blank %}style="color: {{ section.settings.text_color }};"{% endif %}>
    <h2 class="section-heading">{{ section.settings.heading }}</h2>
    <div class="product-grid product-grid--{{ section.settings.columns }}-col">
      {% assign col = collections.all | default: collections.frontpage %}
      {% for product in col.products limit: section.settings.productsToShow %}
        {% render 'product-card', product: product %}
      {% endfor %}
      {% assign product_count = col.products.size | default: 0 %}
      {% if product_count < section.settings.productsToShow %}
        {% assign placeholders = section.settings.productsToShow | minus: product_count %}
        {% for i in (1..placeholders) %}
          {% render 'product-card-placeholder' %}
        {% endfor %}
      {% endif %}
    </div>
  </div>
</section>`,
    testimonial: `<section class="testimonial testimonial-slider" {% if section.settings.background != blank %}style="background: {{ section.settings.background }};"{% endif %} id="testimonial-{{ section.id | replace: '-', '_' }}">
  <div class="page-width testimonial-slider__inner" {% if section.settings.text_color != blank %}style="color: {{ section.settings.text_color }};"{% endif %}>
    <p class="testimonial__label">{{ section.settings.heading }}</p>
    <div class="testimonial-slider__content">
      <blockquote class="testimonial__quote testimonial-slider__quote"></blockquote>
      <p class="testimonial__author testimonial-slider__author" style="opacity: 0.9;"></p>
    </div>
    <div class="testimonial-slider__nav" style="display: none;">
      <button type="button" class="testimonial-slider__prev" aria-label="Previous">‹</button>
      <button type="button" class="testimonial-slider__next" aria-label="Next">›</button>
    </div>
    <div class="testimonial-slider__dots"></div>
  </div>
  <script type="application/json" id="testimonial-data-{{ section.id | replace: '-', '_' }}">{{ section.settings.testimonials | default: '[]' | json }}</script>
  <script>
    (function() {
      var scriptEl = document.getElementById('testimonial-data-{{ section.id | replace: "-", "_" }}');
      var sectionEl = scriptEl ? scriptEl.closest('section') : null;
      if (!scriptEl || !sectionEl) return;
      var testimonials;
      try {
        var raw = JSON.parse(scriptEl.textContent);
        testimonials = typeof raw === 'string' ? JSON.parse(raw) : (Array.isArray(raw) ? raw : []);
      } catch(e) { testimonials = []; }
      if (!Array.isArray(testimonials) || testimonials.length === 0) {
        var q = sectionEl.querySelector('.testimonial-slider__quote');
        var a = sectionEl.querySelector('.testimonial-slider__author');
        if (q) q.textContent = '"Add testimonials in the theme editor."';
        if (a) a.textContent = '—';
        return;
      }
      var inner = sectionEl.querySelector('.testimonial-slider__inner');
      var quoteEl = inner.querySelector('.testimonial-slider__quote');
      var authorEl = inner.querySelector('.testimonial-slider__author');
      var prevBtn = inner.querySelector('.testimonial-slider__prev');
      var nextBtn = inner.querySelector('.testimonial-slider__next');
      var dotsEl = inner.querySelector('.testimonial-slider__dots');
      var idx = 0;
      function render() {
        var t = testimonials[idx] || {};
        quoteEl.textContent = '"' + (t.quote || '') + '"';
        authorEl.textContent = '\u2014 ' + (t.author || '');
      }
      function updateDots() {
        dotsEl.querySelectorAll('.testimonial-slider__dot').forEach(function(btn, i) { btn.classList.toggle('active', i === idx); });
      }
      if (testimonials.length > 1) {
        inner.querySelector('.testimonial-slider__nav').style.display = 'flex';
        prevBtn.onclick = function() { idx = (idx - 1 + testimonials.length) % testimonials.length; render(); updateDots(); };
        nextBtn.onclick = function() { idx = (idx + 1) % testimonials.length; render(); updateDots(); };
        dotsEl.innerHTML = testimonials.map(function(_, i) {
          return '<button type="button" class="testimonial-slider__dot' + (i === 0 ? ' active' : '') + '" aria-label="Slide ' + (i+1) + '"></button>';
        }).join('');
        dotsEl.querySelectorAll('.testimonial-slider__dot').forEach(function(btn, i) {
          btn.onclick = function() { idx = i; render(); updateDots(); };
        });
      }
      render();
      updateDots();
    })();
  </script>
</section>`,
    newsletter: `<section class="newsletter" {% if section.settings.background != blank %}style="background: {{ section.settings.background }};"{% endif %}>
  <div class="page-width" {% if section.settings.text_color != blank %}style="color: {{ section.settings.text_color }};"{% endif %}>
    <h2 class="newsletter__heading">{{ section.settings.heading }}</h2>
    <p class="newsletter__body" style="opacity: 0.9;">{{ section.settings.body }}</p>
    {% form 'customer', class: 'newsletter__form' %}
      <input type="email" name="contact[email]" placeholder="{{ section.settings.placeholder }}" class="newsletter__input">
      <button type="submit" class="newsletter__button button">{{ section.settings.buttonText }}</button>
    {% endform %}
  </div>
</section>`,
    footer: `<footer class="section-footer" {% if section.settings.background != blank %}style="background: {{ section.settings.background }};"{% endif %}>
  <div class="page-width">
    <div class="footer__inner" {% if section.settings.text_color != blank %}style="color: {{ section.settings.text_color }};"{% endif %}>
      <div class="footer__brand">
        {% if section.settings.logoUrl != blank %}
          <a href="/" class="footer__logo-link">
            <img src="{{ section.settings.logoUrl }}" alt="Logo" class="footer__logo-img" loading="lazy" width="120" height="40">
          </a>
        {% endif %}
        <p class="footer__copyright">{{ section.settings.copyright }}</p>
      </div>
      <div class="footer__links">
        {% assign link_items = section.settings.links | split: ',' %}
        {% for item in link_items %}
          <a href="#" class="footer__link">{{ item | strip }}</a>
        {% endfor %}
      </div>
    </div>
  </div>
</footer>`,
  };

  const content = templates[type] || `<section class="section-${type}"><div class="page-width">Section: ${type}</div></section>`;
  return `${content}

{% schema %}
${schemaJson}
{% endschema %}`;
}

const LAYOUT_THEME = `<!DOCTYPE html>
<html lang="{{ request.locale.iso_code }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ page_title }}{% if current_tags %} &ndash; {{ 'general.meta.tags' | t }}{% endif %}{% if current_page != 1 %} &ndash; {{ 'general.meta.page' | t }} {{ current_page }}{% endif %}</title>
  {{ content_for_header }}
  {{ 'base.css' | asset_url | stylesheet_tag }}
</head>
<body class="template-{{ template.name }}">
  {{ content_for_layout }}
  {{ content_for_footer }}
</body>
</html>`;

const ASSETS_BASE_CSS = `/* Theme Creator - Base Styles */
.page-width { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.announcement-bar { padding: 12px; font-size: 14px; }
.announcement-bar__inner { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; }
.section-header .header__inner { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; }
.header__logo { font-size: 1.25rem; font-weight: 600; text-decoration: none; color: inherit; display: flex; align-items: center; }
.header__logo-img { height: 40px; width: auto; max-width: 140px; object-fit: contain; object-position: left center; display: block; }
@media (min-width: 768px) { .header__logo-img { height: 48px; max-width: 180px; } }
.header__nav { display: flex; gap: 24px; flex-wrap: wrap; }
.header__link { font-size: 14px; color: #6b7280; text-decoration: none; }
.hero { min-height: 300px; padding: 48px 0; display: flex; align-items: center; }
.hero--center { text-align: center; }
.hero--right { text-align: right; align-items: flex-end; }
.hero__heading { font-size: 2rem; font-weight: 700; margin: 0; }
.hero__subheading { margin: 12px 0 0; font-size: 14px; color: #6b7280; }
.hero__button { display: inline-block; margin-top: 24px; padding: 12px 20px; background: #111; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 500; }
.rich-text { padding: 48px 0; }
.rich-text__heading { font-size: 1.5rem; font-weight: 600; margin: 0; }
.rich-text__body { margin-top: 12px; font-size: 14px; line-height: 1.6; color: #6b7280; }
.image-with-text__grid { display: grid; gap: 24px; }
@media (min-width: 768px) { .image-with-text__grid { grid-template-columns: 1fr 1fr; } }
.image-with-text__media img { width: 100%; height: 256px; object-fit: cover; border-radius: 8px; }
.image-with-text__heading { font-size: 1.5rem; font-weight: 600; margin: 0; }
.image-with-text__body { margin-top: 12px; font-size: 14px; line-height: 1.6; }
.section-heading { font-size: 1.25rem; font-weight: 600; margin: 0 0 20px; }
.product-grid { display: grid; gap: 16px; grid-template-columns: repeat(2, 1fr); }
@media (min-width: 1024px) { .product-grid { grid-template-columns: repeat(4, 1fr); } }
.testimonial { padding: 24px 0; position: relative; }
.testimonial__label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #6b7280; margin: 0; }
.testimonial__quote { font-size: 1rem; font-weight: 500; margin: 12px 0; line-height: 1.5; min-height: 2.5rem; }
.testimonial__author { font-size: 12px; color: #6b7280; margin: 12px 0 0; }
.testimonial-slider__inner { position: relative; padding: 0 36px; }
.testimonial-slider__nav { display: flex; gap: 4px; position: absolute; top: 50%; left: 0; right: 0; transform: translateY(-50%); justify-content: space-between; pointer-events: none; padding: 0 8px; }
.testimonial-slider__nav button { pointer-events: auto; padding: 6px 8px; border: 1px solid #e5e7eb; background: #fff; cursor: pointer; font-size: 1rem; line-height: 1; transition: background 0.2s; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
.testimonial-slider__nav button:hover { background: #f9fafb; }
.testimonial-slider__dots { display: flex; justify-content: center; gap: 6px; margin-top: 16px; }
.testimonial-slider__dot { width: 6px; height: 6px; border: none; border-radius: 50%; background: #d1d5db; cursor: pointer; padding: 0; transition: background 0.2s; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
.testimonial-slider__dot:hover { background: #9ca3af; }
.testimonial-slider__dot.active { background: #111827; }
@media (min-width: 640px) {
  .testimonial { padding: 36px 0; }
  .testimonial__label { font-size: 11px; }
  .testimonial__quote { font-size: 1.125rem; margin: 14px 0; min-height: 2.75rem; }
  .testimonial__author { font-size: 13px; margin: 14px 0 0; }
  .testimonial-slider__inner { padding: 0 44px; }
  .testimonial-slider__nav { padding: 0 12px; gap: 8px; }
  .testimonial-slider__nav button { padding: 8px 10px; font-size: 1.125rem; }
  .testimonial-slider__dots { margin-top: 20px; gap: 8px; }
  .testimonial-slider__dot { width: 7px; height: 7px; }
}
@media (min-width: 768px) {
  .testimonial { padding: 48px 0; }
  .testimonial__label { font-size: 12px; }
  .testimonial__quote { font-size: 1.25rem; margin: 16px 0; min-height: 3rem; }
  .testimonial__author { font-size: 14px; margin: 16px 0 0; }
  .testimonial-slider__inner { padding: 0 52px; }
  .testimonial-slider__nav { padding: 0 20px; }
  .testimonial-slider__nav button { padding: 8px 12px; font-size: 1.25rem; }
  .testimonial-slider__dots { margin-top: 24px; }
  .testimonial-slider__dot { width: 8px; height: 8px; }
}
.newsletter { padding: 48px 0; background: #111; color: #fff; }
.newsletter__heading { font-size: 1.5rem; font-weight: 600; margin: 0; }
.newsletter__body { margin-top: 12px; font-size: 14px; color: #d1d5db; }
.newsletter__form { display: flex; gap: 12px; margin-top: 20px; flex-wrap: wrap; }
.newsletter__input { flex: 1; min-width: 200px; padding: 12px 16px; border-radius: 8px; border: 1px solid #374151; background: #1f2937; color: #fff; }
.newsletter__button { padding: 12px 20px; background: #fff; color: #111; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; }
.section-footer { padding: 24px 0; border-top: 1px solid #e5e7eb; }
.footer__inner { display: flex; flex-direction: column; gap: 12px; }
@media (min-width: 768px) { .footer__inner { flex-direction: row; justify-content: space-between; align-items: center; } }
.footer__brand { display: flex; flex-direction: column; gap: 8px; }
.footer__logo-link { display: inline-block; }
.footer__logo-img { height: 32px; width: auto; max-width: 100px; object-fit: contain; object-position: left center; display: block; }
@media (min-width: 768px) { .footer__logo-img { height: 40px; max-width: 120px; } }
.footer__copyright { font-size: 14px; color: #6b7280; margin: 0; }
.footer__links { display: flex; gap: 16px; flex-wrap: wrap; font-size: 14px; }
.footer__link { color: #6b7280; text-decoration: none; }
`;

const SNIPPET_PRODUCT_CARD = `{% comment %} Basic product card - customize as needed {% endcomment %}
<div class="product-card">
  <a href="{{ product.url }}">
    {% if product.featured_image %}
      <img src="{{ product.featured_image | image_url: width: 400 }}" alt="{{ product.title }}" loading="lazy" width="400" height="400">
    {% else %}
      {{ 'product-1' | placeholder_svg_tag: 'placeholder' }}
    {% endif %}
    <h3 class="product-card__title">{{ product.title }}</h3>
    <p class="product-card__price">{{ product.price | money }}</p>
  </a>
</div>`;

const SNIPPET_PRODUCT_CARD_PLACEHOLDER = `<div class="product-card product-card--placeholder">
  <div class="product-card__image-placeholder" style="background: #f3f4f6; aspect-ratio: 1; border-radius: 8px;"></div>
  <div class="product-card__title-placeholder" style="height: 16px; background: #e5e7eb; border-radius: 4px; margin-top: 12px; width: 66%;"></div>
  <div class="product-card__price-placeholder" style="height: 14px; background: #f3f4f6; border-radius: 4px; margin-top: 8px; width: 33%;"></div>
</div>`;

const SECTION_TYPES = ['announcement-bar', 'header', 'hero', 'rich-text', 'image-with-text', 'featured-collection', 'product-grid', 'testimonial', 'newsletter', 'footer'];

const TEXT_ON_LIGHT = '#171717';
const TEXT_MUTED = '#525252';

function getEffectiveColors(section, themeColors = {}) {
  const primary = themeColors.primary || '#E94D4D';
  const secondary = themeColors.secondary || '#FDF8EE';
  const textOnPrimary = getContrastColor(primary);
  const overrides = section.styleOverrides || {};
  const bg = overrides.background?.trim() || undefined;
  const textColor = overrides.textColor?.trim() || undefined;

  const resolveBg = (themeBg) => bg ?? themeBg;
  const resolveText = (themeText) => textColor ?? themeText;

  let background;
  let text;

  switch (section.type) {
    case 'announcement-bar':
    case 'newsletter':
      background = resolveBg(primary);
      text = resolveText(textOnPrimary);
      break;
    case 'hero': {
      const hasHeroImage = section.settings?.imageUrl && String(section.settings.imageUrl).trim().length > 0;
      const defaultText = hasHeroImage ? '#ffffff' : TEXT_ON_LIGHT;
      background = resolveBg(secondary);
      text = resolveText(defaultText);
      break;
    }
    case 'header':
    case 'rich-text':
    case 'image-with-text':
    case 'featured-collection':
    case 'product-grid':
    case 'testimonial':
      background = resolveBg('#ffffff');
      text = resolveText(section.type === 'footer' ? TEXT_MUTED : TEXT_ON_LIGHT);
      break;
    case 'footer':
      background = resolveBg('#ffffff');
      text = resolveText(TEXT_MUTED);
      break;
    default:
      background = resolveBg('#ffffff');
      text = resolveText(TEXT_ON_LIGHT);
  }

  return { background, text };
}

export async function exportThemeAsZip(sections, themeColors = {}) {
  const zip = new JSZip();

  zip.file('layout/theme.liquid', LAYOUT_THEME);
  zip.file('config/settings_schema.json', JSON.stringify([
    { name: 'theme_info', theme_name: 'Theme Creator', theme_author: 'Theme Creator', theme_version: '1.0.0' },
  ], null, 2));
  zip.file('config/settings_data.json', JSON.stringify({ current: {} }, null, 2));
  zip.file('locales/en.default.json', JSON.stringify({ general: { meta: { tags: 'Tagged', page: 'Page' } } }, null, 2));
  zip.file('assets/base.css.liquid', ASSETS_BASE_CSS);
  zip.file('snippets/product-card.liquid', SNIPPET_PRODUCT_CARD);
  zip.file('snippets/product-card-placeholder.liquid', SNIPPET_PRODUCT_CARD_PLACEHOLDER);

  SECTION_TYPES.forEach((type) => {
    zip.file(`sections/${type}.liquid`, generateSectionLiquid(type));
  });

  const templateData = {
    sections: {},
    order: [],
  };

  sections.forEach((section, index) => {
    const { background, text } = getEffectiveColors(section, themeColors);
    const sectionId = `${section.type.replace(/[^a-z0-9]/gi, '_')}_${index + 1}`;
    const settings = { ...section.settings, background, text_color: text };
    if (section.type === 'announcement-bar') {
      settings.color = text;
      delete settings.text_color;
    }
    if (section.type === 'testimonial') {
      let testimonials = settings.testimonials;
      if (!Array.isArray(testimonials) && (settings.quote || settings.author)) {
        testimonials = [{ quote: settings.quote || '', author: settings.author || '' }];
        delete settings.quote;
        delete settings.author;
      }
      settings.testimonials = Array.isArray(testimonials) ? JSON.stringify(testimonials) : (typeof testimonials === 'string' ? testimonials : '[]');
    }
    templateData.sections[sectionId] = {
      type: section.type,
      settings,
    };
    templateData.order.push(sectionId);
  });

  zip.file('templates/index.json', JSON.stringify(templateData, null, 2));

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'shopify-theme.zip';
  link.click();
  URL.revokeObjectURL(url);
}
