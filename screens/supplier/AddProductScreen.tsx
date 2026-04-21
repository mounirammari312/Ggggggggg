import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Camera, Plus, X, ChevronDown } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../lib/theme';
import { MOCK_CATEGORIES } from '../../lib/mockData';
import { AppHeader } from '../../components/common/AppHeader';
import { Button } from '../../components/common/Button';

export default function AddProductScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [nameAr, setNameAr] = useState('');
  const [nameFr, setNameFr] = useState('');
  const [descAr, setDescAr] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('DZD');
  const [minQty, setMinQty] = useState('');
  const [unit, setUnit] = useState('قطعة');
  const [stock, setStock] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const UNITS = ['قطعة', 'كيلوغرام', 'لتر', 'متر', 'كيس', 'صندوق', 'طن'];

  const handleAddImage = () => {
    const mockImages = [
      'https://picsum.photos/seed/prod1/400/400',
      'https://picsum.photos/seed/prod2/400/400',
      'https://picsum.photos/seed/prod3/400/400',
    ];
    if (images.length < 5) {
      setImages(prev => [...prev, mockImages[prev.length % mockImages.length]]);
    }
  };

  const handleSubmit = () => {
    if (!nameAr || !price || !minQty || !selectedCategory) {
      Alert.alert(t('common.error'), 'يرجى ملء جميع الحقول الإلزامية');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(t('common.success'), 'تم إضافة المنتج بنجاح');
      navigation.goBack();
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title={t('supplierDash.addProduct')} showBack />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Images */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>صور المنتج</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imagesRow}>
              {images.map((img, i) => (
                <View key={i} style={styles.imageWrapper}>
                  <Image source={{ uri: img }} style={styles.imagePreview} contentFit="cover" />
                  <TouchableOpacity style={styles.removeImage} onPress={() => setImages(prev => prev.filter((_, idx) => idx !== i))}>
                    <X size={12} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              ))}
              {images.length < 5 && (
                <TouchableOpacity style={styles.addImageBtn} onPress={handleAddImage}>
                  <Camera size={24} color={COLORS.gray400} />
                  <Text style={styles.addImageText}>إضافة</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>معلومات أساسية</Text>
            {[
              { label: 'اسم المنتج (عربي) *', value: nameAr, setter: setNameAr, placeholder: 'اسم المنتج بالعربية' },
              { label: 'اسم المنتج (فرنسي)', value: nameFr, setter: setNameFr, placeholder: 'Nom du produit en français' },
            ].map((field, i) => (
              <View key={i} style={styles.inputGroup}>
                <Text style={styles.label}>{field.label}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChangeText={field.setter}
                  placeholderTextColor={COLORS.gray400}
                />
              </View>
            ))}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>الوصف (عربي)</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="وصف تفصيلي للمنتج..."
                value={descAr}
                onChangeText={setDescAr}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor={COLORS.gray400}
              />
            </View>
          </View>

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الفئة *</Text>
            <View style={styles.categoriesGrid}>
              {MOCK_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryChip, selectedCategory === cat.id && styles.categoryChipActive]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Text style={[styles.categoryChipText, selectedCategory === cat.id && styles.categoryChipTextActive]}>
                    {cat.name_ar}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Pricing */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>التسعير</Text>
            <View style={styles.priceRow}>
              <View style={[styles.inputGroup, { flex: 2 }]}>
                <Text style={styles.label}>السعر *</Text>
                <TextInput style={styles.input} placeholder="0.00" value={price} onChangeText={setPrice} keyboardType="numeric" placeholderTextColor={COLORS.gray400} />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>العملة</Text>
                <View style={styles.currencyPicker}>
                  {(['DZD', 'EUR', 'USD'] as const).map((c) => (
                    <TouchableOpacity
                      key={c}
                      style={[styles.currencyOption, currency === c && styles.currencyOptionActive]}
                      onPress={() => setCurrency(c)}
                    >
                      <Text style={[styles.currencyOptionText, currency === c && styles.currencyOptionTextActive]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            <View style={styles.priceRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>الحد الأدنى *</Text>
                <TextInput style={styles.input} placeholder="1" value={minQty} onChangeText={setMinQty} keyboardType="numeric" placeholderTextColor={COLORS.gray400} />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>الوحدة</Text>
                <View style={styles.unitSelector}>
                  {UNITS.slice(0, 4).map((u) => (
                    <TouchableOpacity
                      key={u}
                      style={[styles.unitOption, unit === u && styles.unitOptionActive]}
                      onPress={() => setUnit(u)}
                    >
                      <Text style={[styles.unitOptionText, unit === u && styles.unitOptionTextActive]}>{u}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>المخزون المتاح</Text>
              <TextInput style={styles.input} placeholder="كمية المخزون" value={stock} onChangeText={setStock} keyboardType="numeric" placeholderTextColor={COLORS.gray400} />
            </View>
          </View>

          <Button
            title={t('supplierDash.addProduct')}
            onPress={handleSubmit}
            loading={loading}
            size="lg"
            style={{ marginHorizontal: SPACING.lg, marginBottom: SPACING.lg }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingBottom: 40 },
  section: { backgroundColor: COLORS.white, marginBottom: 8, padding: SPACING.lg },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  imagesRow: { gap: 10 },
  imageWrapper: { position: 'relative' },
  imagePreview: { width: 90, height: 90, borderRadius: RADIUS.lg },
  removeImage: { position: 'absolute', top: -6, right: -6, backgroundColor: COLORS.error, borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  addImageBtn: { width: 90, height: 90, borderRadius: RADIUS.lg, borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 4 },
  addImageText: { fontSize: 11, color: COLORS.gray400 },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  input: { backgroundColor: COLORS.gray100, borderRadius: RADIUS.md, padding: 12, fontSize: 14, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border },
  textarea: { height: 100, textAlignVertical: 'top' },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full, backgroundColor: COLORS.gray100, borderWidth: 1, borderColor: COLORS.border },
  categoryChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  categoryChipText: { fontSize: 12, color: COLORS.gray600 },
  categoryChipTextActive: { color: COLORS.white },
  priceRow: { flexDirection: 'row', gap: 10 },
  currencyPicker: { flexDirection: 'row', gap: 4 },
  currencyOption: { flex: 1, paddingVertical: 10, borderRadius: RADIUS.md, backgroundColor: COLORS.gray100, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  currencyOptionActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  currencyOptionText: { fontSize: 11, color: COLORS.gray600, fontWeight: '600' },
  currencyOptionTextActive: { color: COLORS.white },
  unitSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  unitOption: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: RADIUS.md, backgroundColor: COLORS.gray100, borderWidth: 1, borderColor: COLORS.border },
  unitOptionActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  unitOptionText: { fontSize: 11, color: COLORS.gray600 },
  unitOptionTextActive: { color: COLORS.white },
});
