import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Polygon, Rect } from 'react-native-svg';
import { COLORS } from '../../lib/theme';

interface BadgeIconProps {
  type: 'trusted' | 'premium' | 'bestSeller' | 'freeShipping' | 'qualityGuaranteed';
  size?: number;
  showLabel?: boolean;
}

const TrustedBadge = ({ size }: { size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" fill={COLORS.badge.trusted} />
    <Path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PremiumBadge = ({ size }: { size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill={COLORS.badge.premium} stroke={COLORS.goldDark} strokeWidth="1" />
  </Svg>
);

const BestSellerBadge = ({ size }: { size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" fill={COLORS.badge.bestSeller} />
    <Path d="M9 12l2 2 4-4M8 8h8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

const FreeShippingBadge = ({ size }: { size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="1" y="3" width="15" height="13" rx="2" fill={COLORS.badge.freeShipping} />
    <Path d="M16 8h4l3 3v5h-7V8z" fill={COLORS.badge.freeShipping} />
    <Circle cx="5.5" cy="18.5" r="2.5" fill="white" stroke={COLORS.badge.freeShipping} strokeWidth="1" />
    <Circle cx="18.5" cy="18.5" r="2.5" fill="white" stroke={COLORS.badge.freeShipping} strokeWidth="1" />
  </Svg>
);

const QualityBadge = ({ size }: { size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" fill={COLORS.badge.qualityGuaranteed} />
    <Path d="M8 12l2.5 2.5L16 9" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BADGE_LABELS: Record<string, string> = {
  trusted: 'موثوق',
  premium: 'مميز',
  bestSeller: 'الأكثر مبيعاً',
  freeShipping: 'شحن مجاني',
  qualityGuaranteed: 'ضمان الجودة',
};

export const BadgeIcon: React.FC<BadgeIconProps> = ({ type, size = 24, showLabel = false }) => {
  const renderIcon = () => {
    switch (type) {
      case 'trusted': return <TrustedBadge size={size} />;
      case 'premium': return <PremiumBadge size={size} />;
      case 'bestSeller': return <BestSellerBadge size={size} />;
      case 'freeShipping': return <FreeShippingBadge size={size} />;
      case 'qualityGuaranteed': return <QualityBadge size={size} />;
      default: return null;
    }
  };

  if (!showLabel) return <View>{renderIcon()}</View>;

  return (
    <View style={styles.container}>
      {renderIcon()}
      <Text style={[styles.label, { color: COLORS.badge[type] }]}>{BADGE_LABELS[type]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  label: { fontSize: 10, fontWeight: '600' },
});
