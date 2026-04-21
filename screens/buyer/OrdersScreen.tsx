import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Package, Truck, CheckCircle, Clock, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../lib/theme';
import { useAppStore } from '../../lib/store';
import { MOCK_ORDERS } from '../../lib/mockData';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { AppHeader } from '../../components/common/AppHeader';

const STATUS_TABS = ['all', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrdersScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { formatPrice } = useAppStore();
  const [activeStatus, setActiveStatus] = useState('all');

  const filtered = activeStatus === 'all'
    ? MOCK_ORDERS
    : MOCK_ORDERS.filter(o => o.status === activeStatus);

  const STATUS_ICONS: Record<string, any> = {
    pending: <Clock size={20} color={COLORS.warning} />,
    processing: <Package size={20} color={COLORS.info} />,
    shipped: <Truck size={20} color={COLORS.info} />,
    delivered: <CheckCircle size={20} color={COLORS.success} />,
    cancelled: <X size={20} color={COLORS.error} />,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title={t('buyer.myOrders')} showBack />
      {/* Status Filter */}
      <View style={styles.filterBar}>
        <FlatList
          data={STATUS_TABS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={{ gap: 8, paddingHorizontal: SPACING.lg }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterTab, activeStatus === item && styles.filterTabActive]}
              onPress={() => setActiveStatus(item)}
            >
              <Text style={[styles.filterTabText, activeStatus === item && styles.filterTabTextActive]}>
                {item === 'all' ? 'الكل' : t(`common.status.${item}`)}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      {filtered.length === 0 ? (
        <EmptyState title="لا توجد طلبات" description="لم تقم بأي طلبات بعد" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: SPACING.lg }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.orderCard}
              onPress={() => (navigation as any).navigate('OrderDetail', { orderId: item.id })}
            >
              <View style={styles.orderHeader}>
                <View style={styles.orderIconWrapper}>
                  {STATUS_ICONS[item.status] || <Package size={20} color={COLORS.gray400} />}
                </View>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderId}>طلب #{item.id.toUpperCase()}</Text>
                  <Text style={styles.orderDate}>{item.created_at}</Text>
                </View>
                <StatusBadge status={item.status as any} label={t(`common.status.${item.status}`)} size="sm" />
              </View>
              <View style={styles.orderFooter}>
                <Text style={styles.orderItems}>{item.items.length} عناصر</Text>
                <Text style={styles.orderTotal}>{formatPrice(item.total)}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  filterBar: { backgroundColor: COLORS.white, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  filterTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.gray100, borderWidth: 1, borderColor: COLORS.border },
  filterTabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterTabText: { fontSize: 13, color: COLORS.gray600, fontWeight: '500' },
  filterTabTextActive: { color: COLORS.white },
  orderCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: 12, ...SHADOW.sm },
  orderHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  orderIconWrapper: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.gray100, alignItems: 'center', justifyContent: 'center' },
  orderInfo: { flex: 1 },
  orderId: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  orderDate: { fontSize: 12, color: COLORS.gray500, marginTop: 2 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border },
  orderItems: { fontSize: 13, color: COLORS.gray600 },
  orderTotal: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
});
