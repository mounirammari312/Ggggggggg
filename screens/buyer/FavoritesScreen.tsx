import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING } from '../../lib/theme';
import { useAppStore } from '../../lib/store';
import { MOCK_PRODUCTS } from '../../lib/mockData';
import { ProductCard } from '../../components/home/ProductCard';
import { EmptyState } from '../../components/common/EmptyState';
import { AppHeader } from '../../components/common/AppHeader';

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const { favorites } = useAppStore();

  const favoriteProducts = MOCK_PRODUCTS.filter(p => favorites.includes(p.id));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title={t('buyer.myFavorites')} showBack />
      {favoriteProducts.length === 0 ? (
        <EmptyState
          icon={<Heart size={56} color={COLORS.gray300} />}
          title="لا توجد منتجات مفضلة"
          description="أضف منتجات إلى قائمة المفضلة بالضغط على أيقونة القلب"
        />
      ) : (
        <FlatList
          data={favoriteProducts}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProductCard product={item} />}
          contentContainerStyle={{ padding: SPACING.md }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
});
