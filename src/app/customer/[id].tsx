import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFleetStore } from '@/store/useFleetStore';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Feather } from '@expo/vector-icons';

export default function CustomerDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { customers, bookings, vehicles, addCustomerNote, showToast } = useFleetStore();

  const customer = customers.find((c) => c.id === id);

  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  if (!customer) {
    return (
      <SafeAreaView style={{ flex: 1 }} className="bg-white justify-center items-center px-6">
        <Text className="text-xl font-bold text-slate-800">Customer not found</Text>
        <Button label="Go Back" onPress={() => router.back()} className="mt-4" />
      </SafeAreaView>
    );
  }

  // Filter bookings belonging to this customer
  const customerBookings = bookings.filter(b => b.customerId === customer.id);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addCustomerNote(customer.id, newNote.trim());
    setNewNote('');
    setAddingNote(false);
    showToast('Customer internal note added.', 'success');
  };

  const dl = customer.documents.DL;
  const aadhaar = customer.documents.Aadhaar;
  const pan = customer.documents.PAN;

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      {/* Custom Header */}
      <View className="flex-row justify-between items-center px-6 py-4 border-b border-slate-50 bg-white">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="w-10 h-10 border border-slate-100 rounded-xl items-center justify-center">
          <Feather name="arrow-left" size={16} color="#0F172A" />
        </TouchableOpacity>
        <Text className="text-slate-900 font-extrabold text-sm tracking-tight">Customer Profile</Text>
        <View className="w-10 h-10" />
      </View>

      <ScrollView className="flex-grow" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* HERO SECTION */}
        <View className="px-6 py-6 bg-slate-50/50 border-b border-slate-100 items-center">
          <View className="w-16 h-16 rounded-full bg-slate-900 items-center justify-center mb-4">
            <Text className="text-white font-bold text-xl">{customer.name.charAt(0)}</Text>
          </View>
          <Text className="text-slate-900 text-2xl font-extrabold tracking-tight">{customer.name}</Text>
          <Text className="text-slate-500 text-sm font-semibold mt-1">+91 {customer.phone}</Text>
          
          <View className="flex-row items-center space-x-2 mt-4">
            <StatusBadge status={customer.status} />
            <StatusBadge status={customer.customerRating} />
          </View>
        </View>

        <View className="px-6 pt-6">
          
          {/* ADDRESS & EMERGENCY */}
          <View className="pb-5 border-b border-slate-50">
            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-3">Address & Emergency Contact</Text>
            <View className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-3">
              <View>
                <Text className="text-slate-400 text-[9px] font-bold uppercase">Billing Address</Text>
                <Text className="text-slate-800 text-xs font-bold leading-relaxed mt-0.5">{customer.address}</Text>
              </View>
              <View className="border-t border-slate-100 pt-3">
                <Text className="text-slate-400 text-[9px] font-bold uppercase font-medium">Emergency Contact</Text>
                <Text className="text-slate-800 text-xs font-bold mt-0.5">{customer.emergencyContact.name} ({customer.emergencyContact.relation})</Text>
                <Text className="text-slate-500 text-[10px] font-bold mt-0.5">+91 {customer.emergencyContact.phone}</Text>
              </View>
            </View>
          </View>

          {/* DOCUMENTS */}
          <View className="py-5 border-b border-slate-50">
            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-3">Verified Documents</Text>
            
            <View className="space-y-3">
              {/* DL Card */}
              {dl.status !== 'Not Uploaded' && (
                <View className="border border-slate-100 p-4 rounded-xl bg-white flex-row justify-between items-center">
                  <View>
                    <Text className="text-slate-800 text-xs font-bold">Driving Licence (DL)</Text>
                    <Text className="text-slate-400 text-[10px] font-semibold mt-0.5">No: {dl.number} • Expiry: {dl.expiryDate}</Text>
                    <Text className="text-slate-400 text-[9px] mt-1">Uploaded: {dl.uploadDate}</Text>
                  </View>
                  <StatusBadge status={dl.status} />
                </View>
              )}

              {/* Aadhaar Card */}
              {aadhaar.status !== 'Not Uploaded' && (
                <View className="border border-slate-100 p-4 rounded-xl bg-white flex-row justify-between items-center">
                  <View>
                    <Text className="text-slate-800 text-xs font-bold">Aadhaar Card (UIDAI)</Text>
                    <Text className="text-slate-400 text-[10px] font-semibold mt-0.5">UID: {aadhaar.number}</Text>
                    <Text className="text-slate-400 text-[9px] mt-1">Uploaded: {aadhaar.uploadDate}</Text>
                  </View>
                  <StatusBadge status={aadhaar.status} />
                </View>
              )}

              {/* PAN Card */}
              {pan.status !== 'Not Uploaded' && (
                <View className="border border-slate-100 p-4 rounded-xl bg-white flex-row justify-between items-center">
                  <View>
                    <Text className="text-slate-800 text-xs font-bold">PAN Card</Text>
                    <Text className="text-slate-400 text-[10px] font-semibold mt-0.5">PAN: {pan.number}</Text>
                    <Text className="text-slate-400 text-[9px] mt-1">Uploaded: {pan.uploadDate}</Text>
                  </View>
                  <StatusBadge status={pan.status} />
                </View>
              )}
            </View>
          </View>

          {/* RENTAL HISTORY */}
          <View className="py-5 border-b border-slate-50">
            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-3">Rental History</Text>
            {customerBookings.length === 0 ? (
              <Text className="text-slate-400 text-xs italic">No rental history found.</Text>
            ) : (
              <View className="space-y-3">
                {customerBookings.map((b) => {
                  const vehicle = vehicles.find((v) => v.id === b.vehicleId);
                  return (
                    <TouchableOpacity
                      key={b.id}
                      onPress={() => router.push(`/booking/${b.id}`)}
                      activeOpacity={0.7}
                      className="border border-slate-100 p-4 rounded-xl bg-white flex-row justify-between items-center"
                    >
                      <View>
                        <Text className="text-slate-800 text-xs font-bold">{b.id}</Text>
                        <Text className="text-slate-500 text-[10px] font-semibold mt-0.5">
                          {vehicle?.model} ({b.startDate} to {b.endDate})
                        </Text>
                      </View>
                      <StatusBadge status={b.status} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* INTERNAL NOTES */}
          <View className="py-5">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">Internal Office Notes</Text>
              {!addingNote && (
                <TouchableOpacity onPress={() => setAddingNote(true)}>
                  <Text className="text-slate-900 text-xs font-bold uppercase tracking-wider">Add Note</Text>
                </TouchableOpacity>
              )}
            </View>

            {addingNote && (
              <View className="mb-4 bg-slate-50 border border-slate-100 rounded-xl p-3">
                <TextInput
                  placeholder="Type internal customer note..."
                  placeholderTextColor="#94A3B8"
                  className="text-slate-800 text-xs font-medium min-h-16 py-0 mb-3"
                  multiline
                  value={newNote}
                  onChangeText={setNewNote}
                />
                <View className="flex-row justify-end space-x-2">
                  <Button label="Cancel" variant="ghost" size="sm" onPress={() => setAddingNote(false)} />
                  <Button label="Save Note" size="sm" onPress={handleAddNote} />
                </View>
              </View>
            )}

            {customer.notes.length === 0 ? (
              <Text className="text-slate-400 text-xs italic">No internal office notes recorded.</Text>
            ) : (
              <View className="space-y-2">
                {customer.notes.map((note, idx) => (
                  <View key={idx} className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                    <Text className="text-slate-700 text-xs font-semibold leading-relaxed">{note}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
