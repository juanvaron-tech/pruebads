import React from 'react';
import { ThemeProvider } from 'react-jss';
import { theme } from '../src/styles/theme.js'; // Ajusta la ruta a donde guardaste tu theme.js

// Envolvemos todas las historias de Storybook con tu Tema global
export const decorators = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};