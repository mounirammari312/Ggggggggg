import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, ScrollView, Modal, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X, SlidersHorizontal, ChevronDown, Star, Package } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../lib/theme';
import { useAppStore } from '../../lib/store';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../../lib/mockData';
import { ProductCard } from '../../components/home/ProductCard';
import { EmptyState } from '../../components/common/EmptyState';

const SORT_OPTIONS = [
  { id: 'relevance', label: 'الأكثر صلة' },
  { id: 'price_asc', label: 'السعر: الأقل أولاً' },
  { id: 'price_desc', label: 'السعر: الأعلى أولاً' },
  { id: 'rating', label: 'التقييم الأعلى' },
  { id: 'orders', label: 'الأكثر طلباً' },
];

export default function SearchScreen({ route }: any) {
  const { t } = useTranslation();
  const { language, formatPrice } = useAppStore();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(route?.params?.categoryId || '');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const getCategoryName = (cat: any) => {
    if (language === 'ar') return cat.name_ar;
    if (language === 'fr') return cat.name_fr;
    return cat.name_en;
  };

  const getProductName = (p: any) => {
    if (language === 'ar') return p.name_ar;
    if (language === 'fr') return p.name_fr;
    return p.name_en;
  };

  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    const name = getProductName(p).toLowerCase();
    const matchesQuery = !query || name.includes(query.toLowerCase());
    const matchesCategory = !selectedCategory || p.category_id === selectedCategory;
    const matchesMinPrice = !minPrice || p.price >= Number(minPrice);
    const matchesMaxPrice = !maxPrice || p.price <= Number(maxPrice);
    const matchesRating = p.rating >= minRating;
    return matchesQuery && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesRating;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'orders') return b.total_orders - a.total_orders;
    return 0;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchRow}>
          <View style={styles.searchInput}>
            <Search size={18} color={COLORS.gray400} />
            <TextInput
              style={styles.input}
              placeholder={t('home.searchPlaceholder')}
              placeholderTextColor={COLORS.gray400}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <X size={16} color={COLORS.gray400} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilters(true)}>
            <SlidersHorizontal size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Category Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <TouchableOpacity
            style={[styles.chip, !selectedCategory && styles.chipActive]}
            onPress={() => setSelectedCategory('')}
          >
            <Text style={[styles.chipText, !selectedCategory && styles.chipTextActive]}>الكل</Text>
          </TouchableOpacity>
          {MOCK_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.chip, selectedCategory === cat.id && styles.chipActive]}
              onPress={() => setSelectedCategory(selectedCategory === cat.id ? '' : cat.id)}
            >
              <Text style={[styles.chipText, selectedCategory === cat.id && styles.chipTextActive]}>
                {getCategoryName(cat)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results & Sort */}
        <View style={styles.resultsRow}>
          <Text style={styles.resultsCount}>{filteredProducts.length} نتيجة</Text>
          <TouchableOpacity style={styles.sortBtn} onPress={() => setShowSort(true)}>
            <Text style={styles.sortText}>{SORT_OPTIONS.find(s => s.id === sortBy)?.label}</Text>
            <ChevronDown size={14} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          title={t('common.noData')}
          description="جرب كلمات بحث أخرى أو عدّل الفلاتر"
          actionLabel="مسح الفلاتر"
          onAction={() => { setQuery(''); setSelectedCategory(''); }}
        />
      ) : (
        <FlatList
          data={filteredProducts}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProductCard product={item} />}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Sort Modal */}
      <Modal visible={showSort} transparent animationType="slide" onRequestClose={() => setShowSort(false)}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowSort(false)} activeOpacity={1}>
          <View style={styles.sortSheet}>
            <Text style={styles.sheetTitle}>ترتيب حسب</Text>
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={styles.sortOption}
                onPress={() => { setSortBy(opt.id); setShowSort(false); }}
              >
                <Text style={[styles.sortOptionText, sortBy === opt.id && styles.sortOptionActive]}>{opt.label}</Text>
                {sortBy === opt.id && <View style={styles.sortCheck} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Filter Modal */}
      <Modal visible={showFilters} transparent animationType="slide" onRequestClose={() => setShowFilters(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.filterSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>تصفية النتائج</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <X size={22} color={COLORS.gray600} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <Text style={styles.filterLabel}>نطاق السعر (د.ج)</Text>
              <View style={styles.priceRow}>
                <TextInput
                  style={styles.priceInput}
                  placeholder="من"
                  value={minPrice}
                  onChangeText={setMinPrice}
                  keyboardType="numeric"
                />
                <Text style={styles.priceSep}>-</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="إلى"
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                  keyboardType="numeric"
                />
              </View>
              <Text style={styles.filterLabel}>التقييم الأدنى</Text>
              <View style={styles.ratingRow}>
                {[0, 3, 4, 4.5].map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.ratingChip, minRating === r && styles.ratingChipActive]}
                    onPress={() => setMinRating(r)}
                  >
                    <Star size={12} color={minRating === r ? COLORS.white : COLORS.gold} fill={COLORS.gold} />
                    <Text style={[styles.ratingChipText, minRating === r && styles.ratingChipTextActive]}>
                      {r === 0 ? 'الكل' : `${r}+`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyBtnText}>تطبيق الفلاتر</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.white, paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: 0, ...SHADOW.sm },
  searchRow: { flexDirection: 'row', gap: 10, marginBottom: SPACING.md },
  searchInput: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.gray100, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, gap: 8 },
  input: { flex: 1, fontSize: 14, color: COLORS.text, paddingVertical: 10 },
  filterBtn: { width: 44, height: 44, borderRadius: RADIUS.md, backgroundColor: COLORS.primary + '15', alignItems: 'center', justifyContent: 'center' },
  chips: { paddingBottom: SPACING.md, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: RADIUS.full, backgroundColor: COLORS.gray100, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 12, color: COLORS.gray600, fontWeight: '500' },
  chipTextActive: { color: COLORS.white },
  resultsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  resultsCount: { fontSize: 13, color: COLORS.gray500 },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sortText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  grid: { padding: SPACING.md },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sortSheet: { backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: SPACING.xl },
  filterSheet: { backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: SPACING.xl, maxHeight: '80%' },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  sheetTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  sortOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  sortOptionText: { fontSize: 15, color: COLORS.gray700 },
  sortOptionActive: { color: COLORS.primary, fontWeight: '700' },
  sortCheck: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  filterLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 10, marginTop: 16 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  priceInput: { flex: 1, backgroundColor: COLORS.gray100, borderRadius: RADIUS.md, padding: 10, fontSize: 14, textAlign: 'center' },
  priceSep: { fontSize: 16, color: COLORS.gray400 },
  ratingRow: { flexDirection: 'row', gap: 8 },
  ratingChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full, backgroundColor: COLORS.gray100, borderWidth: 1, borderColor: COLORS.border },
  ratingChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  ratingChipText: { fontSize: 12, color: COLORS.gray600 },
  ratingChipTextActive: { color: COLORS.white },
  applyBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, padding: 16, alignItems: 'center', marginTop: 20 },
  applyBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
