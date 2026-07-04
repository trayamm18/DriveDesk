import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFleetStore } from '@/store/useFleetStore';
import { Feather } from '@expo/vector-icons';

export default function OwnerAdmin() {
  const router = useRouter();
  const { logout, showToast } = useFleetStore();

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully.', 'info');
    router.replace('/login');
  };

  const MenuItem = ({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center justify-between py-3.5 bg-white border-b border-slate-100 last:border-0"
    >
      <View className="flex-row items-center">
        <View className="w-8 h-8 rounded-lg bg-slate-50 items-center justify-center mr-3">
          <Feather name={icon as any} size={14} color="#0F172A" />
        </View>
        <Text className="text-slate-800 text-sm font-semibold tracking-wide">
          {label}
        </Text>
      </View>
      <Feather name="chevron-right" size={14} color="#CBD5E1" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-slate-50/50">
      {/* Header */}
      <View className="px-6 pt-4 pb-4 border-b border-slate-50 bg-white">
        <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          Management
        </Text>
        <Text className="text-slate-900 text-3xl font-extrabold tracking-tight mt-0.5">
          Admin Config
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        
        {/* GROUP 1: COMPANY */}
        <View className="mt-6 px-6 bg-white border-y border-slate-100">
          <MenuItem 
            icon="home" 
            label="Company Settings" 
            onPress={() => showToast('Company Settings configuration.', 'info')} 
          />
        </View>

        {/* GROUP 2: INVENTORY & STAFF */}
        <Text className="px-6 mt-6 mb-2 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
          Staff & Inventory
        </Text>
        <View className="px-6 bg-white border-y border-slate-100">
          <MenuItem 
            icon="users" 
            label="Employees & Roles" 
            onPress={() => showToast('Manage staff, agents, and access logs.', 'info')} 
          />
          <MenuItem 
            icon="map-pin" 
            label="Branches & Stations" 
            onPress={() => showToast('Manage office branches & inventory locations.', 'info')} 
          />
          <MenuItem 
            icon="truck" 
            label="Vehicle Master Config" 
            onPress={() => showToast('Setup vehicle brands, groups, and fuel types.', 'info')} 
          />
        </View>

        {/* GROUP 3: TEMPLATES & NOTIFICATIONS */}
        <Text className="px-6 mt-6 mb-2 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
          Templates & Alerts
        </Text>
        <View className="px-6 bg-white border-y border-slate-100">
          <MenuItem 
            icon="file-text" 
            label="Rental Agreement Template" 
            onPress={() => showToast('Edit terms, liability, and fuel policy terms.', 'info')} 
          />
          <MenuItem 
            icon="bell" 
            label="Notification Triggers" 
            onPress={() => showToast('Setup SMS, WhatsApp & Push alert timings.', 'info')} 
          />
          <MenuItem 
            icon="tool" 
            label="Maintenance Intervals" 
            onPress={() => showToast('Configure oil, battery, and tyre check schedules.', 'info')} 
          />
        </View>

        {/* GROUP 4: ACCOUNT */}
        <Text className="px-6 mt-6 mb-2 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
          User Settings
        </Text>
        <View className="px-6 bg-white border-y border-slate-100">
          <MenuItem 
            icon="user" 
            label="My Profile" 
            onPress={() => showToast('Update your personal details.', 'info')} 
          />
          
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.7}
            className="flex-row items-center justify-between py-3.5"
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-lg bg-red-50 items-center justify-center mr-3">
                <Feather name="log-out" size={14} color="#EF4444" />
              </View>
              <Text className="text-red-600 text-sm font-bold tracking-wide">
                Logout
              </Text>
            </View>
            <Feather name="chevron-right" size={14} color="#FEE2E2" />
          </TouchableOpacity>
        </View>

        {/* Space */}
        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
}
