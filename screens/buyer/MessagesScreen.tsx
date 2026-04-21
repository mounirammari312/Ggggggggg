import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Send, Search } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../lib/theme';
import { useAppStore } from '../../lib/store';
import { MOCK_MESSAGES, MOCK_SUPPLIERS } from '../../lib/mockData';
import { AppHeader } from '../../components/common/AppHeader';

const CONVERSATIONS = [
  { id: 'c1', supplierId: 's1', lastMessage: 'بالطبع، يمكننا التسليم خلال 5 أيام عمل', time: '11:00', unread: 1 },
  { id: 'c2', supplierId: 's3', lastMessage: 'لدينا عرض خاص على زيت الزيتون هذا الشهر', time: 'أمس', unread: 1 },
  { id: 'c3', supplierId: 's2', lastMessage: 'شكراً لتواصلكم', time: 'الثلاثاء', unread: 0 },
];

const CHAT_MESSAGES = [
  { id: 'm1', sender: 'supplier', content: 'مرحباً، شكراً لاهتمامكم بمنتجاتنا', time: '10:30' },
  { id: 'm2', sender: 'buyer', content: 'نعم، نريد معرفة إمكانية التسليم خلال أسبوع', time: '10:45' },
  { id: 'm3', sender: 'supplier', content: 'بالطبع، يمكننا التسليم خلال 5 أيام عمل', time: '11:00' },
];

export default function MessagesScreen() {
  const { t } = useTranslation();
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(CHAT_MESSAGES);
  const flatListRef = useRef<FlatList>(null);

  const getSupplier = (supplierId: string) =>
    MOCK_SUPPLIERS.find(s => s.id === supplierId) || MOCK_SUPPLIERS[0];

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, {
      id: `m${Date.now()}`,
      sender: 'buyer',
      content: newMessage,
      time: new Date().toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' }),
    }]);
    setNewMessage('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  if (activeConversation) {
    const supplier = getSupplier(CONVERSATIONS.find(c => c.id === activeConversation)?.supplierId || 's1');
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.chatHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setActiveConversation(null)}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: `https://picsum.photos/seed/${supplier.id}logo/80/80` }}
            style={styles.chatAvatar}
            contentFit="cover"
          />
          <View>
            <Text style={styles.chatName}>{supplier.company_name}</Text>
            <Text style={styles.chatStatus}>نشط الآن</Text>
          </View>
        </View>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          renderItem={({ item }) => (
            <View style={[
              styles.messageBubble,
              item.sender === 'buyer' ? styles.bubbleBuyer : styles.bubbleSupplier,
            ]}>
              <Text style={[styles.messageText, item.sender === 'buyer' && styles.messageTextBuyer]}>
                {item.content}
              </Text>
              <Text style={[styles.messageTime, item.sender === 'buyer' && styles.messageTimeBuyer]}>
                {item.time}
              </Text>
            </View>
          )}
        />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.inputBar}>
            <TextInput
              style={styles.messageInput}
              placeholder="اكتب رسالتك..."
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendBtn, !newMessage.trim() && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!newMessage.trim()}
            >
              <Send size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title={t('buyer.myMessages')} showBack />
      <FlatList
        data={CONVERSATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        renderItem={({ item }) => {
          const supplier = getSupplier(item.supplierId);
          return (
            <TouchableOpacity
              style={[styles.conversationCard, item.unread > 0 && styles.conversationCardUnread]}
              onPress={() => setActiveConversation(item.id)}
            >
              <View style={styles.convAvatarWrapper}>
                <Image
                  source={{ uri: `https://picsum.photos/seed/${supplier.id}logo/80/80` }}
                  style={styles.convAvatar}
                  contentFit="cover"
                />
                <View style={styles.onlineDot} />
              </View>
              <View style={styles.convInfo}>
                <Text style={styles.convName}>{supplier.company_name}</Text>
                <Text style={styles.convLastMessage} numberOfLines={1}>{item.lastMessage}</Text>
              </View>
              <View style={styles.convRight}>
                <Text style={styles.convTime}>{item.time}</Text>
                {item.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unread}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  conversationCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: 10, ...SHADOW.sm, gap: 12 },
  conversationCardUnread: { backgroundColor: COLORS.primary + '08' },
  convAvatarWrapper: { position: 'relative' },
  convAvatar: { width: 52, height: 52, borderRadius: 26 },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.white },
  convInfo: { flex: 1 },
  convName: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  convLastMessage: { fontSize: 12, color: COLORS.gray500 },
  convRight: { alignItems: 'flex-end', gap: 4 },
  convTime: { fontSize: 11, color: COLORS.gray400 },
  unreadBadge: { backgroundColor: COLORS.primary, borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  unreadText: { color: COLORS.white, fontSize: 11, fontWeight: '700' },
  chatHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: SPACING.lg, backgroundColor: COLORS.primary, paddingTop: SPACING.md },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  backText: { color: COLORS.white, fontSize: 18 },
  chatAvatar: { width: 40, height: 40, borderRadius: 20 },
  chatName: { fontSize: 15, fontWeight: '700', color: COLORS.white },
  chatStatus: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  messagesList: { padding: SPACING.lg, gap: 8 },
  messageBubble: { maxWidth: '80%', borderRadius: RADIUS.lg, padding: 12 },
  bubbleBuyer: { backgroundColor: COLORS.primary, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  bubbleSupplier: { backgroundColor: COLORS.white, alignSelf: 'flex-start', borderBottomLeftRadius: 4, ...SHADOW.sm },
  messageText: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  messageTextBuyer: { color: COLORS.white },
  messageTime: { fontSize: 10, color: COLORS.gray400, marginTop: 4, textAlign: 'right' },
  messageTimeBuyer: { color: 'rgba(255,255,255,0.6)' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: SPACING.md, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border },
  messageInput: { flex: 1, backgroundColor: COLORS.gray100, borderRadius: RADIUS.xl, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, maxHeight: 100 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: COLORS.gray300 },
});
