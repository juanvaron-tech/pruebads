// theme.js
export const theme = {
  colors: {
    ink: {
      strong: '#000000',
      positive: '#34C85A',
      accent: '#34C85A',
      disabled: '#919AAA',
      recommendation: '#007AFF',
      inverse: '#FFFFFF',
      inverseOn: '#FFFFFF',
      strongOn: '#000000',
    },
    background: {
      accent: '#34C85A',
      inverseOn: '#000000',
      onTop: '#FFFFFF',
      recommendation: '#007AFF',
      positive: '#34C85A',
      inverse: '#000000',
      standard: '#FFFFFF',
    },
    surface: {
      overlayWeak: 'rgba(255, 255, 255, 0.8)',
      overlay: 'rgba(0, 0, 0, 0.8)',
    },
    line: {
      borderPositive: '#34C85A',
      borderNonOpaque: 'rgba(145, 154, 170, 0.2)', // #919AAA al 20%
      borderBlank: '#FFFFFF',
    },
    programs: {
      rappi: '#FF441F',
    },
    chart: {
      teal03: '#28B2AB',
      teal04: '#16625E',
      blue03: '#007AFF',
    }
  },
  typography: {
    fontFamily: '"PP Object Sans", sans-serif',
    h4Medium: {
      fontFamily: '"PP Object Sans", sans-serif',
      fontSize: '32px', // Ajustable según Figma
      fontWeight: 500,  // "Medium" en tus tokens
      lineHeight: '40px',
    },
    headlineMedium: {
      fontFamily: '"PP Object Sans", sans-serif',
      fontSize: '24px', 
      fontWeight: 500,
      lineHeight: '32px',
    },
    caption1Medium: {
      fontFamily: '"PP Object Sans", sans-serif',
      fontSize: '12px', 
      fontWeight: 500,
      lineHeight: '16px',
    },
    subheadline: {
      lineHeight: '24px', // Extraído de Desktop.tokens.json
    }
  },
  spacing: {
    small: '8px',
    medium: '16px',
    big: '24px',
  }
};


