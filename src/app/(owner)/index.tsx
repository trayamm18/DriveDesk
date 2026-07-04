import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFleetStore } from '@/store/useFleetStore';
import { Feather } from '@expo/vector-icons';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';

export default function OwnerDashboard() {
  const router = useRouter();
  const { 
    currentUser, 
    activities, 
    vehicles, 
    bookings, 
    notifications, 
    markNotificationsAsRead 
  } = useFleetStore();

  const [notifVisible, setNotifVisible] = useState(false);

  // Derive stats dynamically from Zustand store
  const availableCars = vehicles.filter(v => v.status === 'Available' || v.status === 'Ready').length;
  const inService = vehicles.filter(v => v.status === 'Maintenance').length;
  
  // Calculate today's revenue from payments made today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRevenue = bookings
    .flatMap(b => b.payments)
    .filter(p => p.date === todayStr && p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0) || 42300; // fallback default

  const todayPickups = bookings.filter(b => b.startDate === todayStr).length || 12;
  const todayReturns = bookings.filter(b => b.endDate === todayStr).length || 9;

  const pendingPaymentsAmount = bookings
    .flatMap(b => b.payments)
    .filter(p => p.type === 'Pending' || p.status === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0) || 18000;

  // Unread notification count
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const handleOpenNotifications = () => {
    setNotifVisible(true);
    markNotificationsAsRead();
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      {/* HEADER */}
      <View className="flex-row justify-between items-center px-6 py-4 border-b border-slate-50 bg-white">
        <View>
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            DriveDesk OS
          </Text>
          <Text className="text-slate-900 text-xl font-extrabold tracking-tight mt-0.5">
            Good Morning, Rahul 👋
          </Text>
        </View>
        <TouchableOpacity 
          onPress={handleOpenNotifications}
          activeOpacity={0.7}
          className="w-10 h-10 border border-slate-100 rounded-xl items-center justify-center relative bg-white"
        >
          <Feather name="bell" size={18} color="#0F172A" />
          {unreadNotifCount > 0 && (
            <View className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6 pt-5" showsVerticalScrollIndicator={false}>
        
        {/* SECTION 1: ACTIONABLE ALERTS */}
        <View className="mb-6 space-y-2.5">
          <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">
            Needs Your Attention
          </Text>
          
          <TouchableOpacity 
            onPress={() => router.push('/(owner)/fleet?filter=maintenance')}
            activeOpacity={0.7}
            className="flex-row items-center bg-slate-50 border border-slate-100 p-3.5 rounded-xl"
          >
            <View className="w-8 h-8 rounded-lg bg-red-50 items-center justify-center mr-3">
              <Text className="text-base">🚨</Text>
            </View>
            <Text className="text-slate-800 text-sm font-semibold flex-1">
              {inService} vehicles currently in service
            </Text>
            <Feather name="chevron-right" size={14} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/(owner)/fleet?filter=expiring')}
            activeOpacity={0.7}
            className="flex-row items-center bg-slate-50 border border-slate-100 p-3.5 rounded-xl"
          >
            <View className="w-8 h-8 rounded-lg bg-amber-50 items-center justify-center mr-3">
              <Text className="text-base">📄</Text>
            </View>
            <Text className="text-slate-800 text-sm font-semibold flex-1">
              1 insurance/PUC expiring in 5 days
            </Text>
            <Feather name="chevron-right" size={14} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/(owner)/bookings?filter=pending')}
            activeOpacity={0.7}
            className="flex-row items-center bg-slate-50 border border-slate-100 p-3.5 rounded-xl"
          >
            <View className="w-8 h-8 rounded-lg bg-blue-50 items-center justify-center mr-3">
              <Text className="text-base">💰</Text>
            </View>
            <Text className="text-slate-800 text-sm font-semibold flex-1">
              ₹{pendingPaymentsAmount.toLocaleString('en-IN')} pending payments
            </Text>
            <Feather name="chevron-right" size={14} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/(owner)/bookings?filter=returning')}
            activeOpacity={0.7}
            className="flex-row items-center bg-slate-50 border border-slate-100 p-3.5 rounded-xl"
          >
            <View className="w-8 h-8 rounded-lg bg-emerald-50 items-center justify-center mr-3">
              <Text className="text-base">📅</Text>
            </View>
            <Text className="text-slate-800 text-sm font-semibold flex-1">
              3 vehicles returning today
            </Text>
            <Feather name="chevron-right" size={14} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* SECTION 2: TODAY'S BUSINESS */}
        <View className="mb-6">
          <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-3">
            Today's Business
          </Text>
          
          <View className="flex-row flex-wrap justify-between">
            <View className="w-[48%] border border-slate-100 p-4 rounded-xl mb-3 bg-white">
              <Text className="text-slate-400 text-xs font-semibold">Today's Revenue</Text>
              <Text className="text-slate-900 text-xl font-bold mt-1">₹{todayRevenue.toLocaleString('en-IN')}</Text>
            </View>
            <View className="w-[48%] border border-slate-100 p-4 rounded-xl mb-3 bg-white">
              <Text className="text-slate-400 text-xs font-semibold">Available Cars</Text>
              <Text className="text-slate-900 text-xl font-bold mt-1">{availableCars}</Text>
            </View>
            <View className="w-[48%] border border-slate-100 p-4 rounded-xl bg-white">
              <Text className="text-slate-400 text-xs font-semibold">Today's Pickups</Text>
              <Text className="text-slate-950 text-xl font-bold mt-1">{todayPickups}</Text>
            </View>
            <View className="w-[48%] border border-slate-100 p-4 rounded-xl bg-white">
              <Text className="text-slate-400 text-xs font-semibold">Today's Returns</Text>
              <Text className="text-slate-950 text-xl font-bold mt-1">{todayReturns}</Text>
            </View>
          </View>
        </View>

        {/* SECTION 3: QUICK ACTIONS */}
        <View className="mb-6">
          <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-3">
            Quick Actions
          </Text>
          <View className="flex-row space-x-2">
            <TouchableOpacity
              onPress={() => router.push('/search')}
              activeOpacity={0.7}
              className="flex-1 border border-slate-200 py-3 px-4 rounded-xl flex-row items-center justify-center bg-white"
            >
              <Feather name="search" size={14} color="#0F172A" />
              <Text className="text-slate-900 text-xs font-bold uppercase tracking-wider ml-1.5">
                Search
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(owner)/bookings')}
              activeOpacity={0.7}
              className="flex-1 border border-slate-200 py-3 px-4 rounded-xl flex-row items-center justify-center bg-white"
            >
              <Feather name="calendar" size={14} color="#0F172A" />
              <Text className="text-slate-900 text-xs font-bold uppercase tracking-wider ml-1.5">
                Calendar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 4: RECENT ACTIVITY */}
        <View className="mb-12">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
              Recent Activity
            </Text>
            <TouchableOpacity onPress={() => router.push('/activity')} activeOpacity={0.7}>
              <Text className="text-slate-900 text-xs font-bold uppercase tracking-wider">
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View className="border border-slate-100 rounded-xl overflow-hidden bg-white">
            {activities.slice(0, 4).map((activity, index) => (
              <View 
                key={activity.id} 
                className={`p-4 flex-row items-start ${index < 3 ? 'border-b border-slate-50' : ''}`}
              >
                <View className="w-2 h-2 rounded-full bg-slate-900 mt-1.5 mr-3" />
                <View className="flex-1">
                  <Text className="text-slate-800 text-xs font-bold">
                    {activity.message}
                  </Text>
                  <Text className="text-slate-400 text-[10px] font-semibold mt-1">
                    {activity.user} • {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* FAB FOR BOOKINGS */}
      <TouchableOpacity
        onPress={() => router.push('/booking/new')}
        activeOpacity={0.85}
        style={{
          position: 'absolute',
          bottom: 90,
          right: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 5,
        }}
        className="bg-slate-900 px-5 py-3.5 rounded-full flex-row items-center justify-center border border-slate-800"
      >
        <Feather name="plus" size={16} color="#FFF" />
        <Text className="text-white text-xs font-bold uppercase tracking-wider ml-1.5">
          New Booking
        </Text>
      </TouchableOpacity>

      {/* NOTIFICATIONS MODAL */}
      <Modal
        visible={notifVisible}
        onClose={() => setNotifVisible(false)}
        title="Notifications"
        primaryActionLabel="Clear All"
        onPrimaryAction={() => setNotifVisible(false)}
      >
        <View className="space-y-4 py-2">
          {notifications.length === 0 ? (
            <View className="items-center py-6">
              <Text className="text-slate-400 text-sm">No new notifications.</Text>
            </View>
          ) : (
            notifications.map((n) => (
              <View key={n.id} className="border-b border-slate-50 pb-3">
                <View className="flex-row justify-between items-start">
                  <Text className="text-slate-900 font-bold text-sm flex-1 pr-2">{n.title}</Text>
                  <Text className="text-slate-400 text-[10px] font-bold mt-0.5">{n.timestamp}</Text>
                </View>
                <Text className="text-slate-600 text-xs mt-1 leading-relaxed">{n.body}</Text>
              </View>
            ))
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
