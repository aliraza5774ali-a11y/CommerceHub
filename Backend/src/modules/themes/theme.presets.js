export const THEME_PRESETS = {
  classic: {
    label: 'Classic',
    primaryColor: '#111827',
    secondaryColor: '#f5f5f4',
    accentColor: '#cfff04',
    backgroundColor: '#ffffff',
    textColor: '#111827',
    fontFamily: 'Inter',
    buttonStyle: 'rounded',
    borderRadius: '16px'
  },
  boutique: {
    label: 'Boutique',
    primaryColor: '#3f2d23',
    secondaryColor: '#f7efe6',
    accentColor: '#d98c4a',
    backgroundColor: '#fffaf4',
    textColor: '#2a1d16',
    fontFamily: 'Playfair Display',
    buttonStyle: 'pill',
    borderRadius: '999px'
  },
  bold: {
    label: 'Bold',
    primaryColor: '#0a0a0a',
    secondaryColor: '#1a1a1a',
    accentColor: '#ff3d3d',
    backgroundColor: '#0a0a0a',
    textColor: '#ffffff',
    fontFamily: 'Space Grotesk',
    buttonStyle: 'square',
    borderRadius: '4px'
  },
  minimal: {
    label: 'Minimal',
    primaryColor: '#171717',
    secondaryColor: '#fafafa',
    accentColor: '#2563eb',
    backgroundColor: '#ffffff',
    textColor: '#171717',
    fontFamily: 'Inter',
    buttonStyle: 'rounded',
    borderRadius: '10px'
  }
};

export const THEME_OPTIONS = Object.entries(THEME_PRESETS).map(([id, preset]) => ({
  id,
  label: preset.label,
  accentColor: preset.accentColor,
  backgroundColor: preset.backgroundColor
}));

export const DEFAULT_THEME_ID = 'classic';

export function resolveThemeId(themeId) {
  return THEME_PRESETS[themeId] ? themeId : DEFAULT_THEME_ID;
}
