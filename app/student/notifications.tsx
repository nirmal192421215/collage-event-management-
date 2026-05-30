import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../../context/NotificationContext';
import { Notification } from '../../data/types';
import { Colors } from '../../constants/Colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/Theme';

const TYPE_CONFIG: Record<string, { icon: string; color: string; bgColor: string }> = {
  event_reminder: { icon: 'alarm', color: Colors.warning, bgColor: Colors.warningLight },
  registration: { icon: 'checkmark-circle', color: Colors.success, bgColor: Colors.successLight },
  announcement: { icon: 'megaphone', color: Colors.primary, bgColor: Colors.primaryUltraLight },
  attendance: { icon: 'scan-circle', color: Colors.accentTeal, bgColor: '#E0F7FA' },
  certificate: { icon: 'ribbon', color: Colors.accentPurple, bgColor: '#EDE7FF' },
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return 'Just now';
}

function groupNotifications(notifications: Notification[]) {
  const today: Notification[] = [];
  const earlier: Notification[] = [];
  const cutoff = Date.now() - 1000 * 60 * 60 * 24;
  notifications.forEach(n => {
    if (new Date(n.createdAt).getTime() > cutoff) today.push(n);
    else earlier.push(n);
  });
  return { today, earlier };
}

function NotifItem({ item, onRead, onDelete }: { item: Notification; onRead: () => void; onDelete: () => void }) {
  const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.announcement;
  return (
    <TouchableOpacity onPress={onRead} activeOpacity={0.9} style={[styles.notifCard, !item.read && styles.unread]}>
      <View style={[styles.iconWrap, { backgroundColor: cfg.bgColor }]}>
        <Ionicons name={cfg.icon as any} size={22} color={cfg.color} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.titleRow}>
          <Text style={[styles.notifTitle, !item.read && styles.unreadTitle]}>{item.title}</Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notifMsg} numberOfLines={2}>{item.message}</Text>
        <Text style={styles.notifTime}>{timeAgo(item.createdAt)}</Text>
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={16} color={Colors.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const { today, earlier } = groupNotifications(notifications);

  const sections = [
    ...(today.length > 0 ? [{ type: 'header' as const, label: 'Today' }, ...today.map(n => ({ type: 'item' as const, item: n }))] : []),
    ...(earlier.length > 0 ? [{ type: 'header' as const, label: 'Earlier' }, ...earlier.map(n => ({ type: 'item' as const, item: n }))] : []),
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.webContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={styles.unreadCount}>{unreadCount} unread</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllBtn} onPress={markAllAsRead}>
            <Ionicons name="checkmark-done" size={16} color={Colors.primary} />
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="notifications-off-outline" size={64} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No Notifications</Text>
          <Text style={styles.emptyBody}>You're all caught up! 🎉</Text>
        </View>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if (item.type === 'header') {
              return <Text style={styles.groupLabel}>{item.label}</Text>;
            }
            return (
              <NotifItem
                item={item.item}
                onRead={() => markAsRead(item.item.id)}
                onDelete={() => deleteNotification(item.item.id)}
              />
            );
          }}
        />
      )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  webContainer: { width: '100%', maxWidth: 1000, alignSelf: 'center', flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: 12,
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary },
  unreadCount: { fontSize: 13, color: Colors.primary, fontWeight: '600', marginTop: 2 },
  markAllBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primaryUltraLight,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.full,
  },
  markAllText: { fontSize: 13, color: Colors.primary, fontWeight: '700' },
  list: { paddingHorizontal: Spacing.md, paddingBottom: 100 },
  groupLabel: { fontSize: 13, fontWeight: '700', color: Colors.textMuted, marginVertical: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  notifCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: 14, marginBottom: 10, ...Shadow.sm, position: 'relative',
  },
  unread: { backgroundColor: Colors.primaryUltraLight, borderLeftWidth: 3, borderLeftColor: Colors.primary },
  unreadDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 4,
  },
  iconWrap: {
    width: 44, height: 44, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 3, paddingRight: 20 },
  notifTitle: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary, flex: 1 },
  unreadTitle: { color: Colors.textPrimary, fontWeight: '700' },
  notifMsg: { fontSize: 13, color: Colors.textMuted, lineHeight: 18, marginBottom: 6 },
  notifTime: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  deleteBtn: { padding: 4, marginTop: 2 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  emptyBody: { fontSize: 14, color: Colors.textMuted },
});
