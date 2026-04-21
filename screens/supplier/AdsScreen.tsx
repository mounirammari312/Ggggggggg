import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Megaphone, X, CheckCircle, Clock, TrendingUp } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../lib/theme';
import { AppHeader } from '../../components/common/AppHeader';
import { Button } from '../../components/common/Button';

const AD_TYPES = [
  { id: 'mainBanner', label: 'بانر رئيسي', price: 25000, duration: 'أسبوع', reach: '50,000+', color: ['#1B3A5C', '#2A5280'] as [string,string] },
  { id: 'featuredSquare', label: 'مربع مميز', price: 15000, duration: 'أسبوع', reach: '30,000+', color: ['#D4AF37', '#B8941F'] as [string,string] },
  { id: 'productBoost', label: 'تعزيز المنتج', price: 8000, duration: 'أسبوع', reach: '20,000+', color: ['#10B981', '#059669'] as [string,string] },
  { id: 'categoryAd', label: 'إعلان الفئة', price: 12000, duration: 'أسبوع', reach: '25,000+', color: ['#8B5CF6', '#7C3AED'] as [string,string] },
  { id: 'sidebarAd', label: 'إعلان جانبي', price: 5000, duration: 'أسبوع', reach: '10,000+', color: ['#EF4444', '#DC2626'] as [string,string] },
];

const MY_ADS = [
  { id: 'a1', type: 'mainBanner', status: 'active', startDate: '2024-03-01', endDate: '2024-03-31', impressions: 12500, clicks: 340 },
];

