import React from 'react';
import { View, Text } from 'react-native';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let badgeStyle = 'px-2.5 py-1 rounded-full border text-xs font-semibold';
  
  const normalized = status.trim().toLowerCase();

  if (normalized.startsWith('hold')) {
    badgeStyle += ' bg-purple-50 text-purple-700 border-purple-100';
  } else {
    switch (normalized) {
      // Green (Success / Good)
      case 'available':
      case 'ready':
      case 'verified':
      case 'completed':
      case 'paid':
      case 'good customer':
      case 'excellent':
        badgeStyle += ' bg-emerald-50 text-emerald-700 border-emerald-100';
        break;
      
      // Amber/Yellow (Warning / Pending)
      case 'reserved':
      case 'returning today':
      case 'pending':
      case 'pending documents':
      case 'pending inspection':
      case 'pending signature':
      case 'uploaded':
        badgeStyle += ' bg-amber-50 text-amber-700 border-amber-100';
        break;
      
      // Blue (Active Info)
      case 'picked up':
      case 'active':
      case 'in service':
        badgeStyle += ' bg-blue-50 text-blue-700 border-blue-100';
        break;
      
      // Red (Danger / Blocked)
      case 'maintenance':
      case 'flagged':
      case 'rejected':
      case 'cancelled':
      case 'late returner':
        badgeStyle += ' bg-red-50 text-red-700 border-red-100';
        break;
      
      // Grayscale (Neutral / Idle)
      case 'cleaning':
      case 'transfer':
      case 'not uploaded':
      default:
        badgeStyle += ' bg-slate-50 text-slate-600 border-slate-200';
        break;
    }
  }

  return (
    <View className="items-start">
      <Text className={badgeStyle}>{status}</Text>
    </View>
  );
};
