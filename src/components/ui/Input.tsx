import React from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle = '',
  style,
  onBlur,
  onFocus,
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <View className={`w-full mb-4 ${containerStyle}`}>
      {label && (
        <Text className="text-slate-800 text-xs font-semibold uppercase tracking-wider mb-2">
          {label}
        </Text>
      )}
      
      <View
        className={`flex-row items-center bg-white border rounded-xl px-3.5 py-3 ${
          error
            ? 'border-red-500 bg-red-50/10'
            : isFocused
            ? 'border-slate-900 bg-white'
            : 'border-slate-200'
        }`}
      >
        {leftIcon && <View className="mr-2 text-slate-400">{leftIcon}</View>}
        
        <TextInput
          className="flex-1 text-slate-900 text-sm font-medium py-0"
          placeholderTextColor="#94A3B8"
          onFocus={(e) => {
            setIsFocused(true);
            if (onFocus) onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          style={style}
          {...props}
        />
        
        {rightIcon && <View className="ml-2 text-slate-400">{rightIcon}</View>}
      </View>

      {error && (
        <Text className="text-red-600 text-xs mt-1.5 font-medium ml-1">
          {error}
        </Text>
      )}
    </View>
  );
};
