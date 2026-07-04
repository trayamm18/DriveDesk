import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFleetStore } from '@/store/useFleetStore';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Feather } from '@expo/vector-icons';

export default function BookingDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { bookings, customers, vehicles, updateBooking, addPayment, showToast } = useFleetStore();

  const booking = bookings.find((b) => b.id === id);
  const customer = booking ? customers.find((c) => c.id === booking.customerId) : null;
  const vehicle = booking ? vehicles.find((v) => v.id === booking.vehicleId) : null;

  const [refunding, setRefunding] = useState(false);
  const [returning, setReturning] = useState(false);
 
  // Extension Modal State
  const [showExtend, setShowExtend] = useState(false);
  const [extensionDays, setExtensionDays] = useState('1');
  const [extending, setExtending] = useState(false);
 
  // Late Fees Modal State
  const [showLateFees, setShowLateFees] = useState(false);
  const [feeDesc, setFeeDesc] = useState('');
  const [feeAmount, setFeeAmount] = useState('');
  const [applyingFee, setApplyingFee] = useState(false);
 


  if (!booking) {
    return (
      <SafeAreaView style={{ flex: 1 }} className="bg-white justify-center items-center px-6">
        <Text className="text-xl font-bold text-slate-800">Booking not found</Text>
        <Button label="Go Back" onPress={() => router.back()} className="mt-4" />
      </SafeAreaView>
    );
  }

  // Calculate financials
  const advancePaid = booking.payments
    .filter(p => p.type === 'Advance' && p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const depositPaid = booking.payments
    .filter(p => p.type === 'Deposit' && p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const refundedDeposit = booking.payments
    .filter(p => p.type === 'Refund' && p.status === 'Refunded')
    .reduce((sum, p) => sum + p.amount, 0);

  // Return vehicle simulation
  const handleCheckInReturn = () => {
    setReturning(true);
    setTimeout(() => {
      setReturning(false);
      // Update booking to Completed
      updateBooking(booking.id, { status: 'Completed', endOdometer: (vehicle?.odometer || 0) + 240 });
      // Update vehicle to Cleaning status by default initially
      if (vehicle) {
        useFleetStore.getState().updateVehicleStatus(vehicle.id, 'Cleaning');
      }
      showToast('Vehicle checked in. Ready for settlement.', 'success');
    }, 1000);
  };
 
  const handleConfirmExtension = () => {
    const daysVal = Number(extensionDays);
    if (isNaN(daysVal) || daysVal <= 0) {
      showToast('Please enter a valid number of days.', 'error');
      return;
    }
    setExtending(true);
    setTimeout(() => {
      setExtending(false);
      const dailyRate = 4000;
      const extCost = daysVal * dailyRate;
      
      const endD = new Date(booking.endDate);
      endD.setDate(endD.getDate() + daysVal);
      const newEndDateStr = endD.toISOString().split('T')[0];
 
      updateBooking(booking.id, {
        endDate: newEndDateStr,
        totalAmount: booking.totalAmount + extCost
      });
 
      addPayment(booking.id, {
        type: 'Advance',
        amount: extCost,
        method: 'UPI',
        status: 'Paid'
      });
 
      setShowExtend(false);
      showToast(`Booking extended by ${daysVal} days! Charge: ₹${extCost}`, 'success');
    }, 800);
  };
 
  const handleApplyLateFees = () => {
    const amountVal = Number(feeAmount);
    if (!feeDesc.trim() || isNaN(amountVal) || amountVal <= 0) {
      showToast('Please enter description and valid amount.', 'error');
      return;
    }
    setApplyingFee(true);
    setTimeout(() => {
      setApplyingFee(false);
 
      updateBooking(booking.id, {
        totalAmount: booking.totalAmount + amountVal
      });
 
      addPayment(booking.id, {
        type: 'Advance',
        amount: amountVal,
        method: 'Cash',
        status: 'Paid'
      });
 
      setShowLateFees(false);
      setFeeDesc('');
      setFeeAmount('');
      showToast(`Fee of ₹${amountVal} applied to booking.`, 'success');
    }, 800);
  };
 


  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      {/* Custom Header */}
      <View className="flex-row justify-between items-center px-6 py-4 border-b border-slate-50 bg-white">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="w-10 h-10 border border-slate-100 rounded-xl items-center justify-center">
          <Feather name="arrow-left" size={16} color="#0F172A" />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Rental Booking</Text>
          <Text className="text-slate-900 font-extrabold text-sm tracking-tight mt-0.5">{booking.id}</Text>
        </View>
        <View className="w-10 h-10" />
      </View>

      <ScrollView className="flex-grow" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        <View className="px-6 pt-5">
          {/* Main Status */}
          <View className="flex-row justify-between items-center pb-5 border-b border-slate-50">
            <View>
              <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">Booking Status</Text>
              <View className="mt-1">
                <StatusBadge status={booking.status} />
              </View>
            </View>
            <Text className="text-slate-900 font-extrabold text-lg">
              ₹{booking.totalAmount.toLocaleString('en-IN')}
            </Text>
          </View>

          {/* DATES */}
          <View className="py-5 border-b border-slate-50">
            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-3">Rental Duration</Text>
            <View className="flex-row justify-between">
              <View className="flex-1">
                <Text className="text-slate-400 text-[9px] font-bold uppercase">Pickup</Text>
                <Text className="text-slate-800 text-xs font-bold mt-0.5">{booking.startDate}</Text>
                <Text className="text-slate-500 text-[10px] mt-0.5">{booking.pickupBranch}</Text>
              </View>
              <View className="w-8 items-center justify-center">
                <Feather name="arrow-right" size={12} color="#64748B" />
              </View>
              <View className="flex-1 items-end">
                <Text className="text-slate-400 text-[9px] font-bold uppercase">Return</Text>
                <Text className="text-slate-800 text-xs font-bold mt-0.5">{booking.endDate}</Text>
                <Text className="text-slate-500 text-[10px] mt-0.5">{booking.returnBranch}</Text>
              </View>
            </View>
          </View>

          {/* VEHICLE LINK */}
          <View className="py-5 border-b border-slate-50">
            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-3">Rented Vehicle</Text>
            {vehicle ? (
              <TouchableOpacity
                onPress={() => router.push(`/vehicle/${vehicle.id}`)}
                activeOpacity={0.7}
                className="flex-row items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl"
              >
                <View>
                  <Text className="text-slate-800 text-xs font-bold">{vehicle.model}</Text>
                  <Text className="text-slate-400 text-[10px] font-semibold uppercase mt-0.5">{vehicle.registrationNumber}</Text>
                </View>
                <Feather name="chevron-right" size={14} color="#64748B" />
              </TouchableOpacity>
            ) : (
              <Text className="text-slate-400 text-xs italic">Vehicle info unavailable</Text>
            )}
          </View>

          {/* CUSTOMER LINK */}
          <View className="py-5 border-b border-slate-50">
            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-3">Customer Information</Text>
            {customer ? (
              <TouchableOpacity
                onPress={() => router.push(`/customer/${customer.id}`)}
                activeOpacity={0.7}
                className="flex-row items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl"
              >
                <View>
                  <Text className="text-slate-800 text-xs font-bold">{customer.name}</Text>
                  <Text className="text-slate-400 text-[10px] font-semibold mt-0.5">+91 {customer.phone}</Text>
                </View>
                <Feather name="chevron-right" size={14} color="#64748B" />
              </TouchableOpacity>
            ) : (
              <Text className="text-slate-400 text-xs italic">Customer info unavailable</Text>
            )}
          </View>

          {/* FINANCIALS & PAYMENTS LOG */}
          <View className="py-5 border-b border-slate-50">
            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-3">Payment Receipts & Ledgers</Text>
            
            <View className="space-y-2">
              <View className="flex-row justify-between py-1">
                <Text className="text-slate-500 text-xs font-medium">Rental Charges (Advance):</Text>
                <Text className="text-slate-800 text-xs font-bold">₹{advancePaid.toLocaleString('en-IN')}</Text>
              </View>
              <View className="flex-row justify-between py-1">
                <Text className="text-slate-500 text-xs font-medium">Security Deposit:</Text>
                <Text className="text-slate-800 text-xs font-bold">₹{depositPaid.toLocaleString('en-IN')}</Text>
              </View>
              {refundedDeposit > 0 && (
                <View className="flex-row justify-between py-1">
                  <Text className="text-emerald-600 text-xs font-medium">Deposit Refunded:</Text>
                  <Text className="text-emerald-700 text-xs font-bold">- ₹{refundedDeposit.toLocaleString('en-IN')}</Text>
                </View>
              )}
            </View>

            {/* List payments */}
            <View className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2 mt-4">
              <Text className="text-slate-800 text-[10px] font-extrabold uppercase tracking-wider mb-1">Receipt Logs</Text>
              {booking.payments.map((p) => (
                <View key={p.id} className="flex-row justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
                  <View>
                    <Text className="text-slate-800 text-xs font-bold">{p.type} via {p.method}</Text>
                    <Text className="text-slate-400 text-[9px] mt-0.5">{p.date} • {p.receiptNumber}</Text>
                  </View>
                  <Text className={`text-xs font-bold ${p.type === 'Refund' ? 'text-emerald-700' : 'text-slate-900'}`}>
                    {p.type === 'Refund' ? '-' : ''}₹{p.amount}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* ACTIVE OPERATIONS */}
          <View className="pt-6 space-y-3">
            {booking.status === 'Active' && (
              <View>
                <Button
                  label="Process Return Check-In"
                  loading={returning}
                  onPress={handleCheckInReturn}
                />
                <View className="flex-row space-x-2 mt-2">
                  <View className="flex-1">
                    <Button
                      label="Extend Booking"
                      variant="outline"
                      size="sm"
                      onPress={() => setShowExtend(true)}
                    />
                  </View>
                  <View className="flex-1">
                    <Button
                      label="Apply Fines/Fees"
                      variant="outline"
                      size="sm"
                      onPress={() => setShowLateFees(true)}
                    />
                  </View>
                </View>
              </View>
            )}
            
            {booking.status === 'Completed' && depositPaid > 0 && refundedDeposit === 0 && (
              <Button
                label="Process Settlement & Refund"
                variant="solid"
                onPress={() => router.push(`/booking/${booking.id}/settle`)}
              />
            )}
 
            <Button
              label="Download Agreement PDF"
              variant="muted"
              icon={<Feather name="download" size={14} color="#475569" />}
              onPress={() => showToast('Agreement PDF downloaded.', 'success')}
            />
          </View>
 
          {/* MODALS */}
          {/* 1. EXTEND BOOKING */}
          <Modal
            visible={showExtend}
            onClose={() => setShowExtend(false)}
            title="Extend Rental Period"
            primaryActionLabel="Confirm Extension"
            onPrimaryAction={handleConfirmExtension}
            primaryActionLoading={extending}
            secondaryActionLabel="Cancel"
          >
            <View className="space-y-4 py-2">
              <Text className="text-slate-500 text-xs leading-relaxed">
                Enter additional days for rental. Rate is ₹4,000/day, which will be charged as an advance payment.
              </Text>
              <Input
                label="Additional Days"
                placeholder="e.g. 1"
                value={extensionDays}
                onChangeText={setExtensionDays}
                keyboardType="numeric"
              />
              <View className="bg-slate-50 p-3.5 border border-slate-100 rounded-xl mt-2 flex-row justify-between">
                <Text className="text-slate-600 text-xs font-semibold">Total Cost:</Text>
                <Text className="text-slate-900 text-xs font-extrabold">₹{((Number(extensionDays) || 0) * 4000).toLocaleString('en-IN')}</Text>
              </View>
            </View>
          </Modal>
 
          {/* 2. APPLY FINES / LATE FEES */}
          <Modal
            visible={showLateFees}
            onClose={() => setShowLateFees(false)}
            title="Apply Fines / Charges"
            primaryActionLabel="Apply Charge"
            onPrimaryAction={handleApplyLateFees}
            primaryActionLoading={applyingFee}
            secondaryActionLabel="Cancel"
          >
            <View className="space-y-4 py-2">
              <Text className="text-slate-500 text-xs leading-relaxed">
                Add extra penalties (such as late return fees, speeding fines, or toll charges) directly to the booking invoice.
              </Text>
              <Input
                label="Charge Reason / Description"
                placeholder="e.g. Late return penalty"
                value={feeDesc}
                onChangeText={setFeeDesc}
              />
              <Input
                label="Charge Amount (INR)"
                placeholder="e.g. 1500"
                value={feeAmount}
                onChangeText={setFeeAmount}
                keyboardType="numeric"
              />
            </View>
          </Modal>
 


        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
