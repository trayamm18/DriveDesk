import React from 'react';
import { View, Text, Modal as RNModal, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Button } from './Button';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  primaryActionLoading?: boolean;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  danger?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  primaryActionLabel,
  onPrimaryAction,
  primaryActionLoading = false,
  secondaryActionLabel,
  onSecondaryAction,
  danger = false,
}) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 justify-center items-center px-5">
        <View className="bg-white w-full max-w-sm rounded-2xl overflow-hidden border border-slate-100 shadow-xl">
          {/* Header */}
          <View className="flex-row justify-between items-center px-5 py-4 border-b border-slate-100">
            <Text className="text-slate-900 font-bold text-base tracking-wide">
              {title}
            </Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Feather name="x" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView className="max-h-80 p-5">
            <View>{children}</View>
          </ScrollView>

          {/* Footer */}
          {(primaryActionLabel || secondaryActionLabel) && (
            <View className="flex-row items-center justify-end px-5 py-4 border-t border-slate-50 space-x-2 bg-slate-50/50">
              {secondaryActionLabel && (
                <Button
                  label={secondaryActionLabel}
                  variant="ghost"
                  size="sm"
                  onPress={onSecondaryAction || onClose}
                />
              )}
              {primaryActionLabel && (
                <Button
                  label={primaryActionLabel}
                  variant={danger ? 'danger' : 'solid'}
                  size="sm"
                  loading={primaryActionLoading}
                  onPress={onPrimaryAction}
                />
              )}
            </View>
          )}
        </View>
      </View>
    </RNModal>
  );
};
