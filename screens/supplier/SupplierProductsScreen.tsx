import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Plus, Edit2, Trash2, Eye, EyeOff, Package } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../lib/theme';
import { useAppStore } from '../../lib/store';
import { MOCK_PRODUCTS } from '../../lib/mockData';
import { AppHeader } from '../../components/common/AppHeader';
import { StarRating } from '../../components/common/StarRating';

export default function SupplierProductsScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { formatPrice } = useAppStore();
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  const handleDelete = (productId: string) => {
    Alert.alert(
      t('common.delete'),
      'هل أنت متأكد من حذف هذا المنتج؟',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.delete'), onPress: () => setProducts(prev => prev.filter(p => p.id !== productId)), style: 'destructive' },
      ]
    );
  };

  const handleToggleActive = (productId: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, is_active: !p.is_active } : p));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader
        title={t('supplierDash.myProducts')}
        showBack
        rightComponent={
          <TouchableOpacity style={styles.addBtn} onPress={() => (navigation as any).navigate('AddProduct')}>
            <Plus size={18} color={COLORS.white} />
          </TouchableOpacity>
        }
      />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        renderItem={({ item }) => (
          <View style={[styles.productCard, !item.is_active && styles.productCardInactive]}>
            <Image
              source={{ uri: `https://picsum.photos/seed/${item.id}/200/200` }}
              style={styles.productImage}
              contentFit="cover"
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={2}>{item.name_ar}</Text>
              <StarRating rating={item.rating} size={12} totalReviews={item.total_reviews} />
              <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
              <View style={styles.productMeta}>
                <Text style={styles.productMetaText}>طلبات: {item.total_orders}</Text>
                <Text style={styles.productMetaText}>مخزون: {item.stock_qty}</Text>
              </View>
            </View>
            <View style={styles.productActions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => (navigation as any).navigate('EditProduct', { productId: item.id })}
              >
                <Edit2 size={16} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, item.is_active ? styles.activeBtn : styles.inactiveBtn]}
                onPress={() => handleToggleActive(item.id)}
              >
                {item.is_active ? <Eye size={16} color={COLORS.success} /> : <EyeOff size={16} color={COLORS.gray400} />}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.deleteBtn]}
                onPress={() => handleDelete(item.id)}
              >
                <Trash2 size={16} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  addBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.gold, alignItems: 'center', justifyContent: 'center' },
  productCard: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: 12, ...SHADOW.sm, gap: 12 },
  productCardInactive: { opacity: 0.6 },
  productImage: { width: 80, height: 80, borderRadius: RADIUS.lg },
  productInfo: { flex: 1, gap: 4 },
  productName: { fontSize: 13, fontWeight: '700', color: COLORS.text, lineHeight: 18 },
  productPrice: { fontSize: 15, fontWeight: '800', color: COLORS.primary },
  productMeta: { flexDirection: 'row', gap: 12 },
  productMetaText: { fontSize: 11, color: COLORS.gray500 },
  productActions: { gap: 6, justifyContent: 'center' },
  actionBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: COLORS.gray100, alignItems: 'center', justifyContent: 'center' },
  activeBtn: { backgroundColor: COLORS.successLight },
  inactiveBtn: { backgroundColor: COLORS.gray100 },
  deleteBtn: { backgroundColor: COLORS.errorLight },
});
