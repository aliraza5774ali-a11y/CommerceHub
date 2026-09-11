export const THEME_PRESETS = {
  classic: {
    label: 'Classic', description: 'A bold, image-led storefront with a floating navigation bar.',
    primaryColor: '#111827', secondaryColor: '#f5f5f4', accentColor: '#cfff04', backgroundColor: '#ffffff', textColor: '#111827', fontFamily: 'Inter', buttonStyle: 'rounded', borderRadius: '16px',
    previewImage: '/template-previews/classic-storefront.svg'
  },
  editorial: {
    label: 'Editorial', description: 'A refined magazine-style storefront with serif typography and warm surfaces.',
    primaryColor: '#1c1917', secondaryColor: '#f5f0e8', accentColor: '#7a2331', backgroundColor: '#fdfbf7', textColor: '#1c1917', fontFamily: 'Playfair Display', buttonStyle: 'square', borderRadius: '2px',
    previewImage: '/template-previews/editorial-storefront.svg'
  }
};

export const THEME_OPTIONS = Object.entries(THEME_PRESETS).map(([id, preset]) => ({ id, ...preset }));
export const DEFAULT_THEME_ID = 'classic';
export function resolveThemeId(themeId) { return THEME_PRESETS[themeId] ? themeId : DEFAULT_THEME_ID; }
