import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, CheckCircle, Clock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../lib/theme';
import { AppHeader } from '../../components/common/AppHeader';
import { BadgeIcon } from '../../components/common/BadgeIcon';
import { Button } from '../../components/common/Button';

const BADGE_TYPES = [
  { id: 'trusted', color: COLORS.badge.trusted, price: 5000, description: 'تؤكد مصداقية شركتك وتبني ثقة العملاء', requirements: ['تسجيل تجاري', 'وثائق الشركة', 'سجل تجاري نظيف'] },
  { id: 'premium', color: COLORS.badge.premium, price: 15000, description: 'ميز شركتك بمزايا إضافية وظهور متميز', requirements: ['شارة الموثوق', 'أكثر من 50 طلب', 'تقييم 4.5+'] },
  { id: 'bestSeller', color: COLORS.badge.bestSeller, price: 10000, description: 'أظهر لعملائك أنك الأكثر مبيعاً', requirements: ['أكثر من 100 طلب', 'شارة الموثوق'] },
  { id: 'freeShipping', color: COLORS.badge.freeShipping, price: 8000, description: 'اجذب عملاء أكثر بخدمة الشحن المجاني', requirements: ['التزام بالشحن المجاني للطلبات فوق 50,000 دج'] },
  { id: 'qualityGuaranteed', color: COLORS.badge.qualityGuaranteed, price: 12000, description: 'ضمن جودة منتجاتك وابن ثقة عملائك', requirements: ['شهادة جودة', 'تقييم 4.7+', 'أقل من 2% مردودات'] },
];

const MY_BADGES = ['trusted', 'premium', 'bestSeller'];
const PENDING_BADGES = ['freeShipping'];

export default function BadgesScreen() {
  const { t } = useTranslation();
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleRequest = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSelectedBadge(null);
      Alert.alert(t('common.success'), 'تم إرسال طلب الشارة، سيتم مراجعته خلال 3-5 أيام عمل');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title={t('supplierDash.badges')} showBack />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* My Badges */}
        <Text style={styles.sectionTitle}>{t('badges.myBadges')}</Text>
        <View style={styles.myBadgesGrid}>
          {MY_BADGES.map((badgeId) => {
            const badge = BADGE_TYPES.find(b => b.id === badgeId)!;
            return (
              <View key={badgeId} style={[styles.myBadgeCard, { borderColor: badge.color + '40' }]}>
                <BadgeIcon type={badgeId as any} size={36} />
                <Text style={[styles.myBadgeName, { color: badge.color }]}>{t(`badges.${badgeId}`)}</Text>
                <View style={styles.activeBadge}>
                  <CheckCircle size={12} color={COLORS.success} />
                  <Text style={styles.activeBadgeText}>نشط</Text>
                </View>
              </View>
            );
          })}
          {PENDING_BADGES.map((badgeId) => {
            const badge = BADGE_TYPES.find(b => b.id === badgeId)!;
            return (
              <View key={badgeId} style={[styles.myBadgeCard, { borderColor: COLORS.warning + '40', opacity: 0.7 }]}>
                <BadgeIcon type={badgeId as any} size={36} />
                <Text style={[styles.myBadgeName, { color: COLORS.warning }]}>{t(`badges.${badgeId}`)}</Text>
                <View style={[styles.activeBadge, { backgroundColor: COLORS.warningLight }]}>
                  <Clock size={12} color={COLORS.warning} />
                  <Text style={[styles.activeBadgeText, { color: COLORS.warning }]}>قيد المراجعة</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Available Badges */}
        <Text style={styles.sectionTitle}>شارات متاحة</Text>
        {BADGE_TYPES.filter(b => !MY_BADGES.includes(b.id) && !PENDING_BADGES.includes(b.id)).map((badge) => (
          <TouchableOpacity
            key={badge.id}
            style={styles.badgeCard}
            onPress={() => setSelectedBadge(badge)}
          >
            <BadgeIcon type={badge.id as any} size={40} />
            <View style={styles.badgeInfo}>
              <Text style={styles.badgeName}>{t(`badges.${badge.id}`)}</Text>
              <Text style={styles.badgeDesc} numberOfLines={2}>{badge.description}</Text>
              <Text style={styles.badgePrice}>{badge.price.toLocaleString()} د.ج / شهر</Text>
            </View>
            <View style={[styles.requestBadgeBtn, { backgroundColor: badge.color + '15' }]}>
              <Text style={[styles.requestBadgeBtnText, { color: badge.color }]}>طلب</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Badge Request Modal */}
      <Modal visible={!!selectedBadge} animationType="slide" transparent onRequestClose={() => setSelectedBadge(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('badges.requestBadge')}</Text>
              <TouchableOpacity onPress={() => setSelectedBadge(null)}>
                <X size={22} color={COLORS.gray600} />
              </TouchableOpacity>
            </View>
            {selectedBadge && (
              <ScrollView>
                <View style={styles.modalBadgePreview}>
                  <BadgeIcon type={selectedBadge.id} size={60} />
                  <Text style={[styles.modalBadgeName, { color: selectedBadge.color }]}>
                    {t(`badges.${selectedBadge.id}`)}
                  </Text>
                  <Text style={styles.modalBadgeDesc}>{selectedBadge.description}</Text>
                  <Text style={styles.modalBadgePrice}>{selectedBadge.price.toLocaleString()} د.ج / شهر</Text>
                </View>
                <Text style={styles.requirementsTitle}>المتطلبات</Text>
                {selectedBadge.requirements.map((req: string, i: number) => (
                  <View key={i} style={styles.requirementRow}>
                    <CheckCircle size={14} color={COLORS.success} />
                    <Text style={styles.requirementText}>{req}</Text>
                  </View>
                ))}
                <Button
                  title={t('badges.requestBadge')}
                  onPress={handleRequest}
                  loading={loading}
                  style={{ marginTop: 20 }}
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
  myBadgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  myBadgeCard: { width: '30%', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: 12, alignItems: 'center', gap: 6, borderWidth: 1.5, ...SHADOW.sm },
  myBadgeName: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
  activeBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: COLORS.successLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: RADIUS.full },
  activeBadgeText: { fontSize: 9, color: COLORS.success, fontWeight: '700' },
  badgeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: 10, gap: 12, ...SHADOW.sm },
  badgeInfo: { flex: 1 },
  badgeName: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  badgeDesc: { fontSize: 12, color: COLORS.gray600, marginTop: 2 },
  badgePrice: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginTop: 4 },
  requestBadgeBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full },
  requestBadgeBtnText: { fontSize: 13, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, padding: SPACING.xl, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  modalBadgePreview: { alignItems: 'center', gap: 8, marginBottom: 20 },
  modalBadgeName: { fontSize: 20, fontWeight: '800' },
  modalBadgeDesc: { fontSize: 14, color: COLORS.gray600, textAlign: 'center' },
  modalBadgePrice: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  requirementsTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  requirementRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  requirementText: { fontSize: 13, color: COLORS.gray700 },
});
