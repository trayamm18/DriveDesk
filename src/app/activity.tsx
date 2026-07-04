import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFleetStore } from '@/store/useFleetStore';
import { SkeletonList } from '@/components/ui/Skeleton';
import { Feather } from '@expo/vector-icons';

export default function ActivityLog() {
  const router = useRouter();
  const { activities } = useFleetStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      {/* Custom Header */}
      <View className="flex-row justify-between items-center px-6 py-4 border-b border-slate-50 bg-white">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="w-10 h-10 border border-slate-100 rounded-xl items-center justify-center">
          <Feather name="arrow-left" size={16} color="#0F172A" />
        </TouchableOpacity>
        <Text className="text-slate-900 font-extrabold text-sm tracking-tight">Activity Audit Log</Text>
        <View className="w-10 h-10" />
      </View>

      {loading ? (
        <SkeletonList />
      ) : (
        <ScrollView className="flex-grow px-6 pt-6 bg-slate-50/20" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          
          <View className="border-l border-slate-200 ml-2.5 pl-4 space-y-6">
            {activities.map((activity) => {
              // Icon based on type
              let iconName: React.ComponentProps<typeof Feather>['name'] = 'activity';
              let iconColor = '#64748B'; // Slate


              if (activity.type === 'booking_created') {
                iconName = 'calendar';
                iconColor = '#3B82F6'; // Blue
              } else if (activity.type === 'payment_received') {
                iconName = 'dollar-sign';
                iconColor = '#10B981'; // Green
              } else if (activity.type === 'vehicle_returned') {
                iconName = 'check-circle';
                iconColor = '#10B981'; // Green
              } else if (activity.type === 'maintenance_due' || activity.type === 'maintenance') {
                iconName = 'tool';
                iconColor = '#EF4444'; // Red
              } else if (activity.type === 'transfer') {
                iconName = 'navigation';
                iconColor = '#F59E0B'; // Amber
              }

              return (
                <View key={activity.id} className="relative">
                  {/* Timeline circle node */}
                  <View 
                    style={{ backgroundColor: iconColor }}
                    className="absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 border-white items-center justify-center"
                  />
                  
                  <View className="bg-white border border-slate-100 rounded-2xl p-4 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.04)]">
                    <View className="flex-row justify-between items-start mb-1.5">
                      <View className="flex-row items-center">
                        <Feather name={iconName} size={11} color={iconColor} className="mr-1.5" />
                        <Text className="text-slate-900 font-extrabold text-xs leading-none uppercase tracking-wide">
                          {activity.type.replace('_', ' ')}
                        </Text>
                      </View>
                      
                      <Text className="text-slate-400 text-[9px] font-bold">
                        {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>

                    <Text className="text-slate-700 text-xs font-semibold leading-relaxed">
                      {activity.message}
                    </Text>

                    <View className="flex-row justify-between items-center mt-3 pt-2.5 border-t border-slate-50">
                      <Text className="text-slate-400 text-[9px] font-bold">
                        Agent: {activity.user}
                      </Text>
                      <Text className="text-slate-400 text-[9px] font-bold">
                        {new Date(activity.timestamp).toLocaleDateString([], { dateStyle: 'medium' })}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
