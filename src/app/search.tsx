import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFleetStore } from '@/store/useFleetStore';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SkeletonList } from '@/components/ui/Skeleton';
import { Feather } from '@expo/vector-icons';

export default function UniversalSearch() {
  const router = useRouter();
  const { vehicles, customers, bookings } = useFleetStore();

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Debounced skeleton loader
  useEffect(() => {
    if (!query) return;
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Matching Logic
  const getResults = () => {
    if (!query.trim()) return { vehicles: [], customers: [], bookings: [] };

    const q = query.toLowerCase().trim();

    const matchedVehicles = vehicles.filter(
      v => v.model.toLowerCase().includes(q) || v.registrationNumber.toLowerCase().includes(q)
    );

    const matchedCustomers = customers.filter(
      c => c.name.toLowerCase().includes(q) || c.phone.includes(q)
    );

    const matchedBookings = bookings.filter(b => {
      const customer = customers.find(c => c.id === b.customerId);
      const vehicle = vehicles.find(v => v.id === b.vehicleId);
      
      return (
        b.id.toLowerCase().includes(q) ||
        (customer && customer.name.toLowerCase().includes(q)) ||
        (vehicle && vehicle.registrationNumber.toLowerCase().includes(q)) ||
        (vehicle && vehicle.model.toLowerCase().includes(q))
      );
    });

    return {
      vehicles: matchedVehicles,
      customers: matchedCustomers,
      bookings: matchedBookings,
    };
  };

  const results = getResults();
  const hasResults = results.vehicles.length > 0 || results.customers.length > 0 || results.bookings.length > 0;

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      {/* Header Search Box */}
      <View className="flex-row items-center px-6 py-4 border-b border-slate-50 bg-white">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="w-10 h-10 border border-slate-100 rounded-xl items-center justify-center mr-3">
          <Feather name="arrow-left" size={16} color="#0F172A" />
        </TouchableOpacity>
        
        <View className="flex-grow flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
          <Feather name="search" size={16} color="#64748B" className="mr-2" />
          <TextInput
            placeholder="Search car, customer name, phone, booking ID..."
            placeholderTextColor="#94A3B8"
            className="flex-1 text-slate-800 text-sm font-medium py-0"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Feather name="x" size={14} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results viewport */}
      <ScrollView className="flex-1 bg-slate-50/20" showsVerticalScrollIndicator={false}>
        {!query.trim() ? (
          <View className="p-8 items-center justify-center py-20 bg-white">
            <Feather name="search" size={32} color="#CBD5E1" className="mb-4" />
            <Text className="text-slate-900 font-extrabold text-base tracking-wide">Universal Search</Text>
            <Text className="text-slate-400 text-xs mt-1.5 text-center leading-relaxed max-w-xs">
              Search plates (e.g. MH12), customer names (e.g. Amit), phone numbers, or booking IDs (e.g. BK-101) directly.
            </Text>
          </View>
        ) : loading ? (
          <SkeletonList />
        ) : !hasResults ? (
          <View className="p-8 items-center justify-center py-20 bg-white">
            <Text className="text-4xl mb-4">🔍</Text>
            <Text className="text-slate-900 font-extrabold text-base tracking-wide">No matches found</Text>
            <Text className="text-slate-400 text-xs mt-1.5 text-center leading-relaxed max-w-xs">
              Your search query did not match any active vehicle, customer profile, or booking register. Try "Thar", "Creta", "Deshmukh" or "BK".
            </Text>
          </View>
        ) : (
          <View className="p-6 space-y-8">
            
            {/* VEHICLES RESULTS */}
            {results.vehicles.length > 0 && (
              <View>
                <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-3">Matched Vehicles</Text>
                <View className="space-y-3">
                  {results.vehicles.map((v) => (
                    <TouchableOpacity
                      key={v.id}
                      onPress={() => router.push(`/vehicle/${v.id}`)}
                      activeOpacity={0.8}
                      className="flex-row items-center bg-white border border-slate-100 p-3.5 rounded-2xl shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]"
                    >
                      <Image source={typeof v.images[0] === 'number' ? v.images[0] : { uri: v.images[0] }} className="w-12 h-12 rounded-lg mr-3 bg-slate-100" />
                      <View className="flex-1">
                        <Text className="text-slate-900 font-bold text-sm leading-snug">{v.model}</Text>
                        <Text className="text-slate-400 text-[10px] font-semibold mt-0.5 uppercase tracking-wide">{v.registrationNumber}</Text>
                      </View>
                      
                      <View className="items-end space-y-2">
                        <StatusBadge status={v.status} />
                        {(v.status === 'Available' || v.status === 'Ready') && (
                          <TouchableOpacity 
                            onPress={() => router.push(`/booking/new?vehicleId=${v.id}`)}
                            className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
                          >
                            <Text className="text-white text-[9px] font-bold uppercase tracking-wider">Book Now</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* CUSTOMERS RESULTS */}
            {results.customers.length > 0 && (
              <View>
                <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-3">Matched Customers</Text>
                <View className="space-y-3">
                  {results.customers.map((c) => (
                    <TouchableOpacity
                      key={c.id}
                      onPress={() => router.push(`/customer/${c.id}`)}
                      activeOpacity={0.8}
                      className="flex-row items-center bg-white border border-slate-100 p-3.5 rounded-2xl shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]"
                    >
                      <View className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center mr-3">
                        <Text className="text-slate-700 font-bold text-xs">{c.name.charAt(0)}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-slate-900 font-bold text-sm">{c.name}</Text>
                        <Text className="text-slate-400 text-[10px] font-semibold mt-0.5">+91 {c.phone}</Text>
                      </View>
                      <StatusBadge status={c.status} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* BOOKINGS RESULTS */}
            {results.bookings.length > 0 && (
              <View>
                <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-3">Matched Bookings</Text>
                <View className="space-y-3">
                  {results.bookings.map((b) => {
                    const c = customers.find(cust => cust.id === b.customerId);
                    const v = vehicles.find(veh => veh.id === b.vehicleId);
                    return (
                      <TouchableOpacity
                        key={b.id}
                        onPress={() => router.push(`/booking/${b.id}`)}
                        activeOpacity={0.8}
                        className="bg-white border border-slate-100 p-4 rounded-2xl shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]"
                      >
                        <View className="flex-row justify-between items-center mb-2">
                          <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">{b.id}</Text>
                          <StatusBadge status={b.status} />
                        </View>
                        <Text className="text-slate-800 text-xs font-bold leading-tight">{c?.name || 'Customer'}</Text>
                        <Text className="text-slate-400 text-[10px] font-semibold mt-0.5">{v?.model} • {b.startDate} to {b.endDate}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
