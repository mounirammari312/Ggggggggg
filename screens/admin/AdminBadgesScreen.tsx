import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle, X, Clock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../lib/theme';
import { AppHeader } from '../../components/common/AppHeader';
import { BadgeIcon } from '../../components/common/BadgeIcon';
import { StatusBadge } from '../../components/common/StatusBadge';

const BADGE_REQUESTS = [
  { id: 'br1', supplier: 'شركة الجزائر للتكنولوجيا', badge: 'freeShipping', status: 'pending', date: '2024-03-15', price: 8000 },
  { id: 'br2', supplier: 'مؤسسة البناء الحديث', badge: 'premium', status: 'pending', date: '2024-03-14', price: 15000 },
  { id: 'br3', supplier: 'مجمع الغذاء الوطني', badge: 'bestSeller', status: 'approved', date: '2024-03-10', price: 10000 },
  { id: 'br4', supplier: 'نسيج المغرب العربي', badge: 'qualityGuaranteed', status: 'pending', date: '2024-03-13', price: 12000 },
];

export default function AdminBadgesScreen() {
  const { t } = useTranslation();
  const [requests, setRequests] = useState(BADGE_REQUESTS);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    Alert.alert(t('common.success'), 'تم موافقة طلب الشارة');
  };

  const handleReject = (id: string) => {
    Alert.alert(
      t('admin.reject'),
      'هل تريد رفض هذا الطلب؟',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('admin.reject'), onPress: () => setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r)), style: 'destructive' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title={t('admin.badges')} showBack />
      <View style={styles.filterBar}>
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
              {f === 'all' ? 'الكل' : t(`common.status.${f}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        renderItem={({ item }) => (
          <View style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <BadgeIcon type={item.badge as any} size={36} />
              <View style={styles.requestInfo}>
                <Text style={styles.requestSupplier}>{item.supplier}</Text>
                <Text style={styles.requestBadge}>{t(`badges.${item.badge}`)}</Text>
                <Text style={styles.requestDate}>{item.date}</Text>
              </View>
              <View style={styles.requestRight}>
                <StatusBadge status={item.status as any} label={t(`common.status.${item.status}`)} size="sm" />
                <Text style={styles.requestPrice}>{item.price.toLocaleString()} د.ج</Text>
              </View>
            </View>
            {item.status === 'pending' && (
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.approveBtn} onPress={() => handleApprove(item.id)}>
                  <CheckCircle size={16} color={COLORS.success} />
                  <Text style={styles.approveBtnText}>{t('admin.approve')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(item.id)}>
                  <X size={16} color={COLORS.error} />
                  <Text style={styles.rejectBtnText}>{t('admin.reject')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  filterBar: { flexDirection: 'row', backgroundColor: COLORS.white, padding: SPACING.md, gap: 6, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  filterTab: { flex: 1, paddingVertical: 8, borderRadius: RADIUS.lg, alignItems: 'center', backgroundColor: COLORS.gray100 },
  filterTabActive: { backgroundColor: COLORS.primary },
  filterTabText: { fontSize: 11, color: COLORS.gray600, fontWeight: '600' },
  filterTabTextActive: { color: COLORS.white },
  requestCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: 12, ...SHADOW.sm },
  requestHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  requestInfo: { flex: 1 },
  requestSupplier: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  requestBadge: { fontSize: 12, color: COLORS.primary, marginTop: 2 },
  requestDate: { fontSize: 11, color: COLORS.gray400, marginTop: 2 },
  requestRight: { alignItems: 'flex-end', gap: 4 },
  requestPrice: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  actionRow: { flexDirection: 'row', gap: 10 },
  approveBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.successLight, borderRadius: RADIUS.lg, paddingVertical: 10 },
  approveBtnText: { fontSize: 13, color: COLORS.success, fontWeight: '700' },
  rejectBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.errorLight, borderRadius: RADIUS.lg, paddingVertical: 10 },
  rejectBtnText: { fontSize: 13, color: COLORS.error, fontWeight: '700' },
});
