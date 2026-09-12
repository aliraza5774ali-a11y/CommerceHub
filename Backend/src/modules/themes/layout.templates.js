// Full storefront layout templates — different page structure, sections,
// and typography, not just colors. Deliberately a separate concept/module
// from theme.presets.js (color/font presets), which a tenant picks
// independently within whichever layout template is active.
export const LAYOUT_TEMPLATES = {
  classic: {
    label: 'Classic',
    description: 'Clean grid-based storefront — the original CommerceHub layout.',
    previewImage: 'https://placehold.co/480x600/ffffff/111827?text=Classic+Layout'
  },
  editorial: {
    label: 'Editorial',
    description: 'Warm, magazine-style storefront with a horizontal product gallery, testimonial carousel, and photo-collage story section.',
    previewImage: 'https://placehold.co/480x600/f7f6ef/1d3b2d?text=Editorial+Layout'
  },
  luxe: {
    label: 'Luxe',
    description: 'Quiet-luxury fashion storefront with a promo utility bar, circular category shortcuts, a bento-style new-arrivals grid, and a members newsletter panel.',
    previewImage: 'https://placehold.co/480x600/efe7db/141110?text=Luxe+Layout'
  }
};

export const LAYOUT_TEMPLATE_OPTIONS = Object.entries(LAYOUT_TEMPLATES).map(([id, tpl]) => ({ id, ...tpl }));

export function resolveLayoutTemplateId(id) {
  return LAYOUT_TEMPLATES[id] ? id : 'classic';
}
