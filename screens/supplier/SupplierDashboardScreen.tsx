import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Package, ShoppingBag, FileText, BarChart2, Award, Megaphone,
  Store, TrendingUp, TrendingDown, Star, Bell, Settings, ChevronRight,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../lib/theme';
import { useAppStore } from '../../lib/store';
import { MOCK_ORDERS, MOCK_RFQS, MOCK_ANALYTICS, MOCK_PRODUCTS } from '../../lib/mockData';

const { width } = Dimensions.get('window');

export default function SupplierDashboardScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { user, formatPrice } = useAppStore();

  const totalRevenue = MOCK_ORDERS.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = MOCK_ORDERS.length;
  const totalProducts = MOCK_PRODUCTS.length;
  const avgRating = 4.7;

  const MENU_ITEMS = [
    { icon: <Package size={22} color={COLORS.primary} />, label: t('supplierDash.myProducts'), screen: 'SupplierProducts', count: totalProducts, color: '#EFF6FF' },
    { icon: <ShoppingBag size={22} color={COLORS.success} />, label: t('supplierDash.myOrders'), screen: 'SupplierOrders', count: totalOrders, color: '#F0FDF4' },
    { icon: <FileText size={22} color={COLORS.gold} />, label: t('supplierDash.myRFQs'), screen: 'SupplierRFQs', count: MOCK_RFQS.length, color: '#FFFBEB' },
    { icon: <BarChart2 size={22} color={COLORS.info} />, label: t('supplierDash.analytics'), screen: 'SupplierAnalytics', count: 0, color: '#EFF6FF' },
    { icon: <Award size={22} color={COLORS.gold} />, label: t('supplierDash.badges'), screen: 'SupplierBadges', count: 3, color: '#FFFBEB' },
    { icon: <Megaphone size={22} color='#8B5CF6' />, label: t('supplierDash.ads'), screen: 'SupplierAds', count: 1, color: '#F5F3FF' },
    { icon: <Store size={22} color={COLORS.primary} />, label: t('supplierDash.storeProfile'), screen: 'SupplierProfile', count: 0, color: '#EFF6FF' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>لوحة المورد</Text>
              <Text style={styles.companyName}>{user?.full_name || 'شركة الجزائر'}</Text>
            </View>
            <View style={styles.headerBtns}>
              <TouchableOpacity style={styles.headerBtn}>
                <Bell size={20} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerBtn} onPress={() => (navigation as any).navigate('Settings')}>
                <Settings size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* KPI Cards */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.kpiScroll}>
            {[
              { label: t('supplierDash.revenue'), value: formatPrice(totalRevenue), icon: <TrendingUp size={16} color={COLORS.gold} />, trend: '+12%' },
              { label: t('supplierDash.totalOrders'), value: String(totalOrders), icon: <ShoppingBag size={16} color='#A78BFA' />, trend: '+5%' },
              { label: t('supplierDash.totalProducts'), value: String(totalProducts), icon: <Package size={16} color='#34D399' />, trend: '' },
              { label: t('supplierDash.avgRating'), value: String(avgRating), icon: <Star size={16} color={COLORS.gold} />, trend: '' },
            ].map((kpi, i) => (
              <View key={i} style={styles.kpiCard}>
                <View style={styles.kpiHeader}>
                  {kpi.icon}
                  {kpi.trend ? <Text style={styles.kpiTrend}>{kpi.trend}</Text> : null}
                </View>
                <Text style={styles.kpiValue}>{kpi.value}</Text>
                <Text style={styles.kpiLabel}>{kpi.label}</Text>
              </View>
            ))}
          </ScrollView>
        </LinearGradient>

        {/* Quick Add Product */}
        <TouchableOpacity
          style={styles.addProductBtn}
          onPress={() => (navigation as any).navigate('AddProduct')}
        >
          <LinearGradient colors={[COLORS.gold, COLORS.goldDark]} style={styles.addProductGradient}>
            <Package size={20} color={COLORS.primary} />
            <Text style={styles.addProductText}>{t('supplierDash.addProduct')}</Text>
            <ChevronRight size={18} color={COLORS.primary} />
          </LinearGradient>
        </TouchableOpacity>

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.menuCard, { backgroundColor: item.color }]}
              onPress={() => (navigation as any).navigate(item.screen)}
            >
              <View style={styles.menuIcon}>{item.icon}</View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.count > 0 && (
                <View style={styles.menuBadge}>
                  <Text style={styles.menuBadgeText}>{item.count}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('supplierDash.myOrders')}</Text>
            <TouchableOpacity onPress={() => (navigation as any).navigate('SupplierOrders')}>
              <Text style={styles.seeAll}>{t('home.viewAll')}</Text>
            </TouchableOpacity>
          </View>
          {MOCK_ORDERS.map((order) => (
            <View key={order.id} style={styles.orderRow}>
              <View style={styles.orderDot} />
              <View style={styles.orderInfo}>
                <Text style={styles.orderId}>#{order.id.toUpperCase()}</Text>
                <Text style={styles.orderDate}>{order.created_at}</Text>
              </View>
              <View style={styles.orderRight}>
                <Text style={styles.orderAmount}>{formatPrice(order.total)}</Text>
                <Text style={[styles.orderStatus, { color: order.status === 'delivered' ? COLORS.success : order.status === 'shipped' ? COLORS.info : COLORS.warning }]}>
                  {t(`common.status.${order.status}`)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Revenue Mini Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الإيرادات - آخر 6 أشهر</Text>
          <View style={styles.miniChart}>
            {MOCK_ANALYTICS.revenue.slice(6).map((val, i) => {
              const maxVal = Math.max(...MOCK_ANALYTICS.revenue);
              const height = (val / maxVal) * 80;
              return (
                <View key={i} style={styles.barWrapper}>
                  <View style={[styles.bar, { height }]} />
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
  greeting: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  companyName: { fontSize: 18, fontWeight: '800', color: COLORS.white, marginTop: 2 },
  headerBtns: { flexDirection: 'row', gap: 8 },
  headerBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  kpiScroll: { gap: 12, paddingRight: SPACING.md },
  kpiCard: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: RADIUS.xl, padding: SPACING.md, minWidth: 140 },
  kpiHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  kpiTrend: { fontSize: 11, color: '#34D399', fontWeight: '700' },
  kpiValue: { fontSize: 20, fontWeight: '800', color: COLORS.white, marginBottom: 4 },
  kpiLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  addProductBtn: { margin: SPACING.lg, borderRadius: RADIUS.xl, overflow: 'hidden' },
  addProductGradient: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: SPACING.lg },
  addProductText: { flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.primary },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.lg, gap: 10 },
  menuCard: { width: (width - SPACING.lg * 2 - 20) / 3, borderRadius: RADIUS.xl, padding: 16, alignItems: 'center', gap: 8, position: 'relative' },
  menuIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', ...SHADOW.sm },
  menuLabel: { fontSize: 11, color: COLORS.text, textAlign: 'center', fontWeight: '600' },
  menuBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: COLORS.primary, borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  menuBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: '700' },
  section: { margin: SPACING.lg, backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.lg, ...SHADOW.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  orderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  orderDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  orderInfo: { flex: 1 },
  orderId: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  orderDate: { fontSize: 11, color: COLORS.gray500 },
  orderRight: { alignItems: 'flex-end' },
  orderAmount: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  orderStatus: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  miniChart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 100, marginTop: 12 },
  barWrapper: { flex: 1, alignItems: 'center', gap: 4 },
  bar: { width: '60%', backgroundColor: COLORS.primary, borderRadius: 4, minHeight: 4 },
  barLabel: { fontSize: 9, color: COLORS.gray500 },
});