export default function AdsScreen() {
  const { t } = useTranslation();
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [duration, setDuration] = useState('1');
  const [loading, setLoading] = useState(false);

  const handleRequest = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSelectedAd(null);
      Alert.alert(t('common.success'), 'تم إرسال طلب الإعلان، سيتم مراجعته خلال 24 ساعة');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title={t('supplierDash.ads')} showBack />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* My Active Ads */}
        <Text style={styles.sectionTitle}>{t('ads.myAds')}</Text>
        {MY_ADS.map((ad) => {
          const adType = AD_TYPES.find(a => a.id === ad.type)!;
          return (
            <View key={ad.id} style={styles.activeAdCard}>
              <LinearGradient colors={adType.color} style={styles.activeAdGradient}>
                <View style={styles.activeAdHeader}>
                  <Megaphone size={20} color={COLORS.white} />
                  <Text style={styles.activeAdType}>{adType.label}</Text>
                  <View style={styles.activeAdStatus}>
                    <View style={styles.activeDot} />
                    <Text style={styles.activeAdStatusText}>نشط</Text>
                  </View>
                </View>
                <View style={styles.activeAdStats}>
                  <View style={styles.activeAdStat}>
                    <Text style={styles.activeAdStatValue}>{ad.impressions.toLocaleString()}</Text>
                    <Text style={styles.activeAdStatLabel}>ظهور</Text>
                  </View>
                  <View style={styles.activeAdStat}>
                    <Text style={styles.activeAdStatValue}>{ad.clicks}</Text>
                    <Text style={styles.activeAdStatLabel}>نقرات</Text>
                  </View>
                  <View style={styles.activeAdStat}>
                    <Text style={styles.activeAdStatValue}>{((ad.clicks / ad.impressions) * 100).toFixed(1)}%</Text>
                    <Text style={styles.activeAdStatLabel}>CTR</Text>
                  </View>
                </View>
                <Text style={styles.activeAdDates}>{ad.startDate} → {ad.endDate}</Text>
              </LinearGradient>
            </View>
          );
        })}

        {/* Available Ad Types */}
        <Text style={styles.sectionTitle}>أنواع الإعلانات</Text>
        {AD_TYPES.map((adType) => (
          <TouchableOpacity
            key={adType.id}
            style={styles.adTypeCard}
            onPress={() => setSelectedAd(adType)}
          >
            <LinearGradient colors={adType.color} style={styles.adTypeIcon}>
              <Megaphone size={20} color={COLORS.white} />
            </LinearGradient>
            <View style={styles.adTypeInfo}>
              <Text style={styles.adTypeName}>{adType.label}</Text>
              <View style={styles.adTypeMeta}>
                <TrendingUp size={12} color={COLORS.success} />
                <Text style={styles.adTypeReach}>وصول {adType.reach}</Text>
              </View>
              <Text style={styles.adTypePrice}>{adType.price.toLocaleString()} د.ج / {adType.duration}</Text>
            </View>
            <View style={styles.adTypeAction}>
              <Text style={styles.adTypeActionText}>طلب</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Ad Request Modal */}
      <Modal visible={!!selectedAd} animationType="slide" transparent onRequestClose={() => setSelectedAd(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('ads.requestAd')}</Text>
              <TouchableOpacity onPress={() => setSelectedAd(null)}>
                <X size={22} color={COLORS.gray600} />
              </TouchableOpacity>
            </View>
            {selectedAd && (
              <ScrollView>
                <LinearGradient colors={selectedAd.color} style={styles.modalAdPreview}>
                  <Megaphone size={40} color={COLORS.white} />
                  <Text style={styles.modalAdName}>{selectedAd.label}</Text>
                  <Text style={styles.modalAdReach}>وصول {selectedAd.reach} مستخدم</Text>
                </LinearGradient>
                <View style={styles.durationSection}>
                  <Text style={styles.durationTitle}>مدة الإعلان (أسابيع)</Text>
                  <View style={styles.durationButtons}>
                    {['1', '2', '4', '8'].map((d) => (
                      <TouchableOpacity
                        key={d}
                        style={[styles.durationBtn, duration === d && styles.durationBtnActive]}
                        onPress={() => setDuration(d)}
                      >
                        <Text style={[styles.durationBtnText, duration === d && styles.durationBtnTextActive]}>{d}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.totalCost}>
                    <Text style={styles.totalCostLabel}>التكلفة الإجمالية</Text>
                    <Text style={styles.totalCostValue}>
                      {(selectedAd.price * Number(duration)).toLocaleString()} د.ج
                    </Text>
                  </View>
                </View>
                <Button
                  title={t('ads.requestAd')}
                  onPress={handleRequest}
                  loading={loading}
                  style={{ marginTop: 16 }}
                />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12, marginTop: 8 },
  activeAdCard: { borderRadius: RADIUS.xl, overflow: 'hidden', marginBottom: 12, ...SHADOW.md },
  activeAdGradient: { padding: SPACING.lg },
  activeAdHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  activeAdType: { flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.white },
  activeAdStatus: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#34D399' },
  activeAdStatusText: { fontSize: 11, color: COLORS.white, fontWeight: '600' },
  activeAdStats: { flexDirection: 'row', marginBottom: 10 },
  activeAdStat: { flex: 1, alignItems: 'center' },
  activeAdStatValue: { fontSize: 18, fontWeight: '800', color: COLORS.white },
  activeAdStatLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)' },
  activeAdDates: { fontSize: 11, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  adTypeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: 10, gap: 12, ...SHADOW.sm },
  adTypeIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  adTypeInfo: { flex: 1 },
  adTypeName: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  adTypeMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  adTypeReach: { fontSize: 12, color: COLORS.success },
  adTypePrice: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginTop: 2 },
  adTypeAction: { backgroundColor: COLORS.primary + '15', paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full },
  adTypeActionText: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, padding: SPACING.xl, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  modalAdPreview: { borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center', gap: 8, marginBottom: 20 },
  modalAdName: { fontSize: 20, fontWeight: '800', color: COLORS.white },
  modalAdReach: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  durationSection: {},
  durationTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  durationButtons: { flexDirection: 'row', gap: 10 },
  durationBtn: { flex: 1, paddingVertical: 12, borderRadius: RADIUS.lg, backgroundColor: COLORS.gray100, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  durationBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  durationBtnText: { fontSize: 14, color: COLORS.gray600, fontWeight: '700' },
  durationBtnTextActive: { color: COLORS.white },
  totalCost: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.gray50, borderRadius: RADIUS.lg, padding: SPACING.md, marginTop: 12 },
  totalCostLabel: { fontSize: 14, color: COLORS.gray600 },
  totalCostValue: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
});
