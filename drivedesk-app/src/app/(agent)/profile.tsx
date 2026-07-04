import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFleetStore } from '@/store/useFleetStore';
import { Feather } from '@expo/vector-icons';

export default function AgentProfile() {
  const router = useRouter();
  const { logout, showToast, currentUser } = useFleetStore();

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully.', 'info');
    router.replace('/login');
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      {/* Header */}
      <View className="px-6 pt-4 pb-4 border-b border-slate-50 bg-white">
        <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          Account
        </Text>
        <Text className="text-slate-900 text-3xl font-extrabold tracking-tight mt-0.5">
          My Profile
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        
        {/* Agent Info card */}
        <View className="flex-row items-center border border-slate-100 p-5 rounded-2xl bg-slate-50/50 mb-6">
          <View className="w-14 h-14 rounded-full bg-slate-900 items-center justify-center mr-4">
            <Text className="text-white font-bold text-lg">AV</Text>
          </View>
          <View className="flex-1">
            <Text className="text-slate-900 font-extrabold text-lg leading-tight">
              {currentUser?.name || 'Amit Verma'}
            </Text>
            <Text className="text-slate-500 text-xs font-bold mt-1 tracking-wider uppercase">
              {currentUser?.role || 'Agent'} • {currentUser?.branch || 'Pune Airport'}
            </Text>
          </View>
        </View>

        {/* Operational Performance Stats */}
        <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-3">
          My Activity Stats
        </Text>
        <View className="flex-row flex-wrap justify-between mb-8">
          <View className="w-[48%] border border-slate-100 p-4 rounded-xl mb-3 bg-white">
            <Text className="text-slate-400 text-xs font-semibold">Checkouts done</Text>
            <Text className="text-slate-900 text-2xl font-bold mt-1">42</Text>
          </View>
          <View className="w-[48%] border border-slate-100 p-4 rounded-xl mb-3 bg-white">
            <Text className="text-slate-400 text-xs font-semibold">Cleanings logs</Text>
            <Text className="text-slate-900 text-2xl font-bold mt-1">18</Text>
          </View>
          <View className="w-[48%] border border-slate-100 p-4 rounded-xl bg-white">
            <Text className="text-slate-400 text-xs font-semibold">Damage checks</Text>
            <Text className="text-slate-900 text-2xl font-bold mt-1">11</Text>
          </View>
          <View className="w-[48%] border border-slate-100 p-4 rounded-xl bg-white">
            <Text className="text-slate-400 text-xs font-semibold">Total hours</Text>
            <Text className="text-slate-900 text-2xl font-bold mt-1">140h</Text>
          </View>
        </View>

        {/* Action Menu List */}
        <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-3">
          Options
        </Text>
        <View className="border border-slate-100 rounded-xl overflow-hidden bg-white mb-12">
          <TouchableOpacity
            onPress={() => showToast('Theme settings are managed by OS.', 'info')}
            activeOpacity={0.7}
            className="flex-row items-center justify-between p-4 border-b border-slate-50"
          >
            <View className="flex-row items-center">
              <Feather name="layers" size={14} color="#64748B" />
              <Text className="text-slate-800 text-xs font-bold uppercase tracking-wider ml-3">
                Theme / Appearance
              </Text>
            </View>
            <Feather name="chevron-right" size={14} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => showToast('Device configurations loaded.', 'info')}
            activeOpacity={0.7}
            className="flex-row items-center justify-between p-4 border-b border-slate-50"
          >
            <View className="flex-row items-center">
              <Feather name="smartphone" size={14} color="#64748B" />
              <Text className="text-slate-800 text-xs font-bold uppercase tracking-wider ml-3">
                Device / Scanner
              </Text>
            </View>
            <Feather name="chevron-right" size={14} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.7}
            className="flex-row items-center justify-between p-4"
          >
            <View className="flex-row items-center">
              <Feather name="log-out" size={14} color="#EF4444" />
              <Text className="text-red-600 text-xs font-extrabold uppercase tracking-wider ml-3">
                Logout Account
              </Text>
            </View>
            <Feather name="chevron-right" size={14} color="#FEE2E2" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
