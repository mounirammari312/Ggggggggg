import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Users, Store, Package, ShoppingBag, Award, Megaphone,
  BarChart2, Settings, TrendingUp, AlertCircle, CheckCircle,
  Clock, Bell,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../lib/theme';
import { useAppStore } from '../../lib/store';
import { MOCK_ANALYTICS } from '../../lib/mockData';

const { width } = Dimensions.get('window');

export default function AdminDashboardScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { formatPrice } = useAppStore();

  const PLATFORM_STATS = [
    { label: t('admin.totalUsers'), value: '2,847', trend: '+12%', color: COLORS.primary, icon: <Users size={20} color={COLORS.white} /> },
    { label: 'موردون', value: '234', trend: '+8%', color: COLORS.success, icon: <Store size={20} color={COLORS.white} /> },
    { label: t('admin.totalOrders'), value: '8,912', trend: '+23%', color: COLORS.gold, icon: <ShoppingBag size={20} color={COLORS.primary} /> },
    { label: t('admin.totalRevenue'), value: '2.4M د.ج', trend: '+18%', color: '#8B5CF6', icon: <TrendingUp size={20} color={COLORS.white} /> },
  ];

  const ADMIN_MENU = [
    { icon: <Users size={22} color={COLORS.primary} />, label: t('admin.users'), screen: 'AdminUsers', badge: 12, color: '#EFF6FF' },
    { icon: <Store size={22} color={COLORS.success} />, label: t('admin.suppliers'), screen: 'AdminSuppliers', badge: 5, color: '#F0FDF4' },
    { icon: <Package size={22} color={COLORS.gold} />, label: t('admin.products'), screen: 'AdminProducts', badge: 0, color: '#FFFBEB' },
    { icon: <ShoppingBag size={22} color='#8B5CF6' />, label: t('admin.orders'), screen: 'AdminOrders', badge: 3, color: '#F5F3FF' },
    { icon: <Award size={22} color={COLORS.gold} />, label: t('admin.badges'), screen: 'AdminBadges', badge: 4, color: '#FFFBEB' },
    { icon: <Megaphone size={22} color={COLORS.error} />, label: t('admin.ads'), screen: 'AdminAds', badge: 2, color: '#FEF2F2' },
    { icon: <BarChart2 size={22} color={COLORS.info} />, label: t('admin.analytics'), screen: 'AdminAnalytics', badge: 0, color: '#EFF6FF' },
    { icon: <Settings size={22} color={COLORS.gray500} />, label: t('admin.settings'), screen: 'Settings', badge: 0, color: COLORS.gray100 },
  ];

  const PENDING_ACTIONS = [
    { id: 1, type: 'badge', title: 'طلب شارة جديد', desc: 'شركة الجزائر للتكنولوجيا → شارة الشحن المجاني', time: 'منذ ساعتين', urgent: true },
    { id: 2, type: 'supplier', title: 'تسجيل مورد جديد', desc: 'طلب تسجيل شركة جديدة', time: 'منذ 4 ساعات', urgent: false },
    { id: 3, type: 'ad', title: 'طلب إعلان', desc: 'بانر رئيسي لمجمع الغذاء الوطني', time: 'منذ يوم', urgent: false },
    { id: 4, type: 'badge', title: 'طلب شارة مميز', desc: 'مؤسسة البناء الحديث → شارة الجودة', time: 'منذ يومين', urgent: false },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={['#0F2238', COLORS.primary]} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerRole}>لوحة المدير</Text>
              <Text style={styles.headerTitle}>{t('admin.dashboard')}</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerBtn}>
                <Bell size={20} color={COLORS.white} />
                <View style={styles.notifBadge}>
                  <Text style={styles.notifText}>9</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Platform Stats */}
          <View style={styles.statsGrid}>
            {PLATFORM_STATS.map((stat, i) => (
              <View key={i} style={[styles.statCard, { backgroundColor: stat.color + '20' }]}>
                <View style={[styles.statIcon, { backgroundColor: stat.color }]}>{stat.icon}</View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statTrend}>{stat.trend}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Admin Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>إدارة المنصة</Text>
          <View style={styles.menuGrid}>
            {ADMIN_MENU.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.menuCard, { backgroundColor: item.color }]}
                onPress={() => (navigation as any).navigate(item.screen)}
              >
                <View style={styles.menuIcon}>{item.icon}</View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                {item.badge > 0 && (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>{item.badge}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pending Actions */}
        <View style={styles.pendingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>إجراءات معلقة</Text>
            <View style={styles.pendingCount}>
              <Text style={styles.pendingCountText}>{PENDING_ACTIONS.length}</Text>
            </View>
          </View>
          {PENDING_ACTIONS.map((action) => (
            <View key={action.id} style={[styles.pendingCard, action.urgent && styles.pendingCardUrgent]}>
              <View style={[styles.pendingIcon, { backgroundColor: action.urgent ? COLORS.errorLight : COLORS.warningLight }]}>
                {action.urgent ? <AlertCircle size={18} color={COLORS.error} /> : <Clock size={18} color={COLORS.warning} />}
              </View>
              <View style={styles.pendingInfo}>
                <Text style={styles.pendingTitle}>{action.title}</Text>
                <Text style={styles.pendingDesc} numberOfLines={1}>{action.desc}</Text>
                <Text style={styles.pendingTime}>{action.time}</Text>
              </View>
              <View style={styles.pendingActions}>
                <TouchableOpacity style={styles.approveBtn}>
                  <CheckCircle size={16} color={COLORS.success} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectBtn}>
                  <Text style={styles.rejectBtnText}>رفض</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Revenue Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>إيرادات المنصة</Text>
          <View style={styles.chart}>
            {MOCK_ANALYTICS.revenue.slice(6).map((val, i) => {
              const maxVal = Math.max(...MOCK_ANALYTICS.revenue);
              const height = Math.max((val / maxVal) * 100, 4);
              return (
                <View key={i} style={styles.barGroup}>
                  <View style={[styles.bar, { height, backgroundColor: i === 5 ? COLORS.gold : COLORS.primary }]} />
                  <Text style={styles.barLabel}>{MOCK_ANALYTICS.months[i + 6]}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.lg, paddingBottom: SPACING.xl },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.lg },
  headerRole: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.white },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  notifBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: COLORS.gold, borderRadius: 8, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  notifText: { color: COLORS.primary, fontSize: 9, fontWeight: '700' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { width: (width - SPACING.lg * 2 - 10) / 2, borderRadius: RADIUS.xl, padding: 14, gap: 4 },
  statIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: '800', color: COLORS.white },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  statTrend: { fontSize: 11, color: '#34D399', fontWeight: '700' },
  menuSection: { padding: SPACING.lg },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  menuCard: { width: (width - SPACING.lg * 2 - 30) / 4, borderRadius: RADIUS.xl, padding: 12, alignItems: 'center', gap: 6, position: 'relative' },
  menuIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', ...SHADOW.sm },
  menuLabel: { fontSize: 10, color: COLORS.text, textAlign: 'center', fontWeight: '600' },
  menuBadge: { position: 'absolute', top: 6, right: 6, backgroundColor: COLORS.error, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
  menuBadgeText: { color: COLORS.white, fontSize: 9, fontWeight: '700' },
  pendingSection: { padding: SPACING.lg, paddingTop: 0 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  pendingCount: { backgroundColor: COLORS.error, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  pendingCountText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  pendingCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: 10, ...SHADOW.sm },
  pendingCardUrgent: { borderLeftWidth: 3, borderLeftColor: COLORS.error },
  pendingIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  pendingInfo: { flex: 1 },
  pendingTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  pendingDesc: { fontSize: 11, color: COLORS.gray500, marginTop: 2 },
  pendingTime: { fontSize: 10, color: COLORS.gray400, marginTop: 2 },
  pendingActions: { flexDirection: 'row', gap: 6 },
  approveBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.successLight, alignItems: 'center', justifyContent: 'center' },
  rejectBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.md, backgroundColor: COLORS.errorLight },
  rejectBtnText: { fontSize: 11, color: COLORS.error, fontWeight: '700' },
  chartSection: { margin: SPACING.lg, backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.lg, ...SHADOW.sm },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 120, marginTop: 12 },
  barGroup: { flex: 1, alignItems: 'center', gap: 4 },
  bar: { width: '65%', borderRadius: 4, minHeight: 4 },
  barLabel: { fontSize: 8, color: COLORS.gray500 },
});
