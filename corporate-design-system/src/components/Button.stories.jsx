import React from 'react';
import Button from './Button';

export default {
  title: 'Design System/Button', // Así se verá en el menú lateral de Storybook
  component: Button,
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'big'],
    },
    disabled: { control: 'boolean' },
  },
};

// Historia base
const Template = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: 'Comprar en Rappi',
  size: 'medium',
  disabled: false,
};

export const Small = Template.bind({});
Small.args = {
  label: 'Ver más',
  size: 'small',
  disabled: false,
};