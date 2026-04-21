import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../lib/theme';
import { useAppStore } from '../../lib/store';
import { Button } from '../../components/common/Button';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { setUser } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'supplier' | 'admin'>('buyer');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), 'يرجى ملء جميع الحقول');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUser({
        id: 'demo-user',
        email,
        full_name: 'محمد أحمد',
        role: selectedRole,
        language: 'ar',
        currency: 'DZD',
      });
    }, 1500);
  };

  const handleDemoLogin = (role: 'buyer' | 'supplier' | 'admin') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUser({
        id: `demo-${role}`,
        email: `${role}@businfo.dz`,
        full_name: role === 'buyer' ? 'أحمد المشتري' : role === 'supplier' ? 'شركة الجزائر' : 'مدير المنصة',
        role,
        language: 'ar',
        currency: 'DZD',
      });
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <LinearGradient colors={[COLORS.primary, COLORS.primaryLight]} style={styles.header}>
            <Text style={styles.logo}>Businfo</Text>
            <Text style={styles.tagline}>منصة B2B الأولى في الجزائر</Text>
          </LinearGradient>

          <View style={styles.form}>
            <Text style={styles.title}>{t('auth.login')}</Text>
            <Text style={styles.subtitle}>مرحباً بعودتك، سجّل الدخول للمتابعة</Text>

            {/* Role Selector */}
            <View style={styles.roleSelector}>
              {(['buyer', 'supplier', 'admin'] as const).map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[styles.roleBtn, selectedRole === role && styles.roleBtnActive]}
                  onPress={() => setSelectedRole(role)}
                >
                  <Text style={[styles.roleBtnText, selectedRole === role && styles.roleBtnTextActive]}>
                    {role === 'buyer' ? 'مشتري' : role === 'supplier' ? 'مورد' : 'مدير'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('auth.email')}</Text>
              <View style={styles.inputWrapper}>
                <Mail size={18} color={COLORS.gray400} />
                <TextInput
                  style={styles.input}
                  placeholder="example@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={COLORS.gray400}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('auth.password')}</Text>
              <View style={styles.inputWrapper}>
                <Lock size={18} color={COLORS.gray400} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor={COLORS.gray400}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} color={COLORS.gray400} /> : <Eye size={18} color={COLORS.gray400} />}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>{t('auth.forgotPassword')}</Text>
            </TouchableOpacity>

            <Button
              title={t('auth.signIn')}
              onPress={handleLogin}
              loading={loading}
              size="lg"
              style={{ marginTop: 8 }}
              icon={<ArrowRight size={18} color={COLORS.white} />}
            />

            {/* Demo Accounts */}
            <View style={styles.demoSection}>
              <Text style={styles.demoTitle}>حسابات تجريبية</Text>
              <View style={styles.demoButtons}>
                {(['buyer', 'supplier', 'admin'] as const).map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={styles.demoBtn}
                    onPress={() => handleDemoLogin(role)}
                  >
                    <Text style={styles.demoBtnText}>
                      {role === 'buyer' ? 'مشتري' : role === 'supplier' ? 'مورد' : 'مدير'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.registerRow}>
              <Text style={styles.registerText}>{t('auth.noAccount')}</Text>
              <TouchableOpacity onPress={() => (navigation as any).navigate('Register')}>
                <Text style={styles.registerLink}>{t('auth.signUp')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { paddingVertical: 48, paddingHorizontal: SPACING.xl, alignItems: 'center' },
  logo: { fontSize: 36, fontWeight: '900', color: COLORS.white, letterSpacing: 2 },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 6 },
  form: { padding: SPACING.xl },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: COLORS.gray500, marginBottom: 24 },
  roleSelector: { flexDirection: 'row', backgroundColor: COLORS.gray100, borderRadius: RADIUS.lg, padding: 4, marginBottom: 24, gap: 4 },
  roleBtn: { flex: 1, paddingVertical: 10, borderRadius: RADIUS.md, alignItems: 'center' },
  roleBtnActive: { backgroundColor: COLORS.primary, ...SHADOW.sm },
  roleBtnText: { fontSize: 13, color: COLORS.gray600, fontWeight: '600' },
  roleBtnTextActive: { color: COLORS.white },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.gray100, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, gap: 10, borderWidth: 1, borderColor: COLORS.border },
  input: { flex: 1, fontSize: 15, color: COLORS.text, paddingVertical: 14 },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 8 },
  forgotText: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
  demoSection: { marginTop: 24, padding: 16, backgroundColor: COLORS.gray50, borderRadius: RADIUS.lg },
  demoTitle: { fontSize: 13, color: COLORS.gray600, marginBottom: 10, textAlign: 'center' },
  demoButtons: { flexDirection: 'row', gap: 8 },
  demoBtn: { flex: 1, paddingVertical: 10, borderRadius: RADIUS.md, backgroundColor: COLORS.primary + '15', alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary + '30' },
  demoBtnText: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },
  registerRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 20 },
  registerText: { fontSize: 14, color: COLORS.gray600 },
  registerLink: { fontSize: 14, color: COLORS.primary, fontWeight: '700' },
});
