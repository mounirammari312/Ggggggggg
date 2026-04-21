import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, ShoppingBag, Package, Star, DollarSign } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../lib/theme';
import { useAppStore } from '../../lib/store';
import { MOCK_ANALYTICS } from '../../lib/mockData';
import { AppHeader } from '../../components/common/AppHeader';

const { width } = Dimensions.get('window');

export default function SupplierAnalyticsScreen() {
  const { t } = useTranslation();
  const { formatPrice } = useAppStore();
  const [period, setPeriod] = useState<'3m' | '6m' | '12m'>('6m');

  const getRevenueData = () => {
    if (period === '3m') return MOCK_ANALYTICS.revenue.slice(9);
    if (period === '6m') return MOCK_ANALYTICS.revenue.slice(6);
    return MOCK_ANALYTICS.revenue;
  };

  const getMonthsData = () => {
    if (period === '3m') return MOCK_ANALYTICS.months.slice(9);
    if (period === '6m') return MOCK_ANALYTICS.months.slice(6);
    return MOCK_ANALYTICS.months;
  };

  const revenueData = getRevenueData();
  const maxRevenue = Math.max(...revenueData);
  const totalRevenue = revenueData.reduce((a, b) => a + b, 0);
  const avgRevenue = totalRevenue / revenueData.length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title={t('supplierDash.analytics')} showBack />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['3m', '6m', '12m'] as const).map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodBtn, period === p && styles.periodBtnActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.periodBtnText, period === p && styles.periodBtnTextActive]}>
                {p === '3m' ? '3 أشهر' : p === '6m' ? '6 أشهر' : '12 شهر'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* KPI Cards */}
        <View style={styles.kpiGrid}>
          {[
            { icon: <DollarSign size={20} color={COLORS.white} />, label: 'إجمالي الإيرادات', value: formatPrice(totalRevenue), color: COLORS.primary, trend: '+18%' },
            { icon: <ShoppingBag size={20} color={COLORS.white} />, label: 'متوسط شهري', value: formatPrice(avgRevenue), color: COLORS.success, trend: '+5%' },
            { icon: <Package size={20} color={COLORS.white} />, label: 'إجمالي الطلبات', value: '59', color: COLORS.gold, trend: '+12%' },
            { icon: <Star size={20} color={COLORS.white} />, label: 'متوسط التقييم', value: '4.7', color: '#8B5CF6', trend: '+0.2' },
          ].map((kpi, i) => (
            <View key={i} style={[styles.kpiCard, { backgroundColor: kpi.color }]}>
              <View style={styles.kpiHeader}>
                {kpi.icon}
                <Text style={styles.kpiTrend}>{kpi.trend}</Text>
              </View>
              <Text style={styles.kpiValue}>{kpi.value}</Text>
              <Text style={styles.kpiLabel}>{kpi.label}</Text>
            </View>
          ))}
        </View>

        {/* Revenue Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>تطور الإيرادات</Text>
          <View style={styles.chart}>
            {revenueData.map((val, i) => {
              const height = Math.max((val / maxRevenue) * 120, 4);
              return (
                <View key={i} style={styles.barGroup}>
                  <Text style={styles.barValue}>{(val / 1000).toFixed(0)}K</Text>
                  <View style={[styles.bar, { height, backgroundColor: i === revenueData.length - 1 ? COLORS.gold : COLORS.primary }]} />
                  <Text style={styles.barLabel}>{getMonthsData()[i]}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>توزيع المبيعات</Text>
          {MOCK_ANALYTICS.categoryBreakdown.map((cat, i) => (
            <View key={i} style={styles.categoryRow}>
              <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
              <Text style={styles.categoryName}>{cat.name}</Text>
              <View style={styles.categoryBarWrapper}>
                <View style={[styles.categoryBar, { width: `${cat.percentage}%` as any, backgroundColor: cat.color }]} />
              </View>
              <Text style={styles.categoryPercent}>{cat.percentage}%</Text>
            </View>
          ))}
        </View>

        {/* Top Products */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>أفضل المنتجات مبيعاً</Text>
          {MOCK_ANALYTICS.topProducts.map((product, i) => (
            <View key={i} style={styles.topProductRow}>
              <View style={styles.topProductRank}>
                <Text style={styles.topProductRankText}>{i + 1}</Text>
              </View>
              <View style={styles.topProductInfo}>
                <Text style={styles.topProductName}>{product.name}</Text>
                <Text style={styles.topProductSales}>{product.sales} طلب</Text>
              </View>
              <Text style={styles.topProductRevenue}>{formatPrice(product.revenue)}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  periodSelector: { flexDirection: 'row', backgroundColor: COLORS.white, padding: SPACING.md, gap: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  periodBtn: { flex: 1, paddingVertical: 10, borderRadius: RADIUS.lg, alignItems: 'center', backgroundColor: COLORS.gray100 },
  periodBtnActive: { backgroundColor: COLORS.primary },
  periodBtnText: { fontSize: 13, color: COLORS.gray600, fontWeight: '600' },
  periodBtnTextActive: { color: COLORS.white },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: SPACING.lg, gap: 10 },
  kpiCard: { width: (width - SPACING.lg * 2 - 10) / 2, borderRadius: RADIUS.xl, padding: SPACING.lg },
  kpiHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  kpiTrend: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '700' },
  kpiValue: { fontSize: 20, fontWeight: '800', color: COLORS.white, marginBottom: 4 },
  kpiLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  chartCard: { backgroundColor: COLORS.white, margin: SPACING.lg, marginTop: 0, borderRadius: RADIUS.xl, padding: SPACING.lg, ...SHADOW.sm },
  chartTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.lg },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 160 },
  barGroup: { flex: 1, alignItems: 'center', gap: 4 },
  barValue: { fontSize: 8, color: COLORS.gray500 },
  bar: { width: '70%', borderRadius: 4, minHeight: 4 },
  barLabel: { fontSize: 8, color: COLORS.gray500 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  categoryDot: { width: 10, height: 10, borderRadius: 5 },
  categoryName: { fontSize: 13, color: COLORS.text, width: 80 },
  categoryBarWrapper: { flex: 1, height: 8, backgroundColor: COLORS.gray100, borderRadius: 4, overflow: 'hidden' },
  categoryBar: { height: '100%', borderRadius: 4 },
  categoryPercent: { fontSize: 12, fontWeight: '700', color: COLORS.text, width: 35, textAlign: 'right' },
  topProductRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  topProductRank: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  topProductRankText: { fontSize: 12, fontWeight: '800', color: COLORS.white },
  topProductInfo: { flex: 1 },
  topProductName: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  topProductSales: { fontSize: 11, color: COLORS.gray500, marginTop: 2 },
  topProductRevenue: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
});
