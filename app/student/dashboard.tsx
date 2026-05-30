import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';
import { Colors, Gradients } from '../../constants/Colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/Theme';
import Badge from '../../components/ui/Badge';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function StatBox({ icon, value, label, color }: { icon: string; value: string | number; label: string; color: string }) {
  return (
    <View style={[dStyles.statBox, { borderColor: color + '40' }]}>
      <View style={[dStyles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={22} color={color} />
      </View>
      <Text style={dStyles.statVal}>{value}</Text>
      <Text style={dStyles.statLabel}>{label}</Text>
    </View>
  );
}

const dStyles = StyleSheet.create({
  statBox: {
    flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: 14, alignItems: 'center', borderWidth: 1.5, ...Shadow.sm,
  },
  statIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statVal: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  statLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', textAlign: 'center', marginTop: 2 },
});

export default function StudentDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { events, getUpcomingEvents, isUserRegistered } = useEvents();

  if (!user) return null;

  const myEvents = events.filter(e => isUserRegistered(e.id, user.id));
  const attended = events.filter(e => user.eventsAttended.includes(e.id));
  const upcoming = myEvents.filter(e => e.status === 'upcoming');
  const certs = user.certificates;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.webContainer}>
        {/* Header */}
        <LinearGradient colors={Gradients.aurora} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerSub}>Student Dashboard</Text>
              <Text style={styles.headerName}>{user.name}</Text>
              <Text style={styles.headerDept}>{user.department} {user.year ? `• ${user.year}` : ''}</Text>
            </View>
            <View style={styles.avatarWrap}>
              <LinearGradient colors={Gradients.aurora} style={StyleSheet.absoluteFillObject} />
              <Ionicons name="person" size={24} color={Colors.white} />
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <StatBox icon="calendar-outline" value={myEvents.length} label="Registered" color={Colors.white} />
            <StatBox icon="checkbox-outline" value={user.eventsAttended.length} label="Attended" color={Colors.white} />
            <StatBox icon="ribbon-outline" value={certs.length} label="Certificates" color={Colors.white} />
            <StatBox icon="star-outline" value={user.badges.length} label="Badges" color={Colors.white} />
          </View>


        </LinearGradient>

        {/* Registered Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🗓️ My Registered Events</Text>
            <TouchableOpacity onPress={() => router.push('/student/events')}>
              <Text style={styles.seeAll}>Browse More</Text>
            </TouchableOpacity>
          </View>
          {myEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={40} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No events registered yet</Text>
              <TouchableOpacity onPress={() => router.push('/student/events')}>
                <Text style={styles.emptyLink}>Browse Events →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            myEvents.map(event => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventRow}
                onPress={() => router.push(`/event/${event.id}` as any)}
                activeOpacity={0.85}
              >
                <View style={[styles.eventColorBar, { backgroundColor: event.status === 'completed' ? Colors.success : Colors.primary }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.eventRowTitle} numberOfLines={1}>{event.title}</Text>
                  <View style={styles.eventRowMeta}>
                    <Ionicons name="calendar-outline" size={12} color={Colors.textMuted} />
                    <Text style={styles.eventRowDate}>{formatDate(event.date)}</Text>
                    <Text style={styles.dotSep}>•</Text>
                    <Text style={styles.eventRowVenue} numberOfLines={1}>{event.venue}</Text>
                  </View>
                </View>
                <Badge
                  label={event.status}
                  variant={event.status === 'upcoming' ? 'success' : event.status === 'completed' ? 'neutral' : 'info'}
                  size="sm"
                />
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Upcoming Reminders */}
        {upcoming.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⏰ Upcoming Reminders</Text>
            {upcoming.slice(0, 3).map(event => {
              const diff = new Date(event.date).getTime() - Date.now();
              const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
              return (
                <View key={event.id} style={styles.reminderCard}>
                  <LinearGradient colors={[Colors.primary + '15', Colors.primary + '05']} style={styles.reminderGrad}>
                    <View style={styles.reminderDays}>
                      <Text style={styles.reminderDaysNum}>{days}</Text>
                      <Text style={styles.reminderDaysLabel}>days</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reminderTitle} numberOfLines={1}>{event.title}</Text>
                      <Text style={styles.reminderDate}>{formatDate(event.date)} • {event.venue}</Text>
                    </View>
                    <Ionicons name="notifications-outline" size={20} color={Colors.primary} />
                  </LinearGradient>
                </View>
              );
            })}
          </View>
        )}

        {/* Certificates */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📜 My Certificates</Text>
          </View>
          {certs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="ribbon-outline" size={40} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No certificates yet. Attend events to earn them!</Text>
            </View>
          ) : (
            certs.map(cert => (
              <View key={cert.id} style={styles.certCard}>
                <LinearGradient colors={Gradients.aurora} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.certIcon}>
                  <Ionicons name="ribbon" size={24} color="#fff" />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={styles.certTitle} numberOfLines={1}>{cert.eventTitle}</Text>
                  <Text style={styles.certMeta}>
                    {cert.type.charAt(0).toUpperCase() + cert.type.slice(1)} • {formatDate(cert.issuedAt)}
                  </Text>
                </View>
                <TouchableOpacity style={styles.downloadBtn}>
                  <Ionicons name="download-outline" size={18} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏅 Achievement Badges</Text>
          {user.badges.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="star-outline" size={40} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No badges yet. Participate in events to earn badges!</Text>
            </View>
          ) : (
            <View style={styles.badgeGrid}>
              {user.badges.map(badge => (
                <View key={badge.id} style={styles.badgeCard}>
                  <View style={[styles.badgeIconWrap, { backgroundColor: badge.color + '20' }]}>
                    <Ionicons name={badge.icon as any} size={28} color={badge.color} />
                  </View>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                  <Text style={styles.badgeDesc} numberOfLines={2}>{badge.description}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  webContainer: { width: '100%', maxWidth: 1200, alignSelf: 'center' },
  header: { padding: Spacing.md, paddingTop: 50, paddingBottom: 24, borderBottomLeftRadius: BorderRadius.xxl, borderBottomRightRadius: BorderRadius.xxl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  headerName: { fontSize: 26, fontWeight: '800', color: '#fff', marginTop: 2, letterSpacing: -0.5 },
  headerDept: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4, fontWeight: '500' },
  avatarWrap: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: Colors.white,
    justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden', borderWidth: 2, borderColor: Colors.white, ...Shadow.md,
  },
  statsRow: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  section: { paddingHorizontal: Spacing.md, marginTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary, marginBottom: 12 },
  seeAll: { fontSize: 13, color: Colors.primary, fontWeight: '700' },
  emptyState: { alignItems: 'center', gap: 10, paddingVertical: 24 },
  emptyText: { fontSize: 14, color: Colors.textMuted, textAlign: 'center' },
  emptyLink: { fontSize: 14, color: Colors.primary, fontWeight: '700' },
  eventRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: 14, marginBottom: 12, ...Shadow.sm, borderWidth: 1, borderColor: Colors.borderLight,
  },
  eventColorBar: { width: 4, height: '80%', borderRadius: 2 },
  eventRowTitle: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  eventRowMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  eventRowDate: { fontSize: 12, color: Colors.textMuted },
  dotSep: { color: Colors.textMuted, fontSize: 12 },
  eventRowVenue: { fontSize: 12, color: Colors.textMuted, flex: 1 },
  reminderCard: { marginBottom: 12, borderRadius: BorderRadius.xl, overflow: 'hidden', ...Shadow.sm, borderWidth: 1, borderColor: Colors.borderLight },
  reminderGrad: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, backgroundColor: Colors.white },
  reminderDays: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: Colors.primaryUltraLight,
    justifyContent: 'center', alignItems: 'center',
  },
  reminderDaysNum: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  reminderDaysLabel: { fontSize: 10, color: Colors.primary, fontWeight: '700' },
  reminderTitle: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  reminderDate: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  certCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: 14, marginBottom: 12, ...Shadow.sm, borderWidth: 1, borderColor: Colors.borderLight,
  },
  certIcon: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  certTitle: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary, marginBottom: 3 },
  certMeta: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
  downloadBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.primaryUltraLight,
    justifyContent: 'center', alignItems: 'center',
  },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badgeCard: {
    width: '30%', backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl, padding: 16,
    alignItems: 'center', ...Shadow.sm, borderWidth: 1, borderColor: Colors.borderLight,
  },
  badgeIconWrap: {
    width: 56, height: 56, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  badgeName: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center', marginBottom: 4 },
  badgeDesc: { fontSize: 10, color: Colors.textMuted, textAlign: 'center', lineHeight: 14 },
});
