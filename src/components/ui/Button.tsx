import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps, View } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'solid' | 'outline' | 'ghost' | 'muted' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'solid',
  size = 'md',
  loading = false,
  icon,
  style,
  disabled,
  ...props
}) => {
  // Styles base
  let containerClass = 'flex-row items-center justify-center rounded-xl border';
  let textClass = 'font-semibold tracking-wide';

  // Variant classes
  switch (variant) {
    case 'solid':
      containerClass += disabled
        ? ' bg-slate-100 border-slate-100'
        : ' bg-slate-900 border-slate-900 active:opacity-90';
      textClass += disabled ? ' text-slate-400' : ' text-white';
      break;
    case 'outline':
      containerClass += disabled
        ? ' bg-transparent border-slate-100'
        : ' bg-white border-slate-200 active:bg-slate-50';
      textClass += disabled ? ' text-slate-300' : ' text-slate-800';
      break;
    case 'muted':
      containerClass += disabled
        ? ' bg-slate-50 border-transparent'
        : ' bg-slate-100 border-transparent active:bg-slate-200';
      textClass += disabled ? ' text-slate-400' : ' text-slate-800';
      break;
    case 'ghost':
      containerClass += ' bg-transparent border-transparent active:bg-slate-50';
      textClass += disabled ? ' text-slate-300' : ' text-slate-800';
      break;
    case 'danger':
      containerClass += disabled
        ? ' bg-red-50 border-transparent'
        : ' bg-red-50 border-transparent active:bg-red-100';
      textClass += disabled ? ' text-red-300' : ' text-red-600';
      break;
  }

  // Size classes
  switch (size) {
    case 'sm':
      containerClass += ' px-3 py-2';
      textClass += ' text-xs';
      break;
    case 'md':
      containerClass += ' px-4 py-3';
      textClass += ' text-sm';
      break;
    case 'lg':
      containerClass += ' px-5 py-4';
      textClass += ' text-base';
      break;
  }

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      className={containerClass}
      style={style}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'solid' ? '#FFFFFF' : '#475569'}
          className="mr-2"
        />
      ) : icon ? (
        <View className="mr-2">{icon}</View>
      ) : null}
      <Text className={textClass}>{label}</Text>
    </TouchableOpacity>
  );
};
