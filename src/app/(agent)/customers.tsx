import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFleetStore } from '@/store/useFleetStore';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SkeletonList } from '@/components/ui/Skeleton';
import { Feather } from '@expo/vector-icons';

export default function AgentCustomers() {
  const router = useRouter();
  const { customers } = useFleetStore();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredCustomers = customers.filter((c) => {
    return (
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    );
  });

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      {/* Header */}
      <View className="px-6 pt-4 pb-2 bg-white">
        <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          Database
        </Text>
        <Text className="text-slate-900 text-3xl font-extrabold tracking-tight mt-0.5">
          Customers
        </Text>
        
        {/* Search */}
        <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 mt-4">
          <Feather name="search" size={16} color="#64748B" className="mr-2" />
          <TextInput
            placeholder="Search by name or phone number..."
            placeholderTextColor="#94A3B8"
            className="flex-1 text-slate-800 text-sm font-medium py-0"
            value={search}
            onChangeText={setSearch}
            keyboardType="default"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Feather name="x" size={14} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main List */}
      <View className="flex-1 border-t border-slate-50 bg-slate-50/30">
        {loading ? (
          <SkeletonList />
        ) : filteredCustomers.length === 0 ? (
          <View className="flex-1 justify-center items-center px-6 py-12">
            <Text className="text-4xl mb-4">👤</Text>
            <Text className="text-slate-900 font-extrabold text-base tracking-wide">
              No customers found
            </Text>
            <Text className="text-slate-400 text-sm mt-1.5 text-center leading-relaxed">
              No profiles currently match your search query. Check name or phone.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredCustomers}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => router.push(`/customer/${item.id}`)}
                activeOpacity={0.8}
                className="flex-row items-center bg-white border border-slate-100 p-4 rounded-2xl mb-3 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]"
              >
                {/* Initial circle avatar */}
                <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-4">
                  <Text className="text-slate-700 font-bold text-sm">
                    {item.name.charAt(0)}
                  </Text>
                </View>

                {/* Profile info */}
                <View className="flex-1 justify-center">
                  <Text className="text-slate-900 font-extrabold text-sm tracking-tight leading-snug">
                    {item.name}
                  </Text>
                  <Text className="text-slate-400 text-xs font-semibold mt-0.5 tracking-wider">
                    +91 {item.phone}
                  </Text>
                  
                  {/* Rating / Tag */}
                  <View className="flex-row items-center mt-2">
                    <StatusBadge status={item.customerRating} />
                  </View>
                </View>

                {/* Status and Action */}
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
