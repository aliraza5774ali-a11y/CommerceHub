// Full storefront layout templates — different page structure, sections,
// and typography, not just colors. Deliberately a separate concept/module
// from theme.presets.js (color/font presets), which a tenant picks
// independently within whichever layout template is active.
//
// previewImage now points at real static SVG mockups of each template's
// actual layout (served from /public/template-previews/), not a generic
// color-swatch placeholder. See README-template-previews.md for how to
// replace these with real screenshots later.
export const LAYOUT_TEMPLATES = {
  classic: {
    label: 'Classic',
    description: 'A bold, image-led storefront with a floating navigation bar.',
    previewImage: '/template-previews/classic-storefront.svg'
  },
  editorial: {
    label: 'Editorial',
    description: 'A refined magazine-style storefront with serif typography and warm surfaces.',
    previewImage: '/template-previews/editorial-storefront.svg'
  },
  luxe: {
    label: 'Luxe',
    description: 'A quiet-luxury fashion storefront with a promo utility bar and a bento-style new-arrivals grid.',
    previewImage: '/template-previews/luxe-storefront.svg'
  },
  vibrant: {
    label: 'Vibrant',
    description: 'A bold, high-energy storefront with a pill navbar, bento categories, and a giant wordmark feature banner.',
    previewImage: '/template-previews/vibrant-storefront.svg'
  },
  texart: {
    label: 'Texart',
    description: 'A playful lime-and-violet fashion storefront with a marquee strip, countdown banner, and step-by-step process section.',
    previewImage: '/template-previews/texart-storefront.svg'
  }
};

export const LAYOUT_TEMPLATE_OPTIONS = Object.entries(LAYOUT_TEMPLATES).map(([id, tpl]) => ({ id, ...tpl }));

export function resolveLayoutTemplateId(id) {
  return LAYOUT_TEMPLATES[id] ? id : 'classic';
}
