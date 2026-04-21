import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Search, ArrowLeft, ArrowRight, Menu } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SPACING, SHADOW } from '../../lib/theme';
import { useAppStore } from '../../lib/store';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  showMenu?: boolean;
  rightComponent?: React.ReactNode;
  onMenuPress?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = false,
  showSearch = false,
  showNotifications = false,
  showMenu = false,
  rightComponent,
  onMenuPress,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { isRTL, notifications, language } = useAppStore();
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.row}>
        <View style={styles.left}>
          {showBack && (
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
              <BackIcon size={22} color={COLORS.white} />
            </TouchableOpacity>
          )}
          {showMenu && (
            <TouchableOpacity style={styles.iconBtn} onPress={onMenuPress}>
              <Menu size={22} color={COLORS.white} />
            </TouchableOpacity>
          )}
        </View>
        {title && (
          <Text style={[styles.title, { fontFamily: language === 'ar' ? FONTS.cairo.bold : FONTS.inter.bold }]}>
            {title}
          </Text>
        )}
        <View style={styles.right}>
          {showSearch && (
            <TouchableOpacity style={styles.iconBtn} onPress={() => (navigation as any).navigate('Search')}>
              <Search size={20} color={COLORS.white} />
            </TouchableOpacity>
          )}
          {showNotifications && (
            <TouchableOpacity style={styles.iconBtn} onPress={() => (navigation as any).navigate('Notifications')}>
              <Bell size={20} color={COLORS.white} />
              {notifications > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{notifications > 9 ? '9+' : notifications}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          {rightComponent}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    ...SHADOW.md,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { flexDirection: 'row', alignItems: 'center', minWidth: 44 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 44, justifyContent: 'flex-end' },
  title: { fontSize: 18, color: COLORS.white, flex: 1, textAlign: 'center' },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -4, right: -4, backgroundColor: COLORS.gold, borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeText: { color: COLORS.primary, fontSize: 10, fontWeight: '700' },
});
