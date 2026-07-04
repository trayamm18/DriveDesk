import React, { useEffect } from 'react';
import { View, Animated, ViewStyle } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  className = '',
  style,
}) => {
  const opacity = React.useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height: height as any,
          borderRadius,
          opacity,
          backgroundColor: '#E2E8F0', // slate-200
        },
        style,
      ]}
      className={className}
    />
  );
};

// Ready-made layouts for skeletons
export const SkeletonList: React.FC = () => {
  return (
    <View className="p-4 space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <View key={i} className="flex-row items-center bg-white border border-slate-100 p-4 rounded-xl">
          <Skeleton width={56} height={56} borderRadius={8} className="mr-4" />
          <View className="flex-1 space-y-2">
            <Skeleton width="40%" height={16} />
            <Skeleton width="60%" height={12} />
          </View>
          <Skeleton width={80} height={24} borderRadius={12} />
        </View>
      ))}
    </View>
  );
};

export const SkeletonGrid: React.FC = () => {
  return (
    <View className="p-4 flex-row flex-wrap justify-between">
      {[1, 2, 3, 4].map((i) => (
        <View key={i} className="w-[48%] bg-white border border-slate-100 p-4 rounded-xl mb-4 space-y-3">
          <Skeleton width="100%" height={100} borderRadius={8} />
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={12} />
          <Skeleton width="100%" height={32} borderRadius={8} />
        </View>
      ))}
    </View>
  );
};

export const SkeletonDashboard: React.FC = () => {
  return (
    <View className="p-5 space-y-6 bg-white flex-1">
      <View className="flex-row justify-between items-center">
        <View className="space-y-2">
          <Skeleton width={120} height={20} />
          <Skeleton width={180} height={32} />
        </View>
        <Skeleton width={40} height={40} borderRadius={20} />
      </View>

      <View className="space-y-3">
        <Skeleton width="100%" height={60} borderRadius={12} />
        <Skeleton width="100%" height={60} borderRadius={12} />
      </View>

      <Skeleton width={100} height={16} className="mt-4" />
      <View className="flex-row justify-between">
        <Skeleton width="48%" height={80} borderRadius={12} />
        <Skeleton width="48%" height={80} borderRadius={12} />
      </View>

      <Skeleton width={100} height={16} className="mt-4" />
      <View className="space-y-4">
        {[1, 2, 3].map((i) => (
          <View key={i} className="flex-row justify-between items-center py-2 border-b border-slate-50">
            <View className="flex-row items-center flex-1 space-x-3">
              <Skeleton width={32} height={32} borderRadius={16} />
              <View className="space-y-1 flex-1 ml-2">
                <Skeleton width="70%" height={14} />
                <Skeleton width="40%" height={10} />
              </View>
            </View>
            <Skeleton width={50} height={14} />
          </View>
        ))}
      </View>
    </View>
  );
};
