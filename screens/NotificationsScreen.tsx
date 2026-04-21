import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Package, MessageSquare, FileText } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, RADIUS, SHADOW } from '../lib/theme';
import { MOCK_NOTIFICATIONS } from '../lib/mockData';
import { AppHeader } from '../components/common/AppHeader';

const NOTIF_ICONS: Record<string, any> = {
  rfq_reply: <FileText size={18} color={COLORS.gold} />,
  order_update: <Package size={18} color={COLORS.info} />,
  message: <MessageSquare size={18} color={COLORS.success} />,
};

export default function NotificationsScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="الإشعارات" showBack />
      <FlatList
        data={MOCK_NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        renderItem={({ item }) => (
          <View style={[styles.notifCard, !item.is_read && styles.notifCardUnread]}>
            <View style={[styles.notifIcon, { backgroundColor: item.is_read ? COLORS.gray100 : COLORS.primary + '15' }]}>
              {NOTIF_ICONS[item.type] || <Bell size={18} color={COLORS.gray400} />}
            </View>
            <View style={styles.notifContent}>
              <Text style={[styles.notifTitle, !item.is_read && styles.notifTitleUnread]}>{item.title}</Text>
              <Text style={styles.notifBody}>{item.body}</Text>
              <Text style={styles.notifTime}>{item.created_at.split('T')[0]}</Text>
            </View>
            {!item.is_read && <View style={styles.unreadDot} />}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  notifCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: 10, gap: 12, ...SHADOW.sm },
  notifCardUnread: { backgroundColor: COLORS.primary + '08', borderLeftWidth: 3, borderLeftColor: COLORS.primary },
  notifIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  notifTitleUnread: { fontWeight: '800', color: COLORS.primary },
  notifBody: { fontSize: 12, color: COLORS.gray600, marginTop: 3, lineHeight: 18 },
  notifTime: { fontSize: 11, color: COLORS.gray400, marginTop: 4 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginTop: 4 },
});
