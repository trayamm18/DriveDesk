import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFleetStore } from '@/store/useFleetStore';
import { ImageCarousel } from '@/components/ui/ImageCarousel';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Feather } from '@expo/vector-icons';

export default function VehicleDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { vehicles, addVehicleNote, updateVehicleStatus, showToast } = useFleetStore();

  const vehicle = vehicles.find((v) => v.id === id);

  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  if (!vehicle) {
    return (
      <SafeAreaView style={{ flex: 1 }} className="bg-white justify-center items-center px-6">
        <Text className="text-xl font-bold text-slate-800">Vehicle not found</Text>
        <Button label="Go Back" onPress={() => router.back()} className="mt-4" />
      </SafeAreaView>
    );
  }

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addVehicleNote(vehicle.id, newNote.trim());
    setNewNote('');
    setAddingNote(false);
    showToast('Internal note added.', 'success');
  };
 
  const [timeLeft, setTimeLeft] = useState('');
 
  useEffect(() => {
    if (vehicle.status !== 'Hold' || !vehicle.holdUntil) {
      setTimeLeft('');
      return;
    }
 
    const updateTimer = () => {
      const difference = new Date(vehicle.holdUntil!).getTime() - Date.now();
      if (difference <= 0) {
        useFleetStore.getState().releaseHold(vehicle.id);
        showToast('Hold expired. Vehicle is available.', 'info');
        setTimeLeft('');
      } else {
        const minutes = Math.floor(difference / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      }
    };
 
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [vehicle.status, vehicle.holdUntil]);

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      {/* Sticky Custom Header */}
      <View className="flex-row justify-between items-center px-6 py-4 border-b border-slate-50 bg-white">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="w-10 h-10 border border-slate-100 rounded-xl items-center justify-center">
          <Feather name="arrow-left" size={16} color="#0F172A" />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-slate-900 font-extrabold text-sm tracking-tight">{vehicle.model}</Text>
          <Text className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mt-0.5">{vehicle.registrationNumber}</Text>
        </View>
        <View className="w-10 h-10" /> {/* Spacer */}
      </View>

      <ScrollView className="flex-grow" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Swipable Image Gallery */}
        <ImageCarousel images={vehicle.images} height={260} />

        <View className="px-6 pt-5">
          {/* Status & Station Info */}
          <View className="pb-5 border-b border-slate-50">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center space-x-2">
                <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mr-1">Status</Text>
                <StatusBadge status={timeLeft ? `Hold (${timeLeft})` : vehicle.status} />
              </View>
              <View className="flex-row items-center">
                <Feather name="map-pin" size={12} color="#64748B" />
                <Text className="text-slate-700 text-xs font-bold ml-1.5">{vehicle.currentBranch}</Text>
              </View>
            </View>

            {/* Action Buttons row (full width, spaced out) */}
            <View className="mt-4 flex-row items-center justify-end">
              {/* Action Buttons for Hold / Reserve / Book */}
              {(vehicle.status === 'Available' || vehicle.status === 'Ready') && (
                <>
                  <TouchableOpacity 
                    onPress={() => {
                      useFleetStore.getState().holdVehicle(vehicle.id);
                      showToast('Vehicle placed on a 5-minute hold.', 'success');
                    }}
                    style={{ backgroundColor: '#F3E8FF', borderColor: '#E9D5FF', borderWidth: 1 }}
                    className="px-4 py-2.5 rounded-xl active:bg-purple-100 mr-3"
                  >
                    <Text className="text-purple-700 text-xs font-bold uppercase tracking-wider">Hold</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={() => {
                      useFleetStore.getState().reserveVehicle(vehicle.id);
                      showToast('Car Reserved! ₹500 advance recorded.', 'success');
                    }}
                    style={{ backgroundColor: '#FEF3C7', borderColor: '#FDE68A', borderWidth: 1 }}
                    className="px-4 py-2.5 rounded-xl active:bg-amber-100 mr-3"
                  >
                    <Text className="text-amber-800 text-xs font-bold uppercase tracking-wider">Reserve</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={() => router.push(`/booking/new?vehicleId=${vehicle.id}`)}
                    style={{ backgroundColor: '#0F172A' }}
                    className="px-4 py-2.5 rounded-xl active:bg-slate-800"
                  >
                    <Text className="text-white text-xs font-bold uppercase tracking-wider">Book Now</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Action Buttons for Hold status */}
              {vehicle.status === 'Hold' && (
                <>
                  <TouchableOpacity 
                    onPress={() => {
                      useFleetStore.getState().releaseHold(vehicle.id);
                      showToast('Hold released.', 'info');
                    }}
                    style={{ backgroundColor: '#F1F5F9', borderColor: '#E2E8F0', borderWidth: 1 }}
                    className="px-4 py-2.5 rounded-xl active:bg-slate-200 mr-3"
                  >
                    <Text className="text-slate-700 text-xs font-bold uppercase tracking-wider">Release</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={() => router.push(`/booking/new?vehicleId=${vehicle.id}`)}
                    style={{ backgroundColor: '#0F172A' }}
                    className="px-4 py-2.5 rounded-xl active:bg-slate-800"
                  >
                    <Text className="text-white text-xs font-bold uppercase tracking-wider">Book Now</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Action Buttons for Reserved status */}
              {vehicle.status === 'Reserved' && (
                <>
                  <TouchableOpacity 
                    onPress={() => {
                      useFleetStore.getState().cancelReservation(vehicle.id);
                      showToast('Reservation cancelled and refunded.', 'info');
                    }}
                    style={{ backgroundColor: '#FEE2E2', borderColor: '#FCA5A5', borderWidth: 1 }}
                    className="px-4 py-2.5 rounded-xl active:bg-red-100 mr-3"
                  >
                    <Text className="text-red-700 text-xs font-bold uppercase tracking-wider">Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={() => router.push(`/booking/new?vehicleId=${vehicle.id}`)}
                    style={{ backgroundColor: '#10B981' }}
                    className="px-4 py-2.5 rounded-xl active:bg-emerald-600"
                  >
                    <Text className="text-white text-xs font-bold uppercase tracking-wider">Start Booking</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Mark Available Button for Cleaning/Maintenance */}
              {(vehicle.status === 'Cleaning' || vehicle.status === 'Maintenance') && (
                <TouchableOpacity 
                  onPress={() => {
                    updateVehicleStatus(vehicle.id, 'Available');
                    showToast(vehicle.status === 'Cleaning' ? 'Vehicle is now ready and available!' : 'Maintenance completed!', 'success');
                  }}
                  style={{ backgroundColor: '#0F172A' }}
                  className="px-4 py-2.5 rounded-xl active:bg-slate-800"
                >
                  <Text className="text-white text-xs font-bold uppercase tracking-wider">
                    {vehicle.status === 'Cleaning' ? "Mark as Available" : "Complete Maintenance"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ODOMETER & FUEL */}
          <View className="py-5 border-b border-slate-50">
            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-3">Specifications</Text>
            <View className="flex-row justify-between bg-slate-50 border border-slate-100 p-4 rounded-2xl">
              <View className="items-center flex-1 border-r border-slate-100">
                <Feather name="activity" size={14} color="#64748B" />
                <Text className="text-slate-400 text-[9px] font-bold uppercase mt-1">Odometer</Text>
                <Text className="text-slate-900 font-extrabold text-sm mt-0.5">{vehicle.odometer.toLocaleString('en-IN')} km</Text>
              </View>
              <View className="items-center flex-1 border-r border-slate-100">
                <Feather name="droplet" size={14} color="#64748B" />
                <Text className="text-slate-400 text-[9px] font-bold uppercase mt-1">Fuel Level</Text>
                <Text className="text-slate-900 font-extrabold text-sm mt-0.5">{vehicle.fuelLevel}%</Text>
              </View>
              <View className="items-center flex-1">
                <Feather name="credit-card" size={14} color="#64748B" />
                <Text className="text-slate-400 text-[9px] font-bold uppercase mt-1">FASTag</Text>
                <Text className="text-slate-900 font-extrabold text-sm mt-0.5">₹{vehicle.fastagBalance.toLocaleString('en-IN')}</Text>
              </View>
            </View>
          </View>

          {/* KEY FEATURES */}
          {vehicle.features && vehicle.features.length > 0 && (
            <View className="py-5 border-b border-slate-50">
              <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-3">Key Features</Text>
              <View className="flex-row flex-wrap">
                {vehicle.features.map((feat, index) => (
                  <View 
                    key={index} 
                    className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl flex-row items-center mr-2 mb-2"
                  >
                    <View className="w-1.5 h-1.5 rounded-full bg-slate-800 mr-2" />
                    <Text className="text-slate-800 text-xs font-bold">{feat}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* COMPLIANCE DOCUMENTS */}
          <View className="py-5 border-b border-slate-50">
            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-3">Documents Checklist</Text>
            <View className="space-y-2">
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-slate-700 text-xs font-semibold">RC Number ({vehicle.rcNumber})</Text>
                <Text className="text-emerald-600 text-xs font-extrabold">Active</Text>
              </View>
              <View className="flex-row justify-between items-center py-2 border-t border-slate-50">
                <Text className="text-slate-700 text-xs font-semibold font-medium">Insurance Expiry</Text>
                <Text className="text-slate-600 text-xs font-bold">{vehicle.insuranceExpiry}</Text>
              </View>
              <View className="flex-row justify-between items-center py-2 border-t border-slate-50">
                <Text className="text-slate-700 text-xs font-semibold">PUC Certificate Expiry</Text>
                <Text className="text-slate-600 text-xs font-bold">{vehicle.pucExpiry}</Text>
              </View>
            </View>
          </View>

          {/* DAMAGE RECORD */}
          <View className="py-5 border-b border-slate-50">
            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-3">Logged Damages</Text>
            {vehicle.damageMap.length === 0 ? (
              <Text className="text-slate-400 text-xs italic">No scratches or damages logged.</Text>
            ) : (
              <View className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                {vehicle.damageMap.map((dmg, idx) => (
                  <View key={idx} className="flex-row justify-between items-center">
                    <View>
                      <Text className="text-slate-800 text-xs font-bold">{dmg.part}</Text>
                      <Text className="text-slate-400 text-[10px] font-semibold mt-0.5">{dmg.notes}</Text>
                    </View>
                    <View className="bg-red-50 px-2 py-0.5 rounded border border-red-100">
                      <Text className="text-red-700 text-[8px] font-bold uppercase">{dmg.severity}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* SERVICE HISTORY */}
          <View className="py-5 border-b border-slate-50">
            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-3">Service & Maintenance</Text>
            {vehicle.serviceHistory.length === 0 ? (
              <Text className="text-slate-400 text-xs italic">No service records found.</Text>
            ) : (
              <View className="space-y-3">
                {vehicle.serviceHistory.map((sh) => (
                  <View key={sh.id} className="border border-slate-100 p-4 rounded-xl bg-white">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="text-slate-800 text-xs font-bold">{sh.type}</Text>
                      <Text className="text-slate-900 text-xs font-extrabold">₹{sh.cost}</Text>
                    </View>
                    <Text className="text-slate-500 text-[10px] mt-0.5 font-medium">
                      Date: {sh.date} • Odometer: {sh.odometer.toLocaleString('en-IN')} km
                    </Text>
                    <Text className="text-slate-400 text-[10px] font-semibold mt-1.5 leading-snug">
                      Note: {sh.notes} • By: {sh.performedBy}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* TIMELINE */}
          <View className="py-5 border-b border-slate-50">
            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-3">Vehicle Timeline</Text>
            {vehicle.timeline.length === 0 ? (
              <Text className="text-slate-400 text-xs italic">No history logged.</Text>
            ) : (
              <View className="border-l border-slate-100 ml-2.5 pl-4 space-y-4">
                {vehicle.timeline.map((evt) => (
                  <View key={evt.id} className="relative">
                    {/* Node circle */}
                    <View className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-900 border-2 border-white" />
                    
                    <Text className="text-slate-800 text-xs font-bold leading-snug">{evt.title}</Text>
                    <Text className="text-slate-400 text-[9px] font-bold mt-0.5 uppercase tracking-wide">
                      {new Date(evt.timestamp).toLocaleDateString()} {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {evt.user}
                    </Text>
                    <Text className="text-slate-500 text-[10px] mt-1 leading-relaxed">{evt.description}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* INTERNAL NOTES */}
          <View className="py-5">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">Internal Notes</Text>
              {!addingNote && (
                <TouchableOpacity onPress={() => setAddingNote(true)}>
                  <Text className="text-slate-900 text-xs font-bold uppercase tracking-wider">Add Note</Text>
                </TouchableOpacity>
              )}
            </View>

            {addingNote && (
              <View className="mb-4 bg-slate-50 border border-slate-100 rounded-xl p-3">
                <TextInput
                  placeholder="Type internal note here..."
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

            {vehicle.notes.length === 0 ? (
              <Text className="text-slate-400 text-xs italic">No internal notes added.</Text>
            ) : (
              <View className="space-y-2">
                {vehicle.notes.map((note, idx) => (
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
