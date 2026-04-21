import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Dimensions, FlatList, TextInput, StatusBar, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Bell, ChevronRight, TrendingUp, Package, Truck, Star, Cpu, Building, Utensils, Shirt, Settings, FlaskConical, Armchair, Car } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../lib/theme';
import { useAppStore } from '../../lib/store';
import { MOCK_CATEGORIES, MOCK_SUPPLIERS, MOCK_PRODUCTS } from '../../lib/mockData';
import { ProductCard } from '../../components/home/ProductCard';
import { SupplierCard } from '../../components/home/SupplierCard';
import { BadgeIcon } from '../../components/common/BadgeIcon';
import { ProductCardSkeleton } from '../../components/common/SkeletonLoader';

const { width } = Dimensions.get('window');

const BANNER_SLIDES = [
  { id: '1', title: 'منصة B2B الأولى في الجزائر', subtitle: 'آلاف الموردين والمنتجات', color: ['#1B3A5C', '#2A5280'] },
  { id: '2', title: 'تسوق بالجملة بسهولة', subtitle: 'أفضل الأسعار وأسرع التسليم', color: ['#D4AF37', '#B8941F'] },
  { id: '3', title: 'طلب عروض أسعار RFQ', subtitle: 'تفاوض مباشرة مع الموردين', color: ['#0F2238', '#1B3A5C'] },
];

