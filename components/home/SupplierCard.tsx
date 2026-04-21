import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { MapPin, Star, ShieldCheck } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, RADIUS, SHADOW, SPACING } from '../../lib/theme';
import { useAppStore } from '../../lib/store';
import { BadgeIcon } from '../common/BadgeIcon';

interface SupplierCardProps {
  supplier: any;
  horizontal?: boolean;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({ supplier, horizontal = false }) => {
  const navigation = useNavigation();
  const { language } = useAppStore();

  const getName = () => {
    if (language === 'fr') return supplier.company_name_fr || supplier.company_name;
    return supplier.company_name;
  };

  if (horizontal) {
    return (
      <TouchableOpacity
        style={styles.horizontalCard}
        onPress={() => (navigation as any).navigate('SupplierStore', { supplierId: supplier.id })}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: supplier.logo_url || `https://picsum.photos/seed/${supplier.id}logo/80/80` }}
          style={styles.horizontalLogo}
          contentFit="cover"
        />
        <View style={styles.horizontalContent}>
          <View style={styles.nameRow}>
            <Text style={styles.horizontalName} numberOfLines={1}>{getName()}</Text>
            {supplier.is_verified && <ShieldCheck size={14} color={COLORS.badge.trusted} />}
          </View>
          <View style={styles.ratingRow}>
            <Star size={12} color={COLORS.gold} fill={COLORS.gold} />
            <Text style={styles.rating}>{supplier.rating}</Text>
            <Text style={styles.reviews}>({supplier.total_reviews})</Text>
          </View>
          <View style={styles.locationRow}>
            <MapPin size={11} color={COLORS.gray400} />
            <Text style={styles.location}>{supplier.city}</Text>
          </View>
          <View style={styles.badges}>
            {(supplier.badges || []).slice(0, 3).map((badge: string) => (
              <BadgeIcon key={badge} type={badge as any} size={16} />
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => (navigation as any).navigate('SupplierStore', { supplierId: supplier.id })}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: supplier.cover_url || `https://picsum.photos/seed/${supplier.id}cover/300/120` }}
        style={styles.cover}
        contentFit="cover"
      />
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: supplier.logo_url || `https://picsum.photos/seed/${supplier.id}logo/80/80` }}
          style={styles.logo}
          contentFit="cover"
        />
        {supplier.is_verified && (
          <View style={styles.verifiedBadge}>
            <ShieldCheck size={12} color={COLORS.white} />
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.name} numberOfLines={1}>{getName()}</Text>
        <View style={styles.ratingRow}>
          <Star size={12} color={COLORS.gold} fill={COLORS.gold} />
          <Text style={styles.rating}>{supplier.rating}</Text>
          <Text style={styles.reviews}>({supplier.total_reviews})</Text>
        </View>
        <View style={styles.locationRow}>
          <MapPin size={11} color={COLORS.gray400} />
          <Text style={styles.location}>{supplier.city}</Text>
        </View>
        <View style={styles.badges}>
          {(supplier.badges || []).slice(0, 3).map((badge: string) => (
            <BadgeIcon key={badge} type={badge as any} size={18} />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { width: 200, backgroundColor: COLORS.white, borderRadius: RADIUS.lg, overflow: 'hidden', marginRight: 12, ...SHADOW.md },
  cover: { width: '100%', height: 80 },
  logoContainer: { position: 'absolute', top: 50, left: 12 },
  logo: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: COLORS.white },
  verifiedBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.badge.trusted, borderRadius: 8, padding: 2 },
  cardContent: { padding: 12, paddingTop: 28 },
  name: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 3 },
  rating: { fontSize: 12, fontWeight: '600', color: COLORS.gray700 },
  reviews: { fontSize: 11, color: COLORS.gray500 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 6 },
  location: { fontSize: 11, color: COLORS.gray500 },
  badges: { flexDirection: 'row', gap: 4 },
  horizontalCard: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: 10, ...SHADOW.sm },
  horizontalLogo: { width: 56, height: 56, borderRadius: 28, marginRight: 12 },
  horizontalContent: { flex: 1 },
  horizontalName: { fontSize: 14, fontWeight: '700', color: COLORS.text, flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
});
