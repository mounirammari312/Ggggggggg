import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Modal, TextInput, Alert, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileText, Send, MessageSquare, ChevronDown, X, Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../lib/theme';
import { useAppStore } from '../../lib/store';
import { MOCK_RFQS, MOCK_PRODUCTS } from '../../lib/mockData';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { AppHeader } from '../../components/common/AppHeader';
import { Button } from '../../components/common/Button';

export default function RFQsScreen() {
  const { t } = useTranslation();
  const { formatPrice } = useAppStore();
  const [selectedRFQ, setSelectedRFQ] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyPrice, setReplyPrice] = useState('');

  const getProductName = (productId: string) => {
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    return product?.name_ar || 'منتج غير معروف';
  };

  const handleSendReply = () => {
    if (!replyMessage && !replyPrice) {
      Alert.alert('خطأ', 'يرجى إدخال رد');
      return;
    }
    Alert.alert('تم بنجاح', 'تم إرسال ردك');
    setReplyMessage('');
    setReplyPrice('');
    setSelectedRFQ(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title={t('buyer.myRFQs')} showBack />
      {MOCK_RFQS.length === 0 ? (
        <EmptyState title="لا توجد طلبات" description="ابدأ بطلب عروض أسعار من الموردين" />
      ) : (
        <FlatList
          data={MOCK_RFQS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: SPACING.lg }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.rfqCard} onPress={() => setSelectedRFQ(item)}>
              <View style={styles.rfqHeader}>
                <View style={styles.rfqIconWrapper}>
                  <FileText size={20} color={COLORS.primary} />
                </View>
                <View style={styles.rfqInfo}>
                  <Text style={styles.rfqId}>طلب #{item.id.toUpperCase()}</Text>
                  <Text style={styles.rfqProduct} numberOfLines={1}>{getProductName(item.product_id)}</Text>
                </View>
                <StatusBadge status={item.status as any} label={t(`rfq.${item.status}`)} size="sm" />
              </View>
              <View style={styles.rfqDetails}>
                <View style={styles.rfqDetailItem}>
                  <Text style={styles.rfqDetailLabel}>كمية</Text>
                  <Text style={styles.rfqDetailValue}>{item.quantity}</Text>
                </View>
                <View style={styles.rfqDetailItem}>
                  <Text style={styles.rfqDetailLabel}>سعر مستهدف</Text>
                  <Text style={styles.rfqDetailValue}>{formatPrice(item.target_price)}</Text>
                </View>
                <View style={styles.rfqDetailItem}>
                  <Text style={styles.rfqDetailLabel}>ردود</Text>
                  <Text style={styles.rfqDetailValue}>{item.replies.length}</Text>
                </View>
              </View>
              {item.replies.length > 0 && (
                <View style={styles.latestReply}>
                  <MessageSquare size={12} color={COLORS.primary} />
                  <Text style={styles.latestReplyText} numberOfLines={1}>
                    {item.replies[item.replies.length - 1].message}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      )}

      {/* RFQ Detail Modal */}
      <Modal visible={!!selectedRFQ} animationType="slide" onRequestClose={() => setSelectedRFQ(null)}>
        <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom']}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('rfq.title')}</Text>
            <TouchableOpacity onPress={() => setSelectedRFQ(null)}>
              <X size={22} color={COLORS.gray600} />
            </TouchableOpacity>
          </View>
          {selectedRFQ && (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: SPACING.lg }}>
              <View style={styles.rfqSummary}>
                <Text style={styles.rfqSummaryTitle}>{getProductName(selectedRFQ.product_id)}</Text>
                <View style={styles.rfqSummaryDetails}>
                  <Text style={styles.rfqSummaryItem}>كمية: {selectedRFQ.quantity}</Text>
                  <Text style={styles.rfqSummaryItem}>سعر مستهدف: {formatPrice(selectedRFQ.target_price)}</Text>
                  <StatusBadge status={selectedRFQ.status} label={t(`rfq.${selectedRFQ.status}`)} />
                </View>
                {selectedRFQ.message && (
                  <View style={styles.rfqMessage}>
                    <Text style={styles.rfqMessageText}>{selectedRFQ.message}</Text>
                  </View>
                )}
              </View>

              {/* Chat/Replies */}
              <Text style={styles.repliesTitle}>{t('rfq.replies')} ({selectedRFQ.replies.length})</Text>
              {selectedRFQ.replies.map((reply: any) => (
                <View key={reply.id} style={[
                  styles.replyBubble,
                  reply.sender === 'buyer' ? styles.replyBubbleBuyer : styles.replyBubbleSupplier,
                ]}>
                  <Text style={styles.replySender}>
                    {reply.sender === 'buyer' ? 'أنت' : 'المورد'}
                  </Text>
                  {reply.price && (
                    <Text style={styles.replyPrice}>{formatPrice(reply.price)}</Text>
                  )}
                  <Text style={styles.replyMessage}>{reply.message}</Text>
                  <Text style={styles.replyTime}>{reply.created_at.split('T')[0]}</Text>
                </View>
              ))}

              {/* Reply Form */}
              {selectedRFQ.status === 'negotiating' && (
                <View style={styles.replyForm}>
                  <Text style={styles.replyFormTitle}>{t('rfq.negotiate')}</Text>
                  <TextInput
                    style={styles.replyInput}
                    placeholder="سعر مقترح"
                    value={replyPrice}
                    onChangeText={setReplyPrice}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.replyInput, { height: 80, textAlignVertical: 'top' }]}
                    placeholder="رسالتك..."
                    value={replyMessage}
                    onChangeText={setReplyMessage}
                    multiline
                  />
                  <Button
                    title="إرسال الرد"
                    onPress={handleSendReply}
                    icon={<Send size={16} color={COLORS.white} />}
                  />
                </View>
              )}
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  rfqCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: 12, ...SHADOW.sm },
  rfqHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  rfqIconWrapper: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary + '15', alignItems: 'center', justifyContent: 'center' },
  rfqInfo: { flex: 1 },
  rfqId: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  rfqProduct: { fontSize: 12, color: COLORS.gray500, marginTop: 2 },
  rfqDetails: { flexDirection: 'row', backgroundColor: COLORS.gray50, borderRadius: RADIUS.md, padding: 10, marginBottom: 8 },
  rfqDetailItem: { flex: 1, alignItems: 'center' },
  rfqDetailLabel: { fontSize: 10, color: COLORS.gray500 },
  rfqDetailValue: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginTop: 2 },
  latestReply: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.primary + '10', padding: 8, borderRadius: RADIUS.md },
  latestReplyText: { fontSize: 12, color: COLORS.primary, flex: 1 },
  modalContainer: { flex: 1, backgroundColor: COLORS.white },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  rfqSummary: { backgroundColor: COLORS.gray50, borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.lg },
  rfqSummaryTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  rfqSummaryDetails: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  rfqSummaryItem: { fontSize: 13, color: COLORS.gray600 },
  rfqMessage: { backgroundColor: COLORS.white, borderRadius: RADIUS.md, padding: 10, marginTop: 8 },
  rfqMessageText: { fontSize: 13, color: COLORS.gray700 },
  repliesTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  replyBubble: { borderRadius: RADIUS.lg, padding: 12, marginBottom: 10, maxWidth: '85%' },
  replyBubbleBuyer: { backgroundColor: COLORS.primary, alignSelf: 'flex-end' },
  replyBubbleSupplier: { backgroundColor: COLORS.gray100, alignSelf: 'flex-start' },
  replySender: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  replyPrice: { fontSize: 16, fontWeight: '800', color: COLORS.gold, marginBottom: 4 },
  replyMessage: { fontSize: 13, color: COLORS.white },
  replyTime: { fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 4, textAlign: 'right' },
  replyForm: { backgroundColor: COLORS.gray50, borderRadius: RADIUS.lg, padding: SPACING.lg, marginTop: SPACING.lg },
  replyFormTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  replyInput: { backgroundColor: COLORS.white, borderRadius: RADIUS.md, padding: 12, fontSize: 14, borderWidth: 1, borderColor: COLORS.border, marginBottom: 10 },
});
