import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PackageSearch } from 'lucide-react-native';
import { COLORS, SPACING } from '../../lib/theme';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => (
  <View style={styles.container}>
    <View style={styles.iconContainer}>
      {icon || <PackageSearch size={56} color={COLORS.gray300} />}
    </View>
    <Text style={styles.title}>{title}</Text>
    {description && <Text style={styles.description}>{description}</Text>}
    {actionLabel && onAction && (
      <Button title={actionLabel} onPress={onAction} style={{ marginTop: SPACING.lg }} />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  iconContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.gray100, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.gray700, textAlign: 'center', marginBottom: 8 },
  description: { fontSize: 14, color: COLORS.gray500, textAlign: 'center', lineHeight: 22 },
});
