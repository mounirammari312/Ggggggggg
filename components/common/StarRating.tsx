import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { COLORS } from '../../lib/theme';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  showNumber?: boolean;
  totalReviews?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 14,
  showNumber = true,
  totalReviews,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: maxStars }).map((_, i) => (
        <Star
          key={i}
          size={size}
          color={COLORS.gold}
          fill={i < Math.floor(rating) ? COLORS.gold : i < rating ? COLORS.gold : 'transparent'}
          opacity={i < rating ? 1 : 0.3}
        />
      ))}
      {showNumber && (
        <Text style={[styles.number, { fontSize: size }]}>{rating.toFixed(1)}</Text>
      )}
      {totalReviews !== undefined && (
        <Text style={[styles.reviews, { fontSize: size - 2 }]}>({totalReviews})</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  number: { color: COLORS.gray700, fontWeight: '600', marginLeft: 4 },
  reviews: { color: COLORS.gray500 },
});
