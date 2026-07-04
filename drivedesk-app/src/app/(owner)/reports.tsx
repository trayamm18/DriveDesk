import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SkeletonDashboard } from '@/components/ui/Skeleton';
import { Feather } from '@expo/vector-icons';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Line } from 'react-native-svg';

export default function OwnerReports() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }} className="bg-white">
        <SkeletonDashboard />
      </SafeAreaView>
    );
  }

  // Sample SVG line path coordinates for a clean revenue graph
  // Dimensions for graph container: width=320, height=120
  const graphWidth = Dimensions.get('window').width - 48; // padding
  const graphHeight = 120;
  
  // Custom path passing EXACTLY through our points (10,110), (0.33,80), (0.66,95), (width-10,20)
  const pathData = `M 10,110 C ${graphWidth * 0.15},110 ${graphWidth * 0.2},80 ${graphWidth * 0.33},80 C ${graphWidth * 0.45},80 ${graphWidth * 0.55},95 ${graphWidth * 0.66},95 C ${graphWidth * 0.78},95 ${graphWidth * 0.88},20 ${graphWidth - 10},20`;
  const fillPathData = `${pathData} L ${graphWidth - 10},120 L 10,120 Z`;

  const topVehicles = [
    { model: 'Mahindra Thar', bookings: 24, revenue: '₹1,44,000', utilization: '92%' },
    { model: 'Hyundai Creta', bookings: 20, revenue: '₹1,20,000', utilization: '88%' },
    { model: 'Toyota Fortuner', bookings: 12, revenue: '₹1,08,000', utilization: '75%' },
    { model: 'Kia Seltos', bookings: 15, revenue: '₹90,000', utilization: '82%' },
  ];

  const idleVehicles = [
    { model: 'Maruti Swift', plate: 'KA-03-MJ-4321', idleDays: 8, location: 'Pune Airport' },
    { model: 'Tata Nexon', plate: 'MH-14-GH-1122', idleDays: 5, location: 'Deccan Gymkhana' },
    { model: 'Honda City', plate: 'MH-12-AS-1008', idleDays: 4, location: 'Pune Airport' },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      {/* Header */}
      <View className="px-6 pt-4 pb-4 border-b border-slate-50 bg-white">
        <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          Performance
        </Text>
        <Text className="text-slate-900 text-3xl font-extrabold tracking-tight mt-0.5">
          Reports
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-5" showsVerticalScrollIndicator={false}>
        
        {/* KPI Cards Grid */}
        <View className="space-y-4 mb-6">
          <View className="border border-slate-100 p-5 rounded-2xl bg-white shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Monthly Revenue
            </Text>
            <View className="flex-row items-baseline mt-1.5 space-x-2">
              <Text className="text-slate-900 text-2xl font-extrabold">
                ₹2,35,000
              </Text>
              <Text className="text-emerald-600 text-xs font-extrabold ml-1.5">
                ▲ 12%
              </Text>
            </View>
            <Text className="text-slate-400 text-[10px] font-semibold mt-1">
              Compared to last month (₹2,09,800)
            </Text>
          </View>

          <View className="flex-row justify-between">
            <View className="w-[48%] border border-slate-100 p-4 rounded-xl bg-white">
              <Text className="text-slate-400 text-[10px] font-bold uppercase">Utilization</Text>
              <Text className="text-slate-900 text-lg font-bold mt-1">84.2%</Text>
              <Text className="text-emerald-600 text-[10px] font-bold mt-0.5">▲ 4% vs last week</Text>
            </View>

            <View className="w-[48%] border border-slate-100 p-4 rounded-xl bg-white">
              <Text className="text-slate-400 text-[10px] font-bold uppercase">Active Bookings</Text>
              <Text className="text-slate-900 text-lg font-bold mt-1">18 Cars</Text>
              <Text className="text-red-600 text-[10px] font-bold mt-0.5">▼ 2% vs last month</Text>
            </View>
          </View>
        </View>

        {/* Chart Section */}
        <View className="mb-8 border border-slate-100 p-5 rounded-2xl bg-white">
          <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Weekly Revenue Trend
          </Text>

          <View className="items-center justify-center">
            <Svg width={graphWidth} height={graphHeight}>
              <Defs>
                <LinearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <Stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </LinearGradient>
              </Defs>

              {/* Gridlines */}
              <Line x1="10" y1="20" x2={graphWidth - 10} y2="20" stroke="#F1F5F9" strokeDasharray="4 4" strokeWidth="1" />
              <Line x1="10" y1="60" x2={graphWidth - 10} y2="60" stroke="#F1F5F9" strokeDasharray="4 4" strokeWidth="1" />
              <Line x1="10" y1="100" x2={graphWidth - 10} y2="100" stroke="#F1F5F9" strokeDasharray="4 4" strokeWidth="1" />
              <Line x1="10" y1="120" x2={graphWidth - 10} y2="120" stroke="#E2E8F0" strokeWidth="1" />

              {/* Gradient Area Fill */}
              <Path d={fillPathData} fill="url(#revenueGrad)" />

              {/* Thick Curve Line */}
              <Path
                d={pathData}
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Weekly Data Points */}
              <Circle cx={10} cy={110} r={4} fill="#FFFFFF" stroke="#10B981" strokeWidth="2.5" />
              <Circle cx={graphWidth * 0.33} cy={80} r={4} fill="#FFFFFF" stroke="#10B981" strokeWidth="2.5" />
              <Circle cx={graphWidth * 0.66} cy={95} r={4} fill="#FFFFFF" stroke="#10B981" strokeWidth="2.5" />
              
              {/* Pulsing glow point for Current Week */}
              <Circle cx={graphWidth - 10} cy={20} r={8} fill="#10B981" opacity="0.3" />
              <Circle cx={graphWidth - 10} cy={20} r={4.5} fill="#10B981" />
            </Svg>

            {/* X-Axis labels */}
            <View className="flex-row justify-between w-full mt-3 px-2 border-t border-slate-50 pt-2">
              <Text className="text-slate-400 text-[10px] font-bold">Week 1</Text>
              <Text className="text-slate-400 text-[10px] font-bold">Week 2</Text>
              <Text className="text-slate-400 text-[10px] font-bold">Week 3</Text>
              <Text className="text-slate-900 text-[10px] font-bold">Week 4 (Current)</Text>
            </View>
          </View>
        </View>

        {/* Top Cars Table */}
        <View className="mb-8">
          <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-3">
            Top Performing Cars
          </Text>
          <View className="border border-slate-100 rounded-xl overflow-hidden bg-white">
            {topVehicles.map((vehicle, index) => (
              <View 
                key={vehicle.model} 
                className={`p-4 flex-row justify-between items-center ${index < topVehicles.length - 1 ? 'border-b border-slate-50' : ''}`}
              >
                <View>
                  <Text className="text-slate-800 text-xs font-bold">{vehicle.model}</Text>
                  <Text className="text-slate-400 text-[10px] font-semibold mt-0.5">
                    {vehicle.bookings} bookings • {vehicle.utilization} utilization
                  </Text>
                </View>
                <Text className="text-slate-900 text-xs font-bold">
                  {vehicle.revenue}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Idle Cars Table */}
        <View className="mb-12">
          <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-3">
            Idle Vehicles
          </Text>
          <View className="border border-slate-100 rounded-xl overflow-hidden bg-white">
            {idleVehicles.map((vehicle, index) => (
              <View 
                key={vehicle.plate} 
                className={`p-4 flex-row justify-between items-center ${index < idleVehicles.length - 1 ? 'border-b border-slate-50' : ''}`}
              >
                <View>
                  <Text className="text-slate-800 text-xs font-bold">{vehicle.model}</Text>
                  <Text className="text-slate-400 text-[10px] font-semibold mt-0.5 uppercase tracking-wide">
                    {vehicle.plate} • {vehicle.location}
                  </Text>
                </View>
                <View className="bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
                  <Text className="text-red-700 text-[10px] font-bold">
                    Idle {vehicle.idleDays} Days
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
