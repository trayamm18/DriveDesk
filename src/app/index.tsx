import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useFleetStore } from '@/store/useFleetStore';

export default function SplashScreen() {
  const router = useRouter();
  const currentUser = useFleetStore((state) => state.currentUser);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentUser) {
        if (currentUser.role === 'Owner') {
          router.replace('/(owner)');
        } else {
          router.replace('/(agent)');
        }
      } else {
        router.replace('/login');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentUser]);

  return (
    <View className="flex-1 bg-white justify-center items-center px-6">
      <View className="items-center space-y-4">
        {/* Modern Minimalist Logo Icon */}
        <View className="w-16 h-16 bg-slate-900 rounded-2xl items-center justify-center shadow-sm mb-4">
          <Text className="text-white text-3xl font-bold tracking-tight">D</Text>
        </View>
        
        <Text className="text-slate-900 text-3xl font-extrabold tracking-tight">
          DriveDesk
        </Text>
        <Text className="text-slate-400 text-sm font-medium tracking-wide">
          Rental Business OS
        </Text>
      </View>
      
      <View className="absolute bottom-16 items-center">
        <ActivityIndicator size="small" color="#0F172A" />
        <Text className="text-slate-400 text-xs font-semibold tracking-widest uppercase mt-4">
          v1.0.0
        </Text>
      </View>
    </View>
  );
}
