import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface SignaturePadProps {
  customerName: string;
  onSign: (signatureUri: string) => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ customerName, onSign }) => {
  const [signed, setSigned] = useState(false);

  const handleSignTap = () => {
    setSigned(true);
    onSign(`sig_${customerName.toLowerCase().replace(/\s+/g, '_')}`);
  };

  const handleClear = () => {
    setSigned(false);
  };

  return (
    <View className="border border-slate-200 rounded-xl bg-slate-50 overflow-hidden mb-4">
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-slate-100 bg-white">
        <Text className="text-slate-800 text-xs font-semibold uppercase tracking-wider">
          Digital Signature Pad
        </Text>
        {signed && (
          <TouchableOpacity onPress={handleClear} activeOpacity={0.7} className="flex-row items-center">
            <Feather name="refresh-cw" size={12} color="#DC2626" />
            <Text className="text-red-600 text-xs font-semibold ml-1">Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity
        onPress={handleSignTap}
        activeOpacity={signed ? 1 : 0.9}
        className="h-40 items-center justify-center relative p-4"
      >
        {signed ? (
          <View className="items-center justify-center">
            {/* Cursive Signature Representation */}
            <Text className="text-4xl text-slate-800 tracking-wider font-light italic" style={{ fontFamily: 'serif' }}>
              {customerName}
            </Text>
            <View className="w-48 h-0.5 bg-slate-400 mt-2 rotate-[-1deg]" />
            <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-3">
              Signed Electronically
            </Text>
          </View>
        ) : (
          <View className="items-center justify-center space-y-2">
            <Feather name="edit-3" size={24} color="#64748B" />
            <Text className="text-slate-500 text-xs font-medium mt-1">
              Tap inside this box to sign as {customerName}
            </Text>
            <Text className="text-slate-400 text-[10px] uppercase tracking-widest">
              Secured by DriveDesk
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};
