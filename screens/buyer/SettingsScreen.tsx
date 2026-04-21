import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User, Globe, DollarSign, Bell, Shield, LogOut,
  ChevronRight, Moon, HelpCircle, Star,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../lib/theme';
import { useAppStore, Language, Currency } from '../../lib/store';
import { AppHeader } from '../../components/common/AppHeader';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { user, setUser, language, setLanguage, currency, setCurrency } = useAppStore();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      t('auth.logout'),
      'هل أنت متأكد من تسجيل الخروج؟',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('auth.logout'), onPress: () => setUser(null), style: 'destructive' },
      ]
    );
  };

  const SECTIONS = [
    {
      title: 'الحساب',
      items: [
        { icon: <User size={20} color={COLORS.primary} />, label: 'الملف الشخصي', action: () => {}, hasArrow: true },
        { icon: <Shield size={20} color={COLORS.success} />, label: 'الأمان وكلمة المرور', action: () => {}, hasArrow: true },
      ],
    },
    {
      title: 'التفضيلات',
      items: [
        {
          icon: <Globe size={20} color={COLORS.info} />,
          label: t('nav.settings') + ' - ' + t('common.languages.ar'),
          action: () => {},
          hasArrow: true,
          sublabel: t(`common.languages.${language}`),
        },
        {
          icon: <DollarSign size={20} color={COLORS.gold} />,
          label: 'العملة',
          action: () => {},
          hasArrow: true,
          sublabel: currency,
        },
        {
          icon: <Bell size={20} color={COLORS.warning} />,
          label: 'الإشعارات',
          action: () => {},
          hasSwitch: true,
          switchValue: notifications,
          onSwitchChange: setNotifications,
        },
        {
          icon: <Moon size={20} color={COLORS.gray600} />,
          label: 'الوضع الليلي',
          action: () => {},
          hasSwitch: true,
          switchValue: darkMode,
          onSwitchChange: setDarkMode,
        },
      ],
    },
    {
      title: 'اللغة',
      items: (['ar', 'fr', 'en'] as Language[]).map(lang => ({
        icon: <Globe size={20} color={language === lang ? COLORS.primary : COLORS.gray400} />,
        label: t(`common.languages.${lang}`),
        action: () => setLanguage(lang),
        isSelected: language === lang,
        hasArrow: false,
      })),
    },
    {
      title: 'العملة',
      items: (['DZD', 'EUR', 'USD'] as Currency[]).map(curr => ({
        icon: <DollarSign size={20} color={currency === curr ? COLORS.primary : COLORS.gray400} />,
        label: curr === 'DZD' ? 'دينار جزائري (DZD)' : curr === 'EUR' ? 'يورو (EUR)' : 'دولار أمريكي (USD)',
        action: () => setCurrency(curr),
        isSelected: currency === curr,
        hasArrow: false,
      })),
    },
    {
      title: 'الدعم',
      items: [
        { icon: <HelpCircle size={20} color={COLORS.info} />, label: 'مركز المساعدة', action: () => {}, hasArrow: true },
        { icon: <Star size={20} color={COLORS.gold} />, label: 'تقييم التطبيق', action: () => {}, hasArrow: true },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title={t('nav.settings')} showBack />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>{user?.full_name?.[0] || 'U'}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.full_name || 'مستخدم'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <View style={styles.userRole}>
              <Text style={styles.userRoleText}>
                {user?.role === 'buyer' ? 'مشتري' : user?.role === 'supplier' ? 'مورد' : 'مدير'}
              </Text>
            </View>
          </View>
        </View>

        {SECTIONS.map((section, si) => (
          <View key={si} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item: any, ii) => (
                <TouchableOpacity
                  key={ii}
                  style={[styles.settingItem, ii < section.items.length - 1 && styles.settingItemBorder]}
                  onPress={item.action}
                >
                  <View style={styles.settingIcon}>{item.icon}</View>
                  <View style={styles.settingContent}>
                    <Text style={[styles.settingLabel, item.isSelected && styles.settingLabelActive]}>{item.label}</Text>
                    {item.sublabel && <Text style={styles.settingSublabel}>{item.sublabel}</Text>}
                  </View>
                  {item.hasSwitch && (
                    <Switch
                      value={item.switchValue}
                      onValueChange={item.onSwitchChange}
                      trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
                      thumbColor={COLORS.white}
                    />
                  )}
                  {item.hasArrow && <ChevronRight size={18} color={COLORS.gray400} />}
                  {item.isSelected && <View style={styles.selectedDot} />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>{t('auth.logout')}</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  userCard: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: COLORS.primary, padding: SPACING.xl, marginBottom: SPACING.lg },
  userAvatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.gold, alignItems: 'center', justifyContent: 'center' },
  userAvatarText: { fontSize: 26, fontWeight: '800', color: COLORS.primary },
  userInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: '700', color: COLORS.white },
  userEmail: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  userRole: { backgroundColor: COLORS.gold, paddingHorizontal: 10, paddingVertical: 3, borderRadius: RADIUS.full, alignSelf: 'flex-start', marginTop: 6 },
  userRoleText: { fontSize: 11, color: COLORS.primary, fontWeight: '700' },
  section: { marginHorizontal: SPACING.lg, marginBottom: SPACING.md },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.gray500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, overflow: 'hidden', ...SHADOW.sm },
  settingItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: SPACING.md },
  settingItemBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  settingIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.gray100, alignItems: 'center', justifyContent: 'center' },
  settingContent: { flex: 1 },
  settingLabel: { fontSize: 14, color: COLORS.text, fontWeight: '500' },
  settingLabelActive: { color: COLORS.primary, fontWeight: '700' },
  settingSublabel: { fontSize: 12, color: COLORS.gray500, marginTop: 1 },
  selectedDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, margin: SPACING.lg, backgroundColor: COLORS.errorLight, borderRadius: RADIUS.xl, padding: SPACING.lg },
  logoutText: { fontSize: 15, color: COLORS.error, fontWeight: '700' },
});
