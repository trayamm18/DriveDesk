import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFleetStore } from '@/store/useFleetStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Feather } from '@expo/vector-icons';

export default function SettleBooking() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { bookings, customers, vehicles, updateBooking, addPayment, updateVehicleStatus, showToast } = useFleetStore();

  const booking = bookings.find((b) => b.id === id);
  const customer = booking ? customers.find((c) => c.id === booking.customerId) : null;
  const vehicle = booking ? vehicles.find((v) => v.id === booking.vehicleId) : null;

  // Wizard Step: 'settle' | 'routing'
  const [activeStep, setActiveStep] = useState<'settle' | 'routing'>('settle');

  const [damageVal, setDamageVal] = useState('0');
  const [otherVal, setOtherVal] = useState('0');
  const [otherReason, setOtherReason] = useState('');
  const [nextState, setNextState] = useState<'Cleaning' | 'Available' | 'Maintenance'>('Cleaning');
  const [loading, setLoading] = useState(false);

  if (!booking || !vehicle) {
    return (
      <SafeAreaView style={{ flex: 1 }} className="bg-white justify-center items-center px-6">
        <Text className="text-xl font-bold text-slate-800">Booking / Vehicle not found</Text>
        <Button label="Go Back" onPress={() => router.back()} className="mt-4" />
      </SafeAreaView>
    );
  }

  // Get deposit paid
  const depositPaid = booking.payments
    .filter(p => p.type === 'Deposit' && p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const dmg = Number(damageVal) || 0;
  const other = Number(otherVal) || 0;
  const totalDeductions = dmg + other;
  const netRefund = Math.max(0, depositPaid - totalDeductions);

  // Step 1: Submit return check-in & deposit calculations
  const handleCompleteReturn = () => {
    if (totalDeductions > depositPaid) {
      showToast('Deductions cannot exceed the paid deposit.', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      // Process Refund in database
      addPayment(booking.id, {
        type: 'Refund',
        amount: netRefund,
        method: 'UPI',
        status: 'Refunded',
      });

      // Log deductions to booking notes
      if (totalDeductions > 0) {
        const currentNotes = booking.notes || [];
        const deductionLog = `Settlement Deductions: Damage: ₹${dmg}, Other: ₹${other} (${otherReason || 'No reason specified'})`;
        updateBooking(booking.id, {
          notes: [...currentNotes, deductionLog]
        });
      }

      // Transition to routing step
      setActiveStep('routing');
      showToast('Return & refund completed successfully.', 'success');
    }, 1000);
  };

  // Step 2: Route vehicle status and redirect to Home
  const handleDoneRedirect = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      
      // Update vehicle status
      updateVehicleStatus(vehicle.id, nextState);
      showToast(`Vehicle directed to ${nextState}.`, 'success');
      
      // Redirect to Home dashboard
      router.replace('/');
    }, 800);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4 border-b border-slate-50 bg-white">
        <TouchableOpacity 
          onPress={() => activeStep === 'routing' ? setActiveStep('settle') : router.back()} 
          activeOpacity={0.7} 
          className="w-10 h-10 border border-slate-100 rounded-xl items-center justify-center"
        >
          <Feather name="arrow-left" size={16} color="#0F172A" />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">
            {activeStep === 'settle' ? 'Deposit Settlement' : 'Vehicle Dispatch'}
          </Text>
          <Text className="text-slate-900 font-extrabold text-sm tracking-tight mt-0.5">{booking.id}</Text>
        </View>
        <View className="w-10 h-10" />
      </View>

      <ScrollView className="flex-grow" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        
        {activeStep === 'settle' ? (
          // ================= STEP 1: SETTLEMENT FORM =================
          <View className="p-6">
            {/* Deposit Info Card */}
            <View className="bg-slate-900 p-6 rounded-2xl mb-6 shadow-sm">
              <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Original Security Deposit</Text>
              <Text className="text-white text-3xl font-extrabold mt-1">₹{depositPaid.toLocaleString('en-IN')}</Text>
              <View className="flex-row items-center mt-3 bg-white/10 px-3 py-1.5 rounded-lg align-self-start">
                <Feather name="shield" size={12} color="#10B981" />
                <Text className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider ml-1.5">Paid & Refundable</Text>
              </View>
            </View>

            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-4">Deductions Checklist</Text>

            {/* Damage inputs */}
            <Input
              label="Damage Deductions (INR)"
              placeholder="0"
              value={damageVal}
              onChangeText={setDamageVal}
              keyboardType="numeric"
            />

            {/* Other fine inputs - vertically stacked for perfect alignment */}
            <Input
              label="Other Fine Reason"
              placeholder="e.g. Speeding, late return penalty"
              value={otherReason}
              onChangeText={setOtherReason}
            />

            <Input
              label="Other Fine Amount (INR)"
              placeholder="0"
              value={otherVal}
              onChangeText={setOtherVal}
              keyboardType="numeric"
            />

            {/* Financial Breakdown Card */}
            <View className="bg-slate-50 border border-slate-100 p-5 rounded-2xl mt-6 space-y-2.5">
              <View className="flex-row justify-between">
                <Text className="text-slate-500 text-xs">Security Deposit Amount:</Text>
                <Text className="text-slate-800 text-xs font-bold">₹{depositPaid.toLocaleString('en-IN')}</Text>
              </View>
              <View className="flex-row justify-between pb-2.5 border-b border-slate-200/50">
                <Text className="text-slate-500 text-xs font-medium">Total Deductions Applied:</Text>
                <Text className="text-red-600 text-xs font-bold">- ₹{totalDeductions.toLocaleString('en-IN')}</Text>
              </View>
              
              <View className="flex-row justify-between pt-2.5">
                <Text className="text-slate-900 text-sm font-extrabold">Net Refund Amount:</Text>
                <Text className="text-emerald-600 text-sm font-extrabold">₹{netRefund.toLocaleString('en-IN')}</Text>
              </View>
            </View>

            {/* Action button */}
            <View className="mt-8">
              <Button
                label="Complete Return & Refund"
                loading={loading}
                onPress={handleCompleteReturn}
              />
            </View>
          </View>
        ) : (
          // ================= STEP 2: VEHICLE DISPATCH =================
          <View className="p-6">
            {/* Success Celebration Card */}
            <View className="items-center py-8 bg-emerald-50/50 border border-emerald-100/50 rounded-3xl mb-8">
              <View className="w-16 h-16 rounded-full bg-emerald-500 items-center justify-center mb-4 shadow-sm shadow-emerald-200">
                <Feather name="check" size={32} color="#FFF" />
              </View>
              <Text className="text-slate-900 font-extrabold text-lg tracking-tight">Deposit Settled!</Text>
              <Text className="text-slate-500 text-xs mt-1 text-center max-w-[200px]">
                ₹{netRefund.toLocaleString('en-IN')} has been refunded to the customer.
              </Text>
            </View>

            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-4">
              Where would you like to direct the vehicle next?
            </Text>

            {/* Vehicle Routing Layout */}
            {/* Available (1st, full width) */}
            <TouchableOpacity
              onPress={() => setNextState('Available')}
              style={{ 
                backgroundColor: nextState === 'Available' ? '#0F172A' : '#F8FAFC',
                borderColor: nextState === 'Available' ? '#0F172A' : '#F1F5F9',
                borderWidth: 1 
              }}
              className="w-full p-4 rounded-2xl flex-row items-center justify-between mb-4 shadow-sm"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-emerald-500/10 items-center justify-center mr-3">
                  <Feather name="check-circle" size={18} color="#059669" />
                </View>
                <View>
                  <Text className={`font-extrabold text-sm ${nextState === 'Available' ? 'text-white' : 'text-slate-800'}`}>🚗 Mark as Available</Text>
                  <Text className="text-slate-400 text-[9px] mt-0.5">Ready for next customer booking immediately</Text>
                </View>
              </View>
              {nextState === 'Available' && <Feather name="check" size={16} color="#FFF" />}
            </TouchableOpacity>

            {/* Cleaning & Service (side-by-side in same line) */}
            <View className="flex-row space-x-3 mb-8">
              {/* Cleaning */}
              <TouchableOpacity
                onPress={() => setNextState('Cleaning')}
                style={{ 
                  backgroundColor: nextState === 'Cleaning' ? '#0F172A' : '#F8FAFC',
                  borderColor: nextState === 'Cleaning' ? '#0F172A' : '#F1F5F9',
                  borderWidth: 1,
                  flex: 1 
                }}
                className="p-4 rounded-2xl items-center justify-center shadow-sm"
                activeOpacity={0.7}
              >
                <View className="w-8 h-8 rounded-lg bg-blue-500/10 items-center justify-center mb-2">
                  <Feather name="droplet" size={16} color="#3B82F6" />
                </View>
                <Text className={`font-extrabold text-xs ${nextState === 'Cleaning' ? 'text-white' : 'text-slate-800'}`}>🧹 Cleaning</Text>
                <Text className="text-slate-400 text-[8px] mt-0.5 text-center">Washing & vacuum bay</Text>
              </TouchableOpacity>

              {/* Service */}
              <TouchableOpacity
                onPress={() => setNextState('Maintenance')}
                style={{ 
                  backgroundColor: nextState === 'Maintenance' ? '#0F172A' : '#F8FAFC',
                  borderColor: nextState === 'Maintenance' ? '#0F172A' : '#F1F5F9',
                  borderWidth: 1,
                  flex: 1 
                }}
                className="p-4 rounded-2xl items-center justify-center shadow-sm"
                activeOpacity={0.7}
              >
                <View className="w-8 h-8 rounded-lg bg-red-500/10 items-center justify-center mb-2">
                  <Feather name="tool" size={16} color="#EF4444" />
                </View>
                <Text className={`font-extrabold text-xs ${nextState === 'Maintenance' ? 'text-white' : 'text-slate-800'}`}>🔧 Service</Text>
                <Text className="text-slate-400 text-[8px] mt-0.5 text-center">Workshop repairs</Text>
              </TouchableOpacity>
            </View>

            {/* Done action button */}
            <Button
              label="Done & Dispatch Vehicle"
              loading={loading}
              onPress={handleDoneRedirect}
            />
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
