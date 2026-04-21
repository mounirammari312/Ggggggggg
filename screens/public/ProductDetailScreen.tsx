import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, FlatList, Modal, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft, ArrowRight, Heart, Share2, MessageSquare,
  Package, Truck, Shield, ChevronRight, Star, Send,
  ShoppingBag, MapPin, Clock, X,
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../lib/theme';
import { useAppStore } from '../../lib/store';
import { MOCK_PRODUCTS, MOCK_SUPPLIERS } from '../../lib/mockData';
import { StarRating } from '../../components/common/StarRating';
import { BadgeIcon } from '../../components/common/BadgeIcon';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();
  const { language, isFavorite, toggleFavorite, formatPrice, isRTL } = useAppStore();
  const [currentImage, setCurrentImage] = useState(0);
  const [showRFQ, setShowRFQ] = useState(false);
  const [rfqQty, setRfqQty] = useState('');
  const [rfqPrice, setRfqPrice] = useState('');
  const [rfqMessage, setRfqMessage] = useState('');
  const [rfqCurrency, setRfqCurrency] = useState('DZD');
  const [rfqSubmitted, setRfqSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  const productId = (route.params as any)?.productId || 'p1';
  const product = MOCK_PRODUCTS.find(p => p.id === productId) || MOCK_PRODUCTS[0];
  const supplier = MOCK_SUPPLIERS.find(s => s.id === product.supplier_id) || MOCK_SUPPLIERS[0];
  const fav = isFavorite(product.id);
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const getName = () => {
    if (language === 'ar') return product.name_ar;
    if (language === 'fr') return product.name_fr;
    return product.name_en;
  };

  const getDescription = () => {
    if (language === 'ar') return product.description_ar || '';
    return product.description_ar || '';
  };

  const images = product.images?.length > 0
    ? product.images
    : [
        `https://picsum.photos/seed/${product.id}a/600/400`,
        `https://picsum.photos/seed/${product.id}b/600/400`,
        `https://picsum.photos/seed/${product.id}c/600/400`,
      ];

  const handleSubmitRFQ = () => {
    if (!rfqQty) { Alert.alert('خطأ', 'يرجى إدخال الكمية'); return; }
    setRfqSubmitted(true);
    setTimeout(() => {
      setShowRFQ(false);
      setRfqSubmitted(false);
      setRfqQty('');
      setRfqPrice('');
      setRfqMessage('');
      Alert.alert('تم بنجاح', 'تم إرسال طلب عرض السعر بنجاح. سيرد عليك المورد قريباً.');
    }, 1500);
  };

  const MOCK_REVIEWS = [
    { id: 'rv1', user: 'محمد أحمد', rating: 5, comment: 'منتج ممتاز جداً، الجودة عالية والتسليم سريع', date: '2024-03-10' },
    { id: 'rv2', user: 'كريم بوعلام', rating: 4, comment: 'جيد لكن التغليف يحتاج تحسيناً', date: '2024-02-25' },
    { id: 'rv3', user: 'سارة بلعيد', rating: 5, comment: 'تعاملت معهم عدة مرات ودائماً راضية', date: '2024-02-15' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.galleryContainer}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => String(i)}
            onMomentumScrollEnd={(e) => {
              setCurrentImage(Math.round(e.nativeEvent.contentOffset.x / width));
            }}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.mainImage} contentFit="cover" />
            )}
          />
          {/* Overlay Controls */}
          <SafeAreaView edges={['top']} style={styles.galleryOverlay}>
            <TouchableOpacity style={styles.galleryBtn} onPress={() => navigation.goBack()}>
              <BackIcon size={20} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.galleryRight}>
              <TouchableOpacity style={styles.galleryBtn} onPress={() => toggleFavorite(product.id)}>
                <Heart size={20} color={fav ? COLORS.error : COLORS.white} fill={fav ? COLORS.error : 'transparent'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.galleryBtn}>
                <Share2 size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
          {/* Image Dots */}
          <View style={styles.imageDots}>
            {images.map((_, i) => (
              <View key={i} style={[styles.imageDot, i === currentImage && styles.imageDotActive]} />
            ))}
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.infoCard}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            <Text style={styles.perUnit}>/ {product.unit}</Text>
            <View style={styles.stockBadge}>
              <View style={[styles.stockDot, { backgroundColor: product.stock_qty > 0 ? COLORS.success : COLORS.error }]} />
              <Text style={styles.stockText}>{product.stock_qty > 0 ? t('product.inStock') : t('product.outOfStock')}</Text>
            </View>
          </View>
          <Text style={styles.productName}>{getName()}</Text>
          <View style={styles.ratingRow}>
            <StarRating rating={product.rating} totalReviews={product.total_reviews} />
            <Text style={styles.ordersText}>{product.total_orders} طلب</Text>
          </View>
          <View style={styles.minOrderRow}>
            <Package size={14} color={COLORS.gray500} />
            <Text style={styles.minOrderText}>{t('product.minOrder')}: {product.min_order_qty} {product.unit}</Text>
          </View>
        </View>

        {/* Supplier Card */}
        <TouchableOpacity
          style={styles.supplierCard}
          onPress={() => (navigation as any).navigate('SupplierStore', { supplierId: supplier.id })}
        >
          <Image
            source={{ uri: `https://picsum.photos/seed/${supplier.id}logo/80/80` }}
            style={styles.supplierLogo}
            contentFit="cover"
          />
          <View style={styles.supplierInfo}>
            <Text style={styles.supplierName}>{supplier.company_name}</Text>
            <View style={styles.supplierMeta}>
              <MapPin size={12} color={COLORS.gray400} />
              <Text style={styles.supplierMetaText}>{supplier.city}</Text>
              <Clock size={12} color={COLORS.gray400} />
              <Text style={styles.supplierMetaText}>{supplier.response_time}</Text>
            </View>
            <View style={styles.supplierBadges}>
              {(supplier.badges || []).slice(0, 3).map((b: string) => (
                <BadgeIcon key={b} type={b as any} size={16} />
              ))}
            </View>
          </View>
          <ChevronRight size={18} color={COLORS.gray400} />
        </TouchableOpacity>

        {/* Features */}
        <View style={styles.featuresRow}>
          {[
            { icon: <Truck size={20} color={COLORS.primary} />, label: 'توصيل سريع' },
            { icon: <Shield size={20} color={COLORS.success} />, label: 'ضمان الجودة' },
            { icon: <Package size={20} color={COLORS.gold} />, label: 'تغليف آمن' },
          ].map((f, i) => (
            <View key={i} style={styles.featureItem}>
              {f.icon}
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['description', 'specs', 'reviews'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'description' ? t('product.description') : tab === 'specs' ? t('product.specifications') : t('product.reviews')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'description' && (
            <Text style={styles.description}>{getDescription() || 'وصف مفصل للمنتج سيكون متاحاً قريباً. هذا المنتج يتميز بجودته العالية وسعره التنافسي.'}</Text>
          )}
          {activeTab === 'specs' && (
            <View>
              {[
                { label: 'الوحدة', value: product.unit },
                { label: 'الحد الأدنى للطلب', value: `${product.min_order_qty} ${product.unit}` },
                { label: 'المخزون المتاح', value: `${product.stock_qty} ${product.unit}` },
                { label: 'العملة', value: product.currency },
              ].map((spec, i) => (
                <View key={i} style={[styles.specRow, i % 2 === 0 && styles.specRowAlt]}>
                  <Text style={styles.specLabel}>{spec.label}</Text>
                  <Text style={styles.specValue}>{spec.value}</Text>
                </View>
              ))}
            </View>
          )}
          {activeTab === 'reviews' && (
            <View>
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
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.messageBtn}
          onPress={() => (navigation as any).navigate('Messages')}
        >
          <MessageSquare size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <Button
          title={t('product.requestQuote')}
          onPress={() => setShowRFQ(true)}
          style={{ flex: 1 }}
          icon={<ShoppingBag size={18} color={COLORS.white} />}
        />
      </View>

      {/* RFQ Modal */}
      <Modal visible={showRFQ} animationType="slide" transparent onRequestClose={() => setShowRFQ(false)}>
        <View style={styles.rfqOverlay}>
          <View style={styles.rfqSheet}>
            <View style={styles.rfqHeader}>
              <Text style={styles.rfqTitle}>{t('rfq.title')}</Text>
              <TouchableOpacity onPress={() => setShowRFQ(false)}>
                <X size={22} color={COLORS.gray600} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <Text style={styles.rfqProductName}>{getName()}</Text>
              <Text style={styles.rfqLabel}>{t('rfq.quantity')} *</Text>
              <TextInput
                style={styles.rfqInput}
                placeholder={`مثال: ${product.min_order_qty}`}
                value={rfqQty}
                onChangeText={setRfqQty}
                keyboardType="numeric"
              />
              <Text style={styles.rfqLabel}>{t('rfq.targetPrice')} ({t('rfq.currency')})</Text>
              <View style={styles.rfqPriceRow}>
                <TextInput
                  style={[styles.rfqInput, { flex: 1 }]}
                  placeholder="سعر مستهدف"
                  value={rfqPrice}
                  onChangeText={setRfqPrice}
                  keyboardType="numeric"
                />
                <View style={styles.currencySelector}>
                  {(['DZD', 'EUR', 'USD'] as const).map((c) => (
                    <TouchableOpacity
                      key={c}
                      style={[styles.currencyBtn, rfqCurrency === c && styles.currencyBtnActive]}
                      onPress={() => setRfqCurrency(c)}
                    >
                      <Text style={[styles.currencyBtnText, rfqCurrency === c && styles.currencyBtnTextActive]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <Text style={styles.rfqLabel}>{t('rfq.message')}</Text>
              <TextInput
                style={[styles.rfqInput, styles.rfqTextarea]}
                placeholder="أضف تفاصيل إضافية..."
                value={rfqMessage}
                onChangeText={setRfqMessage}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <Button
                title={rfqSubmitted ? 'جاري الإرسال...' : t('rfq.submit')}
                onPress={handleSubmitRFQ}
                loading={rfqSubmitted}
                style={{ marginTop: 16 }}
                icon={<Send size={16} color={COLORS.white} />}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  galleryContainer: { position: 'relative' },
  mainImage: { width, height: 300 },
  galleryOverlay: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: SPACING.lg },
  galleryBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  galleryRight: { flexDirection: 'row', gap: 8 },
  imageDots: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: 10, backgroundColor: COLORS.white },
  imageDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.gray300 },
  imageDotActive: { width: 20, backgroundColor: COLORS.primary },
  infoCard: { backgroundColor: COLORS.white, padding: SPACING.lg, marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  price: { fontSize: 24, fontWeight: '800', color: COLORS.primary },
  perUnit: { fontSize: 14, color: COLORS.gray500 },
  stockBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.successLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full, marginLeft: 'auto' },
  stockDot: { width: 6, height: 6, borderRadius: 3 },
  stockText: { fontSize: 11, color: COLORS.success, fontWeight: '600' },
  productName: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 8, lineHeight: 26 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  ordersText: { fontSize: 12, color: COLORS.gray500 },
  minOrderRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.gray50, padding: 10, borderRadius: RADIUS.md },
  minOrderText: { fontSize: 13, color: COLORS.gray600 },
  supplierCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, padding: SPACING.lg, marginBottom: 8, gap: 12 },
  supplierLogo: { width: 52, height: 52, borderRadius: 26 },
  supplierInfo: { flex: 1 },
  supplierName: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  supplierMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  supplierMetaText: { fontSize: 11, color: COLORS.gray500 },
  supplierBadges: { flexDirection: 'row', gap: 4 },
  featuresRow: { flexDirection: 'row', backgroundColor: COLORS.white, padding: SPACING.lg, marginBottom: 8 },
  featureItem: { flex: 1, alignItems: 'center', gap: 6 },
  featureLabel: { fontSize: 11, color: COLORS.gray600, textAlign: 'center' },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: 13, color: COLORS.gray500, fontWeight: '500' },
  tabTextActive: { color: COLORS.primary, fontWeight: '700' },
  tabContent: { backgroundColor: COLORS.white, padding: SPACING.lg, marginBottom: 8 },
  description: { fontSize: 14, color: COLORS.gray700, lineHeight: 24 },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 4 },
  specRowAlt: { backgroundColor: COLORS.gray50, borderRadius: RADIUS.sm },
  specLabel: { fontSize: 13, color: COLORS.gray600 },
  specValue: { fontSize: 13, color: COLORS.text, fontWeight: '600' },
  reviewCard: { backgroundColor: COLORS.gray50, borderRadius: RADIUS.md, padding: 12, marginBottom: 10 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  reviewAvatarText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  reviewMeta: { flex: 1 },
  reviewUser: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  reviewDate: { fontSize: 11, color: COLORS.gray400 },
  reviewComment: { fontSize: 13, color: COLORS.gray700, lineHeight: 20 },
  bottomActions: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: 12, padding: SPACING.lg, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border, ...SHADOW.lg },
  messageBtn: { width: 48, height: 48, borderRadius: RADIUS.md, backgroundColor: COLORS.primary + '15', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.primary },
  rfqOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  rfqSheet: { backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, padding: SPACING.xl, maxHeight: '90%' },
  rfqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  rfqTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  rfqProductName: { fontSize: 14, color: COLORS.gray600, marginBottom: SPACING.lg, padding: 10, backgroundColor: COLORS.gray50, borderRadius: RADIUS.md },
  rfqLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8, marginTop: 12 },
  rfqInput: { backgroundColor: COLORS.gray100, borderRadius: RADIUS.md, padding: 12, fontSize: 14, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border },
  rfqTextarea: { height: 100, textAlignVertical: 'top' },
  rfqPriceRow: { flexDirection: 'row', gap: 10 },
  currencySelector: { flexDirection: 'row', gap: 4 },
  currencyBtn: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: RADIUS.md, backgroundColor: COLORS.gray100, borderWidth: 1, borderColor: COLORS.border },
  currencyBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  currencyBtnText: { fontSize: 12, color: COLORS.gray600, fontWeight: '600' },
  currencyBtnTextActive: { color: COLORS.white },
});
