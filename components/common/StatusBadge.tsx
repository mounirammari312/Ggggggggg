import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../lib/theme';

type Status = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'active' | 'inactive' | 'approved' | 'rejected' | 'negotiating' | 'accepted';

interface StatusBadgeProps {
  status: Status;
  label: string;
  size?: 'sm' | 'md';
}

const STATUS_COLORS: Record<Status, { bg: string; text: string }> = {
  pending: { bg: COLORS.warningLight, text: COLORS.warning },
  processing: { bg: COLORS.infoLight, text: COLORS.info },
  shipped: { bg: '#E0F2FE', text: '#0284C7' },
  delivered: { bg: COLORS.successLight, text: COLORS.success },
  cancelled: { bg: COLORS.errorLight, text: COLORS.error },
  active: { bg: COLORS.successLight, text: COLORS.success },
  inactive: { bg: COLORS.gray100, text: COLORS.gray500 },
  approved: { bg: COLORS.successLight, text: COLORS.success },
  rejected: { bg: COLORS.errorLight, text: COLORS.error },
  negotiating: { bg: '#F3E8FF', text: '#7C3AED' },
  accepted: { bg: COLORS.successLight, text: COLORS.success },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'md' }) => {
  const colors = STATUS_COLORS[status] || { bg: COLORS.gray100, text: COLORS.gray500 };
  return (
    <View style={[styles.container, { backgroundColor: colors.bg }, size === 'sm' && styles.sm]}>
      <Text style={[styles.text, { color: colors.text }, size === 'sm' && styles.smText]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  sm: { paddingHorizontal: 8, paddingVertical: 3 },
  text: { fontSize: 13, fontWeight: '600' },
  smText: { fontSize: 11 },
});
