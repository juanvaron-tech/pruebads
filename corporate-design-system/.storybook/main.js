module.exports = {
  stories: [
    '../src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
  ],
  framework: {
    name: '@storybook/react',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};
