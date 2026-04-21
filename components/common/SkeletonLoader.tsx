import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, RADIUS } from '../../lib/theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = RADIUS.sm,
  style,
}) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(animValue, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = animValue.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  return (
    <Animated.View
      style={[
        { width: width as any, height, borderRadius, backgroundColor: COLORS.gray200, opacity },
        style,
      ]}
    />
  );
};

export const ProductCardSkeleton = () => (
  <View style={skeletonStyles.card}>
    <Skeleton height={160} borderRadius={12} />
    <View style={skeletonStyles.content}>
      <Skeleton height={14} width="80%" />
      <Skeleton height={12} width="60%" style={{ marginTop: 6 }} />
      <Skeleton height={16} width="40%" style={{ marginTop: 8 }} />
    </View>
  </View>
);

export const SupplierCardSkeleton = () => (
  <View style={skeletonStyles.supplierCard}>
    <Skeleton width={60} height={60} borderRadius={30} />
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Skeleton height={14} width="70%" />
      <Skeleton height={12} width="50%" style={{ marginTop: 6 }} />
      <Skeleton height={12} width="40%" style={{ marginTop: 6 }} />
    </View>
  </View>
);

const skeletonStyles = StyleSheet.create({
  card: { width: 180, backgroundColor: COLORS.white, borderRadius: 12, overflow: 'hidden', margin: 6 },
  content: { padding: 12 },
  supplierCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 16, marginBottom: 12 },
});
