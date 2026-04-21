import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User, Phone, Building, Eye, EyeOff } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, RADIUS } from '../../lib/theme';
import { useAppStore } from '../../lib/store';
import { Button } from '../../components/common/Button';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { setUser } = useAppStore();
  const [role, setRole] = useState<'buyer' | 'supplier'>('buyer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (!fullName || !email || !password) {
      Alert.alert(t('common.error'), 'يرجى ملء جميع الحقول الإلزامية');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(t('common.error'), 'كلمات المرور غير متطابقة');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUser({ id: 'new-user', email, full_name: fullName, phone, role, language: 'ar', currency: 'DZD' });
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>{t('auth.register')}</Text>
          <Text style={styles.subtitle}>أنشئ حسابك وابدأ التجارة في بيزإنفو</Text>
          <View style={styles.roleSelector}>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'buyer' && styles.roleBtnActive]}
              onPress={() => setRole('buyer')}
            >
              <Text style={[styles.roleBtnText, role === 'buyer' && styles.roleBtnTextActive]}>{t('auth.buyerAccount')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'supplier' && styles.roleBtnActive]}
              onPress={() => setRole('supplier')}
            >
              <Text style={[styles.roleBtnText, role === 'supplier' && styles.roleBtnTextActive]}>{t('auth.supplierAccount')}</Text>
            </TouchableOpacity>
          </View>
          {[{ icon: <User size={18} color={COLORS.gray400} />, label: t('auth.fullName'), value: fullName, setter: setFullName, placeholder: 'الاسم الكامل', type: 'default' },
            { icon: <Mail size={18} color={COLORS.gray400} />, label: t('auth.email'), value: email, setter: setEmail, placeholder: 'example@email.com', type: 'email-address' },
            { icon: <Phone size={18} color={COLORS.gray400} />, label: t('auth.phone'), value: phone, setter: setPhone, placeholder: '+213 XXX XXX XXX', type: 'phone-pad' },
            ...(role === 'supplier' ? [{ icon: <Building size={18} color={COLORS.gray400} />, label: 'اسم الشركة', value: company, setter: setCompany, placeholder: 'اسم شركتك', type: 'default' }] : []),
          ].map((field, i) => (
            <View key={i} style={styles.inputGroup}>
              <Text style={styles.label}>{field.label}</Text>
              <View style={styles.inputWrapper}>
                {field.icon}
                <TextInput
                  style={styles.input}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChangeText={field.setter}
                  keyboardType={field.type as any}
                  autoCapitalize={field.type === 'email-address' ? 'none' : 'words'}
                  placeholderTextColor={COLORS.gray400}
                />
              </View>
            </View>
          ))}
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
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('auth.confirmPassword')}</Text>
            <View style={styles.inputWrapper}>
              <Lock size={18} color={COLORS.gray400} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor={COLORS.gray400}
              />
            </View>
          </View>
          <Button title={t('auth.signUp')} onPress={handleRegister} loading={loading} size="lg" style={{ marginTop: 8 }} />
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>{t('auth.alreadyHaveAccount')}</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginLink}>{t('auth.signIn')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scroll: { padding: SPACING.xl },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: COLORS.gray500, marginBottom: 24 },
  roleSelector: { flexDirection: 'row', backgroundColor: COLORS.gray100, borderRadius: RADIUS.lg, padding: 4, marginBottom: 24, gap: 4 },
  roleBtn: { flex: 1, paddingVertical: 12, borderRadius: RADIUS.md, alignItems: 'center' },
  roleBtnActive: { backgroundColor: COLORS.primary },
  roleBtnText: { fontSize: 14, color: COLORS.gray600, fontWeight: '600' },
  roleBtnTextActive: { color: COLORS.white },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.gray100, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, gap: 10, borderWidth: 1, borderColor: COLORS.border },
  input: { flex: 1, fontSize: 15, color: COLORS.text, paddingVertical: 14 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 20 },
  loginText: { fontSize: 14, color: COLORS.gray600 },
  loginLink: { fontSize: 14, color: COLORS.primary, fontWeight: '700' },
});
