import JSZip from 'jszip';

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
      { type: 'text', id: 'logoText', label: 'Logo Text', default: 'Your Store' },
      { type: 'textarea', id: 'menu', label: 'Menu Items (comma separated)', default: 'Home, Shop, About, Contact' },
      { type: 'checkbox', id: 'sticky', label: 'Sticky Header', default: true },
    ],
  },
  hero: {
    name: 'Hero Banner',
    settings: [
      { type: 'text', id: 'heading', label: 'Heading', default: 'Build your next Shopify section visually' },
      { type: 'textarea', id: 'subheading', label: 'Subheading', default: 'Drag, edit, reorder, and export your page layout structure.' },
      { type: 'text', id: 'buttonText', label: 'Button Text', default: 'Shop now' },
      { type: 'url', id: 'buttonLink', label: 'Button Link', default: '/collections/all' },
      { type: 'select', id: 'align', label: 'Alignment', default: 'left', options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ]},
    ],
  },
  'rich-text': {
    name: 'Rich Text',
    settings: [
      { type: 'text', id: 'heading', label: 'Heading', default: 'Tell your brand story' },
      { type: 'richtext', id: 'body', label: 'Body', default: 'Use this area to explain your brand, campaign, or featured collection.' },
    ],
  },
  'image-with-text': {
    name: 'Image With Text',
    settings: [
      { type: 'text', id: 'heading', label: 'Heading', default: 'Crafted for modern commerce' },
      { type: 'richtext', id: 'body', label: 'Body', default: 'Pair strong content with visual merchandising sections.' },
      { type: 'text', id: 'imageUrl', label: 'Image URL (or use Theme Editor to pick image)', default: '' },
    ],
  },
  'featured-collection': {
    name: 'Featured Collection',
    settings: [
      { type: 'text', id: 'heading', label: 'Heading', default: 'Featured collection' },
      { type: 'text', id: 'collectionHandle', label: 'Collection handle (e.g. frontpage)', default: 'frontpage' },
      { type: 'range', id: 'productsToShow', label: 'Products to show', min: 1, max: 8, default: 4 },
    ],
  },
  'product-grid': {
    name: 'Product Grid',
    settings: [
      { type: 'text', id: 'heading', label: 'Heading', default: 'Best sellers' },
      { type: 'range', id: 'columns', label: 'Columns', min: 2, max: 4, default: 4 },
      { type: 'range', id: 'productsToShow', label: 'Products to show', min: 2, max: 12, default: 8 },
    ],
  },
  testimonial: {
    name: 'Testimonials',
    settings: [
      { type: 'text', id: 'heading', label: 'Heading', default: 'What customers say' },
      { type: 'textarea', id: 'quote', label: 'Quote', default: 'Fast delivery, clean design, and smooth shopping experience.' },
      { type: 'text', id: 'author', label: 'Author', default: 'A happy customer' },
    ],
  },
  newsletter: {
    name: 'Newsletter',
    settings: [
      { type: 'text', id: 'heading', label: 'Heading', default: 'Stay in the loop' },
      { type: 'textarea', id: 'body', label: 'Body', default: 'Subscribe for offers, product drops, and store updates.' },
      { type: 'text', id: 'placeholder', label: 'Input Placeholder', default: 'Enter your email' },
      { type: 'text', id: 'buttonText', label: 'Button Text', default: 'Subscribe' },
    ],
  },
  footer: {
    name: 'Footer',
    settings: [
      { type: 'text', id: 'copyright', label: 'Copyright', default: '© 2026 Your Store' },
      { type: 'textarea', id: 'links', label: 'Footer Links (comma separated)', default: 'Privacy Policy, Terms of Service, Contact' },
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
  <div class="page-width">
    <p class="announcement-bar__text">{{ section.settings.text }}</p>
  </div>
</div>`,
    header: `<header class="section-header">
  <div class="page-width">
    <div class="header__inner">
      <a href="/" class="header__logo">{{ section.settings.logoText }}</a>
      <nav class="header__nav">
        {% assign menu_items = section.settings.menu | split: ',' %}
        {% for item in menu_items %}
          <a href="#" class="header__link">{{ item | strip }}</a>
        {% endfor %}
      </nav>
    </div>
  </div>
</header>`,
    hero: `<section class="hero hero--{{ section.settings.align }}">
  <div class="page-width">
    <h1 class="hero__heading">{{ section.settings.heading }}</h1>
    <p class="hero__subheading">{{ section.settings.subheading }}</p>
    <a href="{{ section.settings.buttonLink }}" class="hero__button button">{{ section.settings.buttonText }}</a>
  </div>
</section>`,
    'rich-text': `<section class="rich-text">
  <div class="page-width">
    <h2 class="rich-text__heading">{{ section.settings.heading }}</h2>
    <div class="rich-text__body">{{ section.settings.body }}</div>
  </div>
</section>`,
    'image-with-text': `<section class="image-with-text">
  <div class="page-width">
    <div class="image-with-text__grid">
      <div class="image-with-text__media">
        {% if section.settings.imageUrl != blank %}
          <img src="{{ section.settings.imageUrl }}" alt="{{ section.settings.heading }}" loading="lazy" width="1200" height="800">
        {% else %}
          {{ 'image' | placeholder_svg_tag: 'placeholder' }}
        {% endif %}
      </div>
      <div class="image-with-text__content">
        <h2 class="image-with-text__heading">{{ section.settings.heading }}</h2>
        <div class="image-with-text__body">{{ section.settings.body }}</div>
      </div>
    </div>
  </div>
</section>`,
    'featured-collection': `<section class="featured-collection">
  <div class="page-width">
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
    'product-grid': `<section class="product-grid-section">
  <div class="page-width">
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
    testimonial: `<section class="testimonial">
  <div class="page-width">
    <p class="testimonial__label">{{ section.settings.heading }}</p>
    <blockquote class="testimonial__quote">"{{ section.settings.quote }}"</blockquote>
    <p class="testimonial__author">— {{ section.settings.author }}</p>
  </div>
</section>`,
    newsletter: `<section class="newsletter">
  <div class="page-width">
    <h2 class="newsletter__heading">{{ section.settings.heading }}</h2>
    <p class="newsletter__body">{{ section.settings.body }}</p>
    {% form 'customer', class: 'newsletter__form' %}
      <input type="email" name="contact[email]" placeholder="{{ section.settings.placeholder }}" class="newsletter__input">
      <button type="submit" class="newsletter__button button">{{ section.settings.buttonText }}</button>
    {% endform %}
  </div>
</section>`,
    footer: `<footer class="section-footer">
  <div class="page-width">
    <div class="footer__inner">
      <p class="footer__copyright">{{ section.settings.copyright }}</p>
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
.announcement-bar { padding: 12px; text-align: center; font-size: 14px; }
.section-header .header__inner { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; }
.header__logo { font-size: 1.25rem; font-weight: 600; text-decoration: none; color: inherit; }
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
.testimonial { padding: 48px 0; }
.testimonial__label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; color: #6b7280; margin: 0; }
.testimonial__quote { font-size: 1.25rem; font-weight: 500; margin: 16px 0; line-height: 1.5; }
.testimonial__author { font-size: 14px; color: #6b7280; margin: 16px 0 0; }
.newsletter { padding: 48px 0; background: #111; color: #fff; }
.newsletter__heading { font-size: 1.5rem; font-weight: 600; margin: 0; }
.newsletter__body { margin-top: 12px; font-size: 14px; color: #d1d5db; }
.newsletter__form { display: flex; gap: 12px; margin-top: 20px; flex-wrap: wrap; }
.newsletter__input { flex: 1; min-width: 200px; padding: 12px 16px; border-radius: 8px; border: 1px solid #374151; background: #1f2937; color: #fff; }
.newsletter__button { padding: 12px 20px; background: #fff; color: #111; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; }
.section-footer { padding: 24px 0; border-top: 1px solid #e5e7eb; }
.footer__inner { display: flex; flex-direction: column; gap: 12px; }
@media (min-width: 768px) { .footer__inner { flex-direction: row; justify-content: space-between; align-items: center; } }
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

export async function exportThemeAsZip(sections) {
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
    const sectionId = `${section.type.replace(/[^a-z0-9]/gi, '_')}_${index + 1}`;
    templateData.sections[sectionId] = {
      type: section.type,
      settings: section.settings,
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
