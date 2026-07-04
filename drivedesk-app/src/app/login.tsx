import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useFleetStore } from '@/store/useFleetStore';
import { Feather } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const loginFn = useFleetStore((state) => state.login);
  const showToast = useFleetStore((state) => state.showToast);

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>({});

  const handleLogin = () => {
    Keyboard.dismiss();
    const newErrors: typeof errors = {};

    if (!phone) {
      newErrors.phone = 'Phone number is required';
    } else if (phone.length < 10) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    // Simulate Network Request
    setTimeout(() => {
      setLoading(false);
      
      if (password === '1234') {
        // Log in as Owner
        loginFn(phone, 'Owner', 'Rahul Sharma (Owner)');
        showToast('Welcome back, Rahul.', 'success');
        router.replace('/(owner)');
      } else if (password === '1111') {
        // Log in as Agent
        loginFn(phone, 'Agent', 'Amit Verma (Agent)');
        showToast('Signed in successfully.', 'success');
        router.replace('/(agent)');
      } else {
        showToast('Incorrect password. Try 1234 (Owner) or 1111 (Agent).', 'error');
      }
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
          <View className="flex-1 justify-center py-12">
            
            {/* Header branding */}
            <View className="mb-10 items-center">
              <View className="w-16 h-16 bg-slate-950 rounded-2xl items-center justify-center shadow-md mb-4 rotate-45">
                <View className="-rotate-45">
                  <Feather name="navigation" size={26} color="#FFF" />
                </View>
              </View>
              <Text className="text-slate-900 text-3xl font-extrabold tracking-tight">
                DriveDesk
              </Text>
              <Text className="text-slate-500 text-base font-medium mt-1">
                Good to see you again.
              </Text>
            </View>

            {/* Inputs Form */}
            <View className="space-y-4">
              <Input
                label="Phone Number"
                placeholder="Enter 10-digit mobile number"
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                error={errors.phone}
                leftIcon={<Feather name="phone" size={16} color="#94A3B8" />}
              />

              <Input
                label="Password"
                placeholder="••••"
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                error={errors.password}
                leftIcon={<Feather name="lock" size={16} color="#94A3B8" />}
              />

              <View className="h-4" />

              <Button
                label="Login"
                loading={loading}
                onPress={handleLogin}
                size="lg"
              />
            </View>

          </View>

          {/* Footer branding */}
          <View className="py-6 items-center">
            <Text className="text-slate-400 text-xs font-semibold tracking-widest uppercase">
              Version 1.0.0
            </Text>
          </View>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