const CATEGORY_ICONS: Record<string, any> = {
  cpu: Cpu, building: Building, utensils: Utensils, shirt: Shirt,
  settings: Settings, 'flask-conical': FlaskConical, armchair: Armchair, car: Car,
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { language, notifications, user } = useAppStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const sliderRef = useRef<FlatList>(null);
  const isRTL = language === 'ar';

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (currentSlide + 1) % BANNER_SLIDES.length;
      setCurrentSlide(next);
      sliderRef.current?.scrollToIndex({ index: next, animated: true });
    }, 4000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const getCategoryName = (cat: any) => {
    if (language === 'ar') return cat.name_ar;
    if (language === 'fr') return cat.name_fr;
    return cat.name_en;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>
        {/* Sticky Header */}
        <View style={styles.header}>
          <SafeAreaView edges={['top']}>
            <View style={styles.headerContent}>
              <View style={styles.logoArea}>
                <Text style={styles.logoText}>Businfo</Text>
                <Text style={styles.logoSub}>{t('app.tagline')}</Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.headerBtn} onPress={() => (navigation as any).navigate('Search')}>
                  <Search size={20} color={COLORS.white} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerBtn} onPress={() => (navigation as any).navigate('Notifications')}>
                  <Bell size={20} color={COLORS.white} />
                  {notifications > 0 && (
                    <View style={styles.notifBadge}>
                      <Text style={styles.notifText}>{notifications}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            {/* Search Bar */}
            <TouchableOpacity
              style={styles.searchBar}
              onPress={() => (navigation as any).navigate('Search')}
              activeOpacity={0.9}
            >
              <Search size={18} color={COLORS.gray400} />
              <Text style={styles.searchPlaceholder}>{t('home.searchPlaceholder')}</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Hero Slider */}
        <View style={styles.sliderContainer}>
          <FlatList
            ref={sliderRef}
            data={BANNER_SLIDES}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentSlide(index);
            }}
            renderItem={({ item }) => (
              <LinearGradient colors={item.color as any} style={styles.slide}>
                <View style={styles.slideContent}>
                  <Text style={styles.slideTitle}>{item.title}</Text>
                  <Text style={styles.slideSub}>{item.subtitle}</Text>
                  <TouchableOpacity
                    style={styles.slideBtn}
                    onPress={() => (navigation as any).navigate('Search')}
                  >
                    <Text style={styles.slideBtnText}>استكشف الآن</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.slideDecor}>
                  <Package size={80} color="rgba(255,255,255,0.15)" />
                </View>
              </LinearGradient>
            )}
          />
          <View style={styles.dots}>
            {BANNER_SLIDES.map((_, i) => (
              <View key={i} style={[styles.dot, i === currentSlide && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* Stats Bar */}
        <View style={styles.statsBar}>
          {[
            { icon: <Package size={18} color={COLORS.gold} />, value: '5,000+', label: 'منتج' },
            { icon: <Truck size={18} color={COLORS.gold} />, value: '500+', label: 'مورد' },
            { icon: <Star size={18} color={COLORS.gold} />, value: '4.8', label: 'تقييم' },
            { icon: <TrendingUp size={18} color={COLORS.gold} />, value: '10K+', label: 'طلب' },
          ].map((stat, i) => (
            <View key={i} style={styles.statItem}>
              {stat.icon}
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.categories')}</Text>
            <TouchableOpacity onPress={() => (navigation as any).navigate('Categories')}>
              <Text style={styles.seeAll}>{t('home.viewAll')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            {MOCK_CATEGORIES.map((cat) => {
              const IconComp = CATEGORY_ICONS[cat.icon] || Package;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.categoryItem}
                  onPress={() => (navigation as any).navigate('Search', { categoryId: cat.id })}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                    <IconComp size={24} color={cat.color} />
                  </View>
                  <Text style={styles.categoryName} numberOfLines={2}>{getCategoryName(cat)}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Featured Suppliers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.featuredSuppliers')}</Text>
            <TouchableOpacity onPress={() => (navigation as any).navigate('Suppliers')}>
              <Text style={styles.seeAll}>{t('home.viewAll')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.lg }}>
            {MOCK_SUPPLIERS.map((supplier) => (
              <SupplierCard key={supplier.id} supplier={supplier} />
            ))}
          </ScrollView>
        </View>

        {/* Ad Banner */}
        <TouchableOpacity style={styles.adBanner} activeOpacity={0.9}>
          <LinearGradient colors={[COLORS.gold, COLORS.goldDark]} style={styles.adGradient}>
            <View style={styles.adContent}>
              <Text style={styles.adTitle}>إعلن عن منتجاتك</Text>
              <Text style={styles.adSub}>وصل إلى آلاف العملاء</Text>
            </View>
            <View style={styles.adAction}>
              <Text style={styles.adActionText}>ابدأ الآن</Text>
              <ChevronRight size={16} color={COLORS.primary} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.featuredProducts')}</Text>
            <TouchableOpacity onPress={() => (navigation as any).navigate('Search')}>
              <Text style={styles.seeAll}>{t('home.viewAll')}</Text>
            </TouchableOpacity>
          </View>
          {isLoading ? (
            <View style={styles.productsGrid}>
              {[1, 2, 3, 4].map((i) => <ProductCardSkeleton key={i} />)}
            </View>
          ) : (
            <View style={styles.productsGrid}>
              {MOCK_PRODUCTS.filter(p => p.is_featured).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </View>
          )}
        </View>

        {/* Trending Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.trending')}</Text>
            <TouchableOpacity><Text style={styles.seeAll}>{t('home.viewAll')}</Text></TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {MOCK_PRODUCTS.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
  logoArea: {},
  logoText: { fontSize: 24, fontWeight: '800', color: COLORS.white, letterSpacing: 1 },
  logoSub: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 1 },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  notifBadge: { position: 'absolute', top: -2, right: -2, backgroundColor: COLORS.gold, borderRadius: 8, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  notifText: { color: COLORS.primary, fontSize: 9, fontWeight: '700' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, gap: 10 },
  searchPlaceholder: { color: COLORS.gray400, fontSize: 14, flex: 1 },
  sliderContainer: { position: 'relative' },
  slide: { width, height: 180, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.xl },
  slideContent: { flex: 1 },
  slideTitle: { fontSize: 20, fontWeight: '800', color: COLORS.white, marginBottom: 6 },
  slideSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 16 },
  slideBtn: { backgroundColor: COLORS.gold, paddingHorizontal: 20, paddingVertical: 8, borderRadius: RADIUS.full, alignSelf: 'flex-start' },
  slideBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
  slideDecor: { opacity: 0.5 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: 10, backgroundColor: COLORS.white },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.gray300 },
  dotActive: { width: 20, backgroundColor: COLORS.primary },
  statsBar: { flexDirection: 'row', backgroundColor: COLORS.primary, paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontSize: 14, fontWeight: '800', color: COLORS.white },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)' },
  section: { marginTop: SPACING.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  categoriesScroll: { paddingHorizontal: SPACING.lg, gap: 12 },
  categoryItem: { alignItems: 'center', width: 72 },
  categoryIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  categoryName: { fontSize: 11, color: COLORS.text, textAlign: 'center', fontWeight: '500' },
  adBanner: { marginHorizontal: SPACING.lg, marginTop: SPACING.xl, borderRadius: RADIUS.lg, overflow: 'hidden' },
  adGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.lg },
  adContent: {},
  adTitle: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  adSub: { fontSize: 12, color: COLORS.primaryDark, marginTop: 2 },
  adAction: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full, gap: 4 },
  adActionText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.md, justifyContent: 'flex-start' },
});
