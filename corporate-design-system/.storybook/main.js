module.exports = {
  stories: [
    '../src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
  ],
  framework: '@storybook/react-webpack5',
  core: {
    builder: '@storybook/builder-webpack5',
  },
};
