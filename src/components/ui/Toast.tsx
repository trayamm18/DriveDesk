import React, { useEffect } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { useFleetStore } from '@/store/useFleetStore';
import { Feather } from '@expo/vector-icons';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useFleetStore();
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (toast.visible) {
      Animated.timing(slideAnim, {
        toValue: 50, // Top margin
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [toast.visible]);

  if (!toast.visible) return null;

  let bgClass = 'bg-slate-900 border-slate-800';
  let textClass = 'text-white';
  let iconName: React.ComponentProps<typeof Feather>['name'] = 'check-circle';
  let iconColor = '#10B981'; // Green


  if (toast.type === 'error') {
    iconName = 'alert-circle';
    iconColor = '#EF4444'; // Red
  } else if (toast.type === 'info') {
    iconName = 'info';
    iconColor = '#3B82F6'; // Blue
  }

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        position: 'absolute',
        top: 0,
        left: 20,
        right: 20,
        zIndex: 9999,
        elevation: 99,
      }}
    >
      <View className={`flex-row items-center justify-between p-4 rounded-xl border shadow-sm ${bgClass}`}>
        <View className="flex-row items-center flex-1 mr-2">
          <Feather name={iconName} size={16} color={iconColor} className="mr-3" />
          <Text className={`text-sm font-semibold tracking-wide ${textClass}`}>
            {toast.message}
          </Text>
        </View>
        <TouchableOpacity onPress={hideToast} activeOpacity={0.7}>
          <Feather name="x" size={14} color="#94A3B8" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};
