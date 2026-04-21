import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ShoppingBag, FileText, Heart, MessageSquare, Star,
  ChevronRight, Package, Truck, CheckCircle, Clock,
  Bell, Settings, User,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../lib/theme';
import { useAppStore } from '../../lib/store';
import { MOCK_ORDERS, MOCK_RFQS, MOCK_NOTIFICATIONS } from '../../lib/mockData';
import { StatusBadge } from '../../components/common/StatusBadge';

export default function BuyerDashboardScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { user, formatPrice, notifications } = useAppStore();

  const recentOrders = MOCK_ORDERS.slice(0, 3);
  const activeRFQs = MOCK_RFQS.filter(r => r.status !== 'rejected');

  const QUICK_ACTIONS = [
    { icon: <ShoppingBag size={22} color={COLORS.primary} />, label: t('buyer.myOrders'), screen: 'BuyerOrders', count: MOCK_ORDERS.length },
    { icon: <FileText size={22} color={COLORS.gold} />, label: t('buyer.myRFQs'), screen: 'BuyerRFQs', count: MOCK_RFQS.length },
    { icon: <Heart size={22} color={COLORS.error} />, label: t('buyer.myFavorites'), screen: 'Favorites', count: 5 },
    { icon: <MessageSquare size={22} color={COLORS.success} />, label: t('buyer.myMessages'), screen: 'Messages', count: 2 },
    { icon: <Star size={22} color={COLORS.gold} />, label: t('buyer.myReviews'), screen: 'BuyerReviews', count: 3 },
    { icon: <Settings size={22} color={COLORS.gray500} />, label: t('nav.settings'), screen: 'Settings', count: 0 },
  ];

  const ORDER_STATUS_ICONS: Record<string, any> = {
    pending: <Clock size={16} color={COLORS.warning} />,
    processing: <Package size={16} color={COLORS.info} />,
    shipped: <Truck size={16} color={COLORS.info} />,
    delivered: <CheckCircle size={16} color={COLORS.success} />,
    cancelled: <Package size={16} color={COLORS.error} />,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={[COLORS.primary, COLORS.primaryLight]} style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user?.full_name?.[0] || 'U'}</Text>
              </View>
              <View>
                <Text style={styles.greeting}>مرحباً,</Text>
                <Text style={styles.userName}>{user?.full_name || 'مستخدم'}</Text>
              </View>
            </View>
            <View style={styles.headerBtns}>
              <TouchableOpacity style={styles.headerBtn} onPress={() => (navigation as any).navigate('Notifications')}>
                <Bell size={20} color={COLORS.white} />
                {notifications > 0 && <View style={styles.notifDot} />}
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerBtn} onPress={() => (navigation as any).navigate('Settings')}>
                <Settings size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              { label: 'طلباتي', value: MOCK_ORDERS.length, color: COLORS.gold },
              { label: 'عروض أسعار', value: MOCK_RFQS.length, color: '#A78BFA' },
              { label: 'رسائل', value: 4, color: '#34D399' },
            ].map((stat, i) => (
              <View key={i} style={styles.statCard}>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الوصول السريع</Text>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action, i) => (
              <TouchableOpacity
                key={i}
                style={styles.actionCard}
                onPress={() => (navigation as any).navigate(action.screen)}
              >
                <View style={styles.actionIcon}>{action.icon}</View>
                <Text style={styles.actionLabel}>{action.label}</Text>
                {action.count > 0 && (
                  <View style={styles.actionBadge}>
                    <Text style={styles.actionBadgeText}>{action.count}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('buyer.myOrders')}</Text>
            <TouchableOpacity onPress={() => (navigation as any).navigate('BuyerOrders')}>
              <Text style={styles.seeAll}>{t('home.viewAll')}</Text>
            </TouchableOpacity>
          </View>
          {recentOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => (navigation as any).navigate('OrderDetail', { orderId: order.id })}
            >
              <View style={styles.orderIcon}>
                {ORDER_STATUS_ICONS[order.status] || <Package size={16} color={COLORS.gray400} />}
              </View>
              <View style={styles.orderInfo}>
                <Text style={styles.orderId}>#{order.id.toUpperCase()}</Text>
                <Text style={styles.orderDate}>{order.created_at}</Text>
              </View>
              <View style={styles.orderRight}>
                <Text style={styles.orderTotal}>{formatPrice(order.total)}</Text>
                <StatusBadge status={order.status as any} label={t(`common.status.${order.status}`)} size="sm" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Active RFQs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('buyer.myRFQs')}</Text>
            <TouchableOpacity onPress={() => (navigation as any).navigate('BuyerRFQs')}>
              <Text style={styles.seeAll}>{t('home.viewAll')}</Text>
            </TouchableOpacity>
          </View>
          {activeRFQs.map((rfq) => (
            <TouchableOpacity
              key={rfq.id}
              style={styles.rfqCard}
              onPress={() => (navigation as any).navigate('RFQDetail', { rfqId: rfq.id })}
            >
              <View style={styles.rfqInfo}>
                <Text style={styles.rfqId}>طلب #{rfq.id.toUpperCase()}</Text>
                <Text style={styles.rfqQty}>كمية: {rfq.quantity} وحدة</Text>
                <Text style={styles.rfqPrice}>سعر مستهدف: {formatPrice(rfq.target_price)}</Text>
              </View>
              <View style={styles.rfqRight}>
                <StatusBadge status={rfq.status as any} label={t(`rfq.${rfq.status}`)} size="sm" />
                <Text style={styles.rfqReplies}>{rfq.replies.length} ردود</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>آخر الإشعارات</Text>
            <TouchableOpacity onPress={() => (navigation as any).navigate('Notifications')}>
              <Text style={styles.seeAll}>{t('home.viewAll')}</Text>
            </TouchableOpacity>
          </View>
          {MOCK_NOTIFICATIONS.slice(0, 3).map((notif) => (
            <View key={notif.id} style={[styles.notifCard, !notif.is_read && styles.notifCardUnread]}>
              <View style={[styles.notifDotIcon, { backgroundColor: notif.is_read ? COLORS.gray300 : COLORS.primary }]} />
              <View style={styles.notifContent}>
                <Text style={styles.notifTitle}>{notif.title}</Text>
                <Text style={styles.notifBody}>{notif.body}</Text>
                <Text style={styles.notifTime}>{notif.created_at.split('T')[0]}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.lg, paddingBottom: SPACING.xl },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.gold, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
  greeting: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  userName: { fontSize: 16, fontWeight: '700', color: COLORS.white },
  headerBtns: { flexDirection: 'row', gap: 8 },
  headerBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  notifDot: { position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.gold },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: RADIUS.lg, padding: 12, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '800' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  section: { margin: SPACING.lg, backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.lg, ...SHADOW.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionCard: { width: '30%', backgroundColor: COLORS.gray50, borderRadius: RADIUS.lg, padding: 12, alignItems: 'center', gap: 6, position: 'relative' },
  actionIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', ...SHADOW.sm },
  actionLabel: { fontSize: 11, color: COLORS.gray700, textAlign: 'center', fontWeight: '500' },
  actionBadge: { position: 'absolute', top: 6, right: 6, backgroundColor: COLORS.primary, borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  actionBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: '700' },
  orderCard: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  orderIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.gray100, alignItems: 'center', justifyContent: 'center' },
  orderInfo: { flex: 1 },
  orderId: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  orderDate: { fontSize: 11, color: COLORS.gray500, marginTop: 2 },
  orderRight: { alignItems: 'flex-end', gap: 4 },
  orderTotal: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  rfqCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rfqInfo: { flex: 1 },
  rfqId: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  rfqQty: { fontSize: 12, color: COLORS.gray600, marginTop: 2 },
  rfqPrice: { fontSize: 12, color: COLORS.primary, marginTop: 2 },
  rfqRight: { alignItems: 'flex-end', gap: 4 },
  rfqReplies: { fontSize: 11, color: COLORS.gray500 },
  notifCard: { flexDirection: 'row', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  notifCardUnread: { backgroundColor: COLORS.primary + '08', borderRadius: RADIUS.md, paddingHorizontal: 8 },
  notifDotIcon: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  notifBody: { fontSize: 12, color: COLORS.gray600, marginTop: 2 },
  notifTime: { fontSize: 11, color: COLORS.gray400, marginTop: 4 },
});
