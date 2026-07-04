import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFleetStore } from '@/store/useFleetStore';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SkeletonList } from '@/components/ui/Skeleton';
import { Feather } from '@expo/vector-icons';

export default function OwnerFleet() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { vehicles } = useFleetStore();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // If filter parameter is passed from dashboard alert clicks, apply it
  useEffect(() => {
    if (params.filter) {
      if (params.filter === 'maintenance') {
        setActiveFilter('maintenance');
      } else if (params.filter === 'expiring') {
        // Just show all and let user search, or handle custom filtering
        setActiveFilter('all');
      }
    }
  }, [params.filter]);

  // Simulate Stripe-like skeleton loading on mount or filter change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [activeFilter]);

  const filteredVehicles = vehicles.filter((v) => {
    // Search filter
    const matchesSearch = 
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.registrationNumber.toLowerCase().includes(search.toLowerCase());

    // Status filter
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'available') {
      return matchesSearch && (v.status === 'Available' || v.status === 'Ready');
    }
    return matchesSearch && v.status.toLowerCase() === activeFilter.toLowerCase();
  });

  const filterPills = [
    { id: 'all', label: 'All' },
    { id: 'available', label: 'Available' },
    { id: 'picked up', label: 'Picked Up' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'cleaning', label: 'Cleaning' },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      {/* Header */}
      <View className="px-6 pt-4 pb-2 bg-white">
        <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          Inventory
        </Text>
        <Text className="text-slate-900 text-3xl font-extrabold tracking-tight mt-0.5">
          Fleet Management
        </Text>
        
        {/* Search */}
        <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 mt-4">
          <Feather name="search" size={16} color="#64748B" className="mr-2" />
          <TextInput
            placeholder="Search by model or plate number..."
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

        {/* Filter Pills */}
        <FlatList
          data={filterPills}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4 -mx-6 px-6"
          contentContainerStyle={{ paddingRight: 40, paddingBottom: 10 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveFilter(item.id)}
              activeOpacity={0.7}
              className={`px-4 py-2 rounded-full mr-2 border ${
                activeFilter === item.id
                  ? 'bg-slate-900 border-slate-900'
                  : 'bg-white border-slate-200'
              }`}
            >
              <Text
                className={`text-xs font-bold uppercase tracking-wider ${
                  activeFilter === item.id ? 'text-white' : 'text-slate-600'
                }`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Main List */}
      <View className="flex-1 border-t border-slate-50 bg-slate-50/30">
        {loading ? (
          <SkeletonList />
        ) : filteredVehicles.length === 0 ? (
          <View className="flex-1 justify-center items-center px-6 py-12">
            <Text className="text-4xl mb-4">🚗</Text>
            <Text className="text-slate-900 font-extrabold text-base tracking-wide">
              No vehicles found
            </Text>
            <Text className="text-slate-400 text-sm mt-1.5 text-center leading-relaxed">
              No cars currently match your selected filters. Tap another category or check spelling.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredVehicles}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => router.push(`/vehicle/${item.id}`)}
                activeOpacity={0.8}
                className="flex-row items-center bg-white border border-slate-100 p-4 rounded-2xl mb-3 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]"
              >
                {/* Car Thumbnail */}
                <Image
                  source={typeof item.images[0] === 'number' ? item.images[0] : { uri: item.images[0] }}
                  className="w-16 h-16 rounded-xl bg-slate-100 mr-4"
                  resizeMode="cover"
                />

                {/* Car Info */}
                <View className="flex-1 justify-center">
                  <Text className="text-slate-900 font-extrabold text-base tracking-tight leading-snug">
                    {item.model}
                  </Text>
                  <Text className="text-slate-400 text-xs font-semibold mt-0.5 tracking-wider uppercase">
                    {item.registrationNumber}
                  </Text>
                  <View className="flex-row items-center mt-2">
                    <Feather name="map-pin" size={10} color="#94A3B8" />
                    <Text className="text-slate-400 text-[10px] font-bold tracking-wide ml-1">
                      {item.currentBranch}
                    </Text>
                  </View>
                </View>

                {/* Status Badges & Action */}
                <View className="items-end space-y-2">
                  <StatusBadge status={item.status} />
                  <Feather name="chevron-right" size={14} color="#CBD5E1" />
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
