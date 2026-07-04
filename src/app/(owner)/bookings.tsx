import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFleetStore } from '@/store/useFleetStore';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SkeletonList } from '@/components/ui/Skeleton';
import { Feather } from '@expo/vector-icons';

export default function OwnerBookings() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { bookings, customers, vehicles } = useFleetStore();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<string>('active');

  // If filter is passed from dashboard, handle it
  useEffect(() => {
    if (params.filter) {
      if (params.filter === 'pending') {
        // Pending payments typically aligns with upcoming/active or we can filter
        setActiveTab('upcoming');
      } else if (params.filter === 'returning') {
        setActiveTab('active');
      }
    }
  }, [params.filter]);

  // Simulate Stripe-like skeleton loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const getFilteredBookings = () => {
    return bookings.filter((b) => {
      const customer = customers.find((c) => c.id === b.customerId);
      const vehicle = vehicles.find((v) => v.id === b.vehicleId);
      
      const matchesSearch = 
        b.id.toLowerCase().includes(search.toLowerCase()) ||
        (customer && customer.name.toLowerCase().includes(search.toLowerCase())) ||
        (vehicle && vehicle.registrationNumber.toLowerCase().includes(search.toLowerCase())) ||
        (vehicle && vehicle.model.toLowerCase().includes(search.toLowerCase()));

      if (!matchesSearch) return false;

      // Tab mapping
      switch (activeTab) {
        case 'active':
          return b.status === 'Active' || b.status === 'Returned';
        case 'upcoming':
          return b.status === 'Pending Documents' || b.status === 'Pending Inspection' || b.status === 'Pending Signature';
        case 'completed':
          return b.status === 'Completed';
        case 'cancelled':
          return b.status === 'Cancelled';
        default:
          return true;
      }
    });
  };

  const filteredBookings = getFilteredBookings();

  const tabs = [
    { id: 'active', label: 'Active' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      {/* Header */}
      <View className="px-6 pt-4 pb-2 bg-white">
        <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          Schedule
        </Text>
        <Text className="text-slate-900 text-3xl font-extrabold tracking-tight mt-0.5">
          Bookings
        </Text>

        {/* Search */}
        <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 mt-4">
          <Feather name="search" size={16} color="#64748B" className="mr-2" />
          <TextInput
            placeholder="Search by customer, booking ID or car..."
            placeholderTextColor="#94A3B8"
            className="flex-1 text-slate-800 text-sm font-medium py-0"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Feather name="x" size={14} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <View className="flex-row border-b border-slate-100 mt-4">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
              className={`flex-1 items-center pb-3 border-b-2 ${
                activeTab === tab.id ? 'border-slate-900' : 'border-transparent'
              }`}
            >
              <Text
                className={`text-xs font-bold uppercase tracking-wider ${
                  activeTab === tab.id ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Main List */}
      <View className="flex-1 bg-slate-50/30">
        {loading ? (
          <SkeletonList />
        ) : filteredBookings.length === 0 ? (
          <View className="flex-1 justify-center items-center px-6 py-16 bg-white">
            <Text className="text-4xl mb-4">📅</Text>
            <Text className="text-slate-900 font-extrabold text-base tracking-wide">
              No bookings today
            </Text>
            <Text className="text-slate-400 text-sm mt-1.5 text-center leading-relaxed max-w-xs">
              No schedules match your current view. Tap ＋ New Booking to create your first booking.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/booking/new')}
              activeOpacity={0.7}
              className="mt-6 bg-slate-900 px-5 py-3 rounded-xl border border-slate-800"
            >
              <Text className="text-white text-xs font-bold uppercase tracking-wider">
                ＋ New Booking
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredBookings}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
            renderItem={({ item }) => {
              const customer = customers.find((c) => c.id === item.customerId);
              const vehicle = vehicles.find((v) => v.id === item.vehicleId);
              
              // Get payment status
              const hasUnpaid = item.payments.some(p => p.status === 'Pending' || p.type === 'Pending');
              const paymentStatusStr = hasUnpaid ? 'Pending' : 'Paid';

              return (
                <TouchableOpacity
                  onPress={() => router.push(`/booking/${item.id}`)}
                  activeOpacity={0.8}
                  className="bg-white border border-slate-100 p-4 rounded-2xl mb-3 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]"
                >
                  <View className="flex-row justify-between items-start">
                    <View>
                      <Text className="text-slate-400 text-[10px] font-extrabold tracking-widest uppercase">
                        {item.id}
                      </Text>
                      <Text className="text-slate-900 font-extrabold text-base tracking-tight mt-0.5">
                        {customer?.name || 'Customer Profile'}
                      </Text>
                    </View>
                    <StatusBadge status={item.status} />
                  </View>

                  {/* Vehicle details */}
                  <View className="flex-row items-center mt-3 pt-3 border-t border-slate-50">
                    <Feather name="truck" size={12} color="#64748B" />
                    <Text className="text-slate-700 text-xs font-bold ml-2">
                      {vehicle?.model || 'Vehicle Info'}
                    </Text>
                    <Text className="text-slate-400 text-[10px] font-bold ml-1.5 uppercase tracking-wide">
                      ({vehicle?.registrationNumber})
                    </Text>
                  </View>

                  {/* Dates */}
                  <View className="flex-row items-center mt-2">
                    <Feather name="calendar" size={12} color="#64748B" />
                    <Text className="text-slate-600 text-xs font-medium ml-2">
                      {item.startDate} to {item.endDate}
                    </Text>
                  </View>

                  {/* Financial Overview */}
                  <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-slate-50">
                    <View className="flex-row items-center space-x-2">
                      <Text className="text-slate-400 text-[10px] font-bold uppercase">Payment:</Text>
                      <StatusBadge status={paymentStatusStr} />
                    </View>
                    <Text className="text-slate-900 font-extrabold text-base">
                      ₹{item.totalAmount.toLocaleString('en-IN')}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>


    </SafeAreaView>
  );
}
