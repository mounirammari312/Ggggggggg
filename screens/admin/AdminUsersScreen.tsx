import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, UserCheck, UserX, Shield, User, Store } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../lib/theme';
import { AppHeader } from '../../components/common/AppHeader';
import { StatusBadge } from '../../components/common/StatusBadge';

const MOCK_USERS = [
  { id: 'u1', name: 'محمد أحمد', email: 'buyer1@email.com', role: 'buyer', status: 'active', joined: '2024-01-15', orders: 12 },
  { id: 'u2', name: 'شركة الجزائر', email: 'supplier1@email.com', role: 'supplier', status: 'active', joined: '2024-02-01', orders: 234 },
  { id: 'u3', name: 'فاطمة بن علي', email: 'buyer2@email.com', role: 'buyer', status: 'active', joined: '2024-02-10', orders: 5 },
  { id: 'u4', name: 'مؤسسة البناء', email: 'supplier2@email.com', role: 'supplier', status: 'inactive', joined: '2024-03-01', orders: 89 },
  { id: 'u5', name: 'كريم بوعلام', email: 'buyer3@email.com', role: 'buyer', status: 'active', joined: '2024-03-05', orders: 3 },
  { id: 'u6', name: 'مجمع الغذاء', email: 'supplier3@email.com', role: 'supplier', status: 'active', joined: '2024-03-10', orders: 412 },
];

export default function AdminUsersScreen() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'buyer' | 'supplier'>('all');
  const [users, setUsers] = useState(MOCK_USERS);

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search);
    const matchFilter = filter === 'all' || u.role === filter;
    return matchSearch && matchFilter;
  });

  const handleToggleStatus = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  const handleDelete = (userId: string) => {
    Alert.alert(
      t('common.delete'),
      'هل أنت متأكد من حذف هذا المستخدم؟',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.delete'), onPress: () => setUsers(prev => prev.filter(u => u.id !== userId)), style: 'destructive' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title={t('admin.users')} showBack />
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={18} color={COLORS.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="بحث عن مستخدم..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={COLORS.gray400}
          />
        </View>
        <View style={styles.filterTabs}>
          {(['all', 'buyer', 'supplier'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterTab, filter === f && styles.filterTabActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
                {f === 'all' ? 'الكل' : f === 'buyer' ? 'مشترين' : 'موردين'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={[styles.userAvatar, { backgroundColor: item.role === 'supplier' ? COLORS.primary : COLORS.gold }]}>
              {item.role === 'supplier' ? <Store size={20} color={COLORS.white} /> : <User size={20} color={COLORS.primary} />}
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
              <View style={styles.userMeta}>
                <Text style={styles.userMetaText}>انضم {item.joined}</Text>
                <Text style={styles.userMetaText}>• {item.orders} طلب</Text>
              </View>
            </View>
            <View style={styles.userActions}>
              <StatusBadge status={item.status as any} label={t(`common.status.${item.status}`)} size="sm" />
              <View style={styles.actionBtns}>
                <TouchableOpacity
                  style={[styles.actionBtn, item.status === 'active' ? styles.deactivateBtn : styles.activateBtn]}
                  onPress={() => handleToggleStatus(item.id)}
                >
                  {item.status === 'active' ? <UserX size={14} color={COLORS.error} /> : <UserCheck size={14} color={COLORS.success} />}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchSection: { backgroundColor: COLORS.white, padding: SPACING.lg, gap: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.gray100, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.text, paddingVertical: 10 },
  filterTabs: { flexDirection: 'row', gap: 8 },
  filterTab: { flex: 1, paddingVertical: 8, borderRadius: RADIUS.lg, alignItems: 'center', backgroundColor: COLORS.gray100 },
  filterTabActive: { backgroundColor: COLORS.primary },
  filterTabText: { fontSize: 13, color: COLORS.gray600, fontWeight: '600' },
  filterTabTextActive: { color: COLORS.white },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: 10, ...SHADOW.sm, gap: 12 },
  userAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  userInfo: { flex: 1 },
  userName: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  userEmail: { fontSize: 12, color: COLORS.gray500, marginTop: 1 },
  userMeta: { flexDirection: 'row', gap: 4, marginTop: 2 },
  userMetaText: { fontSize: 11, color: COLORS.gray400 },
  userActions: { alignItems: 'flex-end', gap: 6 },
  actionBtns: { flexDirection: 'row', gap: 6 },
  actionBtn: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  activateBtn: { backgroundColor: COLORS.successLight },
  deactivateBtn: { backgroundColor: COLORS.errorLight },
});
