import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Heart, ShoppingBag } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, RADIUS, SHADOW, SPACING } from '../../lib/theme';
import { useAppStore } from '../../lib/store';
import { StarRating } from '../common/StarRating';
import { BadgeIcon } from '../common/BadgeIcon';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface ProductCardProps {
  product: any;
  onPress?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const navigation = useNavigation();
  const { isFavorite, toggleFavorite, formatPrice, language } = useAppStore();
  const fav = isFavorite(product.id);

  const getName = () => {
    if (language === 'ar') return product.name_ar;
    if (language === 'fr') return product.name_fr;
    return product.name_en;
  };

  const handlePress = () => {
    if (onPress) { onPress(); return; }
    (navigation as any).navigate('ProductDetail', { productId: product.id });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.images?.[0] || `https://picsum.photos/seed/${product.id}/300/300` }}
          style={styles.image}
          contentFit="cover"
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        />
        <TouchableOpacity
          style={[styles.favBtn, fav && styles.favBtnActive]}
          onPress={() => toggleFavorite(product.id)}
        >
          <Heart size={16} color={fav ? COLORS.error : COLORS.gray400} fill={fav ? COLORS.error : 'transparent'} />
        </TouchableOpacity>
        {product.is_featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>مميز</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>{getName()}</Text>
        <StarRating rating={product.rating} size={11} totalReviews={product.total_reviews} />
        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            <Text style={styles.minOrder}>الحد الأدنى: {product.min_order_qty} {product.unit}</Text>
          </View>
          <TouchableOpacity style={styles.cartBtn} onPress={handlePress}>
            <ShoppingBag size={14} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    margin: 6,
    ...SHADOW.md,
  },
  imageContainer: { position: 'relative' },
  image: { width: '100%', height: 150 },
  favBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: 'center', justifyContent: 'center',
    ...SHADOW.sm,
  },
  favBtnActive: { backgroundColor: '#FFF0F0' },
  featuredBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: COLORS.gold,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  featuredText: { color: COLORS.primary, fontSize: 10, fontWeight: '700' },
  content: { padding: SPACING.sm },
  name: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 4, lineHeight: 18 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 6 },
  price: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  minOrder: { fontSize: 10, color: COLORS.textSecondary, marginTop: 2 },
  cartBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
});
