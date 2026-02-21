import React from 'react';

export const Button = ({ 
  label = 'Button', 
  variant = 'primary',
  size = 'medium',
  onClick = () => {},
  disabled = false
}) => {
  const baseStyles = {
    padding: size === 'large' ? '12px 24px' : size === 'medium' ? '8px 16px' : '4px 8px',
    fontSize: size === 'large' ? '16px' : size === 'medium' ? '14px' : '12px',
    border: 'none',
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  };

  const variantStyles = {
    primary: {
      backgroundColor: '#007bff',
      color: '#fff',
    },
    secondary: {
      backgroundColor: '#6c757d',
      color: '#fff',
    },
    danger: {
      backgroundColor: '#dc3545',
      color: '#fff',
    },
  };

  const style = {
    ...baseStyles,
    ...variantStyles[variant],
  };

  return (
    <button 
      style={style}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
