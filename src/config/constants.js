export const COMPONENT_LIBRARY = [
  {
    type: 'announcement-bar',
    label: 'Announcement Bar',
    category: 'Header',
    defaults: {
      text: 'Free shipping on all orders over $50',
      background: '#111827',
      color: '#ffffff',
    },
  },
  {
    type: 'header',
    label: 'Header',
    category: 'Header',
    defaults: {
      logoText: 'Your Store',
      logoUrl: '',
      menu: 'Home, Shop, About, Contact',
      sticky: true,
    },
  },
  {
    type: 'hero',
    label: 'Hero Banner',
    category: 'Content',
    defaults: {
      heading: 'Build your next Shopify section visually',
      subheading: 'Drag, edit, reorder, and export your page layout structure.',
      imageUrl: '',
      buttonText: 'Shop now',
      buttonLink: '/collections/all',
      align: 'left',
    },
  },
  {
    type: 'rich-text',
    label: 'Rich Text',
    category: 'Content',
    defaults: {
      heading: 'Tell your brand story',
      body: 'Use this area to explain your brand, campaign, or featured collection.',
    },
  },
  {
    type: 'image-with-text',
    label: 'Image With Text',
    category: 'Content',
    defaults: {
      heading: 'Crafted for modern commerce',
      body: 'Pair strong content with visual merchandising sections.',
      imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop',
    },
  },
  {
    type: 'featured-collection',
    label: 'Featured Collection',
    category: 'Commerce',
    defaults: {
      heading: 'Featured collection',
      collectionHandle: 'frontpage',
      productsToShow: 4,
    },
  },
  {
    type: 'product-grid',
    label: 'Product Grid',
    category: 'Commerce',
    defaults: {
      heading: 'Best sellers',
      columns: 4,
      productsToShow: 8,
    },
  },
  {
    type: 'testimonial',
    label: 'Testimonials',
    category: 'Social Proof',
    defaults: {
      heading: 'What customers say',
      testimonials: [
        { quote: 'Fast delivery, clean design, and smooth shopping experience.', author: 'A happy customer' },
        { quote: 'The product quality exceeded my expectations. Will definitely order again!', author: 'Sarah M.' },
        { quote: 'Best customer service I have ever experienced. Highly recommend.', author: 'John D.' },
      ],
    },
  },
  {
    type: 'newsletter',
    label: 'Newsletter',
    category: 'Marketing',
    defaults: {
      heading: 'Stay in the loop',
      body: 'Subscribe for offers, product drops, and store updates.',
      placeholder: 'Enter your email',
      buttonText: 'Subscribe',
    },
  },
  {
    type: 'footer',
    label: 'Footer',
    category: 'Footer',
    defaults: {
      copyright: '© 2026 Your Store',
      logoUrl: '',
      links: 'Privacy Policy, Terms of Service, Contact',
    },
  },
];

export const fieldConfigByType = {
  'announcement-bar': [
    { key: 'text', label: 'Text', type: 'textarea' },
    { key: 'background', label: 'Background', type: 'text' },
    { key: 'color', label: 'Text Color', type: 'text' },
  ],
  header: [
    { key: 'logoText', label: 'Logo Text (fallback)', type: 'text' },
    { key: 'logoUrl', label: 'Logo Image', type: 'image' },
    { key: 'menu', label: 'Menu Items (comma separated)', type: 'textarea' },
    { key: 'sticky', label: 'Sticky Header', type: 'boolean' },
  ],
  hero: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'subheading', label: 'Subheading', type: 'textarea' },
    { key: 'imageUrl', label: 'Banner Image', type: 'image' },
    { key: 'buttonText', label: 'Button Text', type: 'text' },
    { key: 'buttonLink', label: 'Button Link', type: 'text' },
    { key: 'align', label: 'Alignment', type: 'select', options: ['left', 'center', 'right'] },
  ],
  'rich-text': [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'body', label: 'Body', type: 'textarea' },
  ],
  'image-with-text': [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'body', label: 'Body', type: 'textarea' },
    { key: 'imageUrl', label: 'Image URL', type: 'text' },
  ],
  'featured-collection': [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'collectionHandle', label: 'Collection Handle', type: 'text' },
    { key: 'productsToShow', label: 'Products To Show', type: 'number' },
  ],
  'product-grid': [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'columns', label: 'Columns', type: 'number' },
    { key: 'productsToShow', label: 'Products To Show', type: 'number' },
  ],
  testimonial: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'testimonials', label: 'Testimonials', type: 'testimonials' },
  ],
  newsletter: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'body', label: 'Body', type: 'textarea' },
    { key: 'placeholder', label: 'Input Placeholder', type: 'text' },
    { key: 'buttonText', label: 'Button Text', type: 'text' },
  ],
  footer: [
    { key: 'copyright', label: 'Copyright', type: 'text' },
    { key: 'logoUrl', label: 'Logo Image', type: 'image' },
    { key: 'links', label: 'Footer Links (comma separated)', type: 'textarea' },
  ],
};

export const DEFAULT_THEME = { primary: '#E94D4D', secondary: '#FDF8EE' };

export const COLOR_PALETTES = [
  { name: 'Classic Red', primary: '#E94D4D', secondary: '#FDF8EE' },
  { name: 'Ocean Blue', primary: '#2563eb', secondary: '#eff6ff' },
  { name: 'Forest Green', primary: '#059669', secondary: '#ecfdf5' },
  { name: 'Sunset', primary: '#ea580c', secondary: '#fff7ed' },
  { name: 'Violet', primary: '#7c3aed', secondary: '#f5f3ff' },
  { name: 'Slate', primary: '#475569', secondary: '#f8fafc' },
  { name: 'Rose', primary: '#e11d48', secondary: '#fff1f2' },
  { name: 'Teal', primary: '#0d9488', secondary: '#f0fdfa' },
];

export const TEXT_ON_LIGHT = '#171717';
export const TEXT_MUTED = '#525252';
