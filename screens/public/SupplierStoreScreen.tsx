import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft, ArrowRight, MapPin, Clock, Star, ShieldCheck,
  MessageSquare, Phone, Globe, Building, Package, ChevronRight,
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../lib/theme';
import { useAppStore } from '../../lib/store';
import { MOCK_SUPPLIERS, MOCK_PRODUCTS } from '../../lib/mockData';
import { StarRating } from '../../components/common/StarRating';
import { BadgeIcon } from '../../components/common/BadgeIcon';
import { ProductCard } from '../../components/home/ProductCard';
import { Button } from '../../components/common/Button';

const { width } = Dimensions.get('window');

export default function SupplierStoreScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();
  const { language, isRTL } = useAppStore();
  const [activeTab, setActiveTab] = useState<'products' | 'about' | 'reviews'>('products');
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const supplierId = (route.params as any)?.supplierId || 's1';
  const supplier = MOCK_SUPPLIERS.find(s => s.id === supplierId) || MOCK_SUPPLIERS[0];
  const supplierProducts = MOCK_PRODUCTS.filter(p => p.supplier_id === supplierId);

  const MOCK_REVIEWS = [
    { id: 'r1', user: 'أحمد بن علي', rating: 5, comment: 'مورد ممتاز، تعاملت معهم عدة مرات', date: '2024-03-10' },
    { id: 'r2', user: 'فاطمة زهراني', rating: 4, comment: 'جودة عالية وأسعار تنافسية', date: '2024-02-20' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: `https://picsum.photos/seed/${supplier.id}cover/800/300` }}
            style={styles.cover}
            contentFit="cover"
          />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.coverGradient} />
          <SafeAreaView edges={['top']} style={styles.coverHeader}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <BackIcon size={20} color={COLORS.white} />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Supplier Header */}
        <View style={styles.supplierHeader}>
          <View style={styles.logoRow}>
            <View style={styles.logoWrapper}>
              <Image
                source={{ uri: `https://picsum.photos/seed/${supplier.id}logo/120/120` }}
                style={styles.logo}
                contentFit="cover"
              />
              {supplier.is_verified && (
                <View style={styles.verifiedBadge}>
                  <ShieldCheck size={14} color={COLORS.white} />
                </View>
              )}
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => (navigation as any).navigate('Messages')}>
                <MessageSquare size={18} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.companyName}>{supplier.company_name}</Text>
          <Text style={styles.companyNameFr}>{supplier.company_name_fr}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MapPin size={13} color={COLORS.gray400} />
              <Text style={styles.metaText}>{supplier.city}</Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={13} color={COLORS.gray400} />
              <Text style={styles.metaText}>{supplier.response_time}</Text>
            </View>
            <View style={styles.metaItem}>
              <Building size={13} color={COLORS.gray400} />
              <Text style={styles.metaText}>{supplier.established_year}</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{supplier.rating}</Text>
              <Text style={styles.statLabel}>{t('supplier.rating')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{supplier.total_reviews}</Text>
              <Text style={styles.statLabel}>{t('supplier.totalReviews')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{supplierProducts.length}</Text>
              <Text style={styles.statLabel}>{t('supplier.products')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{(supplier.min_order_amount / 1000).toFixed(0)}K</Text>
              <Text style={styles.statLabel}>{t('supplier.minOrder')}</Text>
            </View>
          </View>
          <View style={styles.badgesRow}>
            {(supplier.badges || []).map((badge: string) => (
              <BadgeIcon key={badge} type={badge as any} size={22} showLabel />
            ))}
          </View>
          <Button
            title={t('rfq.title')}
            onPress={() => (navigation as any).navigate('ProductDetail', { productId: supplierProducts[0]?.id })}
            style={{ marginTop: 12 }}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['products', 'about', 'reviews'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'products' ? t('supplier.products') : tab === 'about' ? t('supplier.about') : t('supplier.reviews')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'products' && (
          <View style={styles.productsGrid}>
            {supplierProducts.length > 0 ? (
              supplierProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <View style={styles.emptyProducts}>
                <Package size={48} color={COLORS.gray300} />
                <Text style={styles.emptyText}>لا توجد منتجات بعد</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'about' && (
          <View style={styles.aboutSection}>
            <Text style={styles.aboutTitle}>نبذة عن الشركة</Text>
            <Text style={styles.aboutText}>{supplier.description}</Text>
            <View style={styles.aboutDetails}>
              {[
                { icon: <Building size={16} color={COLORS.primary} />, label: 'تأسس عام', value: String(supplier.established_year) },
                { icon: <MapPin size={16} color={COLORS.primary} />, label: 'الموقع', value: `${supplier.city}، ${supplier.country}` },
                { icon: <Package size={16} color={COLORS.primary} />, label: 'الحد الأدنى', value: `${supplier.min_order_amount.toLocaleString()} د.ج` },
                { icon: <Clock size={16} color={COLORS.primary} />, label: 'وقت الاستجابة', value: supplier.response_time || '' },
              ].map((item, i) => (
                <View key={i} style={styles.aboutDetailRow}>
                  {item.icon}
                  <Text style={styles.aboutDetailLabel}>{item.label}</Text>
                  <Text style={styles.aboutDetailValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'reviews' && (
          <View style={styles.reviewsSection}>
            <View style={styles.ratingOverview}>
              <Text style={styles.bigRating}>{supplier.rating}</Text>
              <StarRating rating={supplier.rating} size={18} showNumber={false} />
              <Text style={styles.totalReviews}>{supplier.total_reviews} {t('supplier.totalReviews')}</Text>
            </View>
            {MOCK_REVIEWS.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>{review.user[0]}</Text>
                  </View>
                  <View style={styles.reviewMeta}>
                    <Text style={styles.reviewUser}>{review.user}</Text>
                    <StarRating rating={review.rating} size={12} showNumber={false} />
                  </View>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  coverContainer: { position: 'relative', height: 200 },
  cover: { width: '100%', height: '100%' },
  coverGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100 },
  coverHeader: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: SPACING.lg },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  supplierHeader: { backgroundColor: COLORS.white, padding: SPACING.lg, marginBottom: 8 },
  logoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  logoWrapper: { position: 'relative' },
  logo: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: COLORS.white, marginTop: -36, ...SHADOW.md },
  verifiedBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.badge.trusted, borderRadius: 10, padding: 3 },
  headerActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary + '15', alignItems: 'center', justifyContent: 'center' },
  companyName: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginBottom: 2 },
  companyNameFr: { fontSize: 13, color: COLORS.gray500, marginBottom: 10 },
  metaRow: { flexDirection: 'row', gap: 16, marginBottom: 16, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: COLORS.gray500 },
  statsRow: { flexDirection: 'row', backgroundColor: COLORS.gray50, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: 12 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  statLabel: { fontSize: 10, color: COLORS.gray500, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: COLORS.border },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 8 },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: 13, color: COLORS.gray500, fontWeight: '500' },
  tabTextActive: { color: COLORS.primary, fontWeight: '700' },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: SPACING.md },
  emptyProducts: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
  emptyText: { fontSize: 14, color: COLORS.gray500 },
  aboutSection: { backgroundColor: COLORS.white, padding: SPACING.lg },
  aboutTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  aboutText: { fontSize: 14, color: COLORS.gray700, lineHeight: 24, marginBottom: 16 },
  aboutDetails: { gap: 0 },
  aboutDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  aboutDetailLabel: { flex: 1, fontSize: 13, color: COLORS.gray600 },
  aboutDetailValue: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  reviewsSection: { backgroundColor: COLORS.white, padding: SPACING.lg },
  ratingOverview: { alignItems: 'center', marginBottom: 20, gap: 6 },
  bigRating: { fontSize: 48, fontWeight: '800', color: COLORS.primary },
  totalReviews: { fontSize: 13, color: COLORS.gray500 },
  reviewCard: { backgroundColor: COLORS.gray50, borderRadius: RADIUS.md, padding: 12, marginBottom: 10 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  reviewAvatarText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  reviewMeta: { flex: 1 },
  reviewUser: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  reviewDate: { fontSize: 11, color: COLORS.gray400 },
  reviewComment: { fontSize: 13, color: COLORS.gray700, lineHeight: 20 },
});
