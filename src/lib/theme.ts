import { ThemeColors } from '../types';

export const defaultTheme: ThemeColors = {
  primary: 'purple',
  secondary: 'pink',
  accent: 'purple',
};

export const themeOptions = [
  {
    name: 'Purple & Pink',
    colors: {
      primary: 'purple',
      secondary: 'pink',
      accent: 'purple',
    },
  },
  {
    name: 'Blue & Teal',
    colors: {
      primary: 'blue',
      secondary: 'teal',
      accent: 'blue',
    },
  },
  {
    name: 'Rose & Orange',
    colors: {
      primary: 'rose',
      secondary: 'orange',
      accent: 'rose',
    },
  },
  {
    name: 'Emerald & Sky',
    colors: {
      primary: 'emerald',
      secondary: 'sky',
      accent: 'emerald',
    },
  },
];

export function getThemeClasses(colors: ThemeColors) {
  return {
    gradient: `from-${colors.primary}-100 to-${colors.secondary}-100`,
    primary: `${colors.primary}-600`,
    primaryHover: `${colors.primary}-700`,
    primaryLight: `${colors.primary}-300`,
    accent: `${colors.accent}-600`,
    accentHover: `${colors.accent}-700`,
    border: `${colors.primary}-600`,
  };
}