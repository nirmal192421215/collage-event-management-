import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useEvents } from '../../context/EventContext';
import { Colors, Gradients } from '../../constants/Colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/Theme';

const CATEGORY_CONFIG = [
  { key: 'Technology', emoji: '💻', color: '#4A90E2', bg: '#EEF4FE' },
  { key: 'Cultural', emoji: '🎭', color: '#E85D75', bg: '#FEF0F3' },
  { key: 'Sports', emoji: '🏆', color: '#27AE60', bg: '#EDFBF4' },
  { key: 'Academic', emoji: '📚', color: '#8E44AD', bg: '#F5EFFE' },
  { key: 'Workshop', emoji: '🔧', color: '#E67E22', bg: '#FEF5EC' },
  { key: 'Hackathon', emoji: '⚡', color: '#16A085', bg: '#E8F8F5' },
];

function StatCard({ icon, label, value, color, sub }: { icon: string; label: string; value: string | number; color: string; sub?: string }) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={22} color={color} />
      </View>
      <Text style={[styles.statVal, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
    </View>
  );
}

export default function AnalyticsScreen() {
  const router = useRouter();
  const { events } = useEvents();

  const totalEvents = events.length;
  const upcomingCount = events.filter(e => e.status === 'upcoming').length;
  const completedCount = events.filter(e => e.status === 'completed').length;
  const ongoingCount = events.filter(e => e.status === 'ongoing').length;
  const totalRegs = events.reduce((s, e) => s + e.registeredCount, 0);
  const totalAttended = events.reduce((s, e) => s + (e.attendees?.length ?? 0), 0);
  const attendanceRate = totalRegs > 0 ? Math.round((totalAttended / totalRegs) * 100) : 0;
  const totalCapacity = events.reduce((s, e) => s + e.capacity, 0);
  const fillRate = totalCapacity > 0 ? Math.round((totalRegs / totalCapacity) * 100) : 0;
  const freeEvents = events.filter(e => e.price === 0).length;
  const paidEvents = events.filter(e => e.price > 0).length;

  // top events by registrations
  const topEvents = [...events].sort((a, b) => b.registeredCount - a.registeredCount).slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.webContainer}>
        {/* Header */}
        <LinearGradient colors={Gradients.aurora} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSub}>Event performance overview</Text>
        </LinearGradient>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>

          {/* Key Metrics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📈 Key Metrics</Text>
            <View style={styles.grid2}>
              <StatCard icon="calendar" label="Total Events" value={totalEvents} color={Colors.primary} sub={`${upcomingCount} upcoming`} />
              <StatCard icon="people" label="Registrations" value={totalRegs} color={Colors.accentPurple} sub={`${fillRate}% fill rate`} />
              <StatCard icon="checkbox" label="Attendance" value={totalAttended} color={Colors.success} sub={`${attendanceRate}% rate`} />
              <StatCard icon="checkmark-done" label="Completed" value={completedCount} color={Colors.accentOrange} sub={`${ongoingCount} ongoing`} />
            </View>
          </View>

          {/* Event Status Breakdown */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Event Status</Text>
            <View style={styles.statusRow}>
              {[
                { label: 'Upcoming', count: upcomingCount, color: Colors.primary, icon: 'time-outline' },
                { label: 'Ongoing', count: ongoingCount, color: Colors.success, icon: 'radio-outline' },
                { label: 'Completed', count: completedCount, color: Colors.accentOrange, icon: 'checkmark-circle-outline' },
                { label: 'Cancelled', count: events.filter(e => e.status === 'cancelled').length, color: Colors.error, icon: 'close-circle-outline' },
              ].map((s, i) => (
                <View key={i} style={[styles.statusCard, { borderTopColor: s.color }]}>
                  <Ionicons name={s.icon as any} size={24} color={s.color} />
                  <Text style={[styles.statusCount, { color: s.color }]}>{s.count}</Text>
                  <Text style={styles.statusLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Free vs Paid */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💰 Free vs Paid</Text>
            <View style={styles.freeRow}>
              <View style={[styles.freeCard, { backgroundColor: '#EDFBF4', borderColor: Colors.success }]}>
                <Text style={{ fontSize: 32 }}>🆓</Text>
                <Text style={[styles.freeBig, { color: Colors.success }]}>{freeEvents}</Text>
                <Text style={styles.freeLabel}>Free Events</Text>
              </View>
              <View style={[styles.freeCard, { backgroundColor: '#FEF5EC', borderColor: Colors.accentOrange }]}>
                <Text style={{ fontSize: 32 }}>💳</Text>
                <Text style={[styles.freeBig, { color: Colors.accentOrange }]}>{paidEvents}</Text>
                <Text style={styles.freeLabel}>Paid Events</Text>
              </View>
            </View>
          </View>

          {/* Category breakdown */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎨 By Category</Text>
            <View style={styles.catGrid}>
              {CATEGORY_CONFIG.map((cat, i) => {
                const count = events.filter(e => e.category === cat.key).length;
                const pct = totalEvents > 0 ? Math.round((count / totalEvents) * 100) : 0;
                return (
                  <View key={i} style={[styles.catCard, { borderTopColor: cat.color, backgroundColor: cat.bg }]}>
                    <Text style={{ fontSize: 24 }}>{cat.emoji}</Text>
                    <Text style={[styles.catCount, { color: cat.color }]}>{count}</Text>
                    <Text style={styles.catName}>{cat.key}</Text>
                    <View style={styles.catBarBg}>
                      <View style={[styles.catBarFill, { width: `${Math.max(pct, count > 0 ? 8 : 0)}%` as any, backgroundColor: cat.color }]} />
                    </View>
                    <Text style={[styles.catPct, { color: cat.color }]}>{pct}%</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Top Events */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏆 Top Events by Registrations</Text>
            {topEvents.map((event, i) => {
              const fillPct = event.capacity > 0 ? Math.min(100, Math.round((event.registeredCount / event.capacity) * 100)) : 0;
              return (
                <View key={event.id} style={styles.topRow}>
                  <View style={[styles.rank, { backgroundColor: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : Colors.primaryUltraLight }]}>
                    <Text style={[styles.rankText, { color: i < 3 ? '#fff' : Colors.primary }]}>#{i + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.topTitle} numberOfLines={1}>{event.title}</Text>
                    <View style={styles.topBarBg}>
                      <View style={[styles.topBarFill, { width: `${fillPct}%` as any }]} />
                    </View>
                    <Text style={styles.topMeta}>{event.registeredCount} / {event.capacity} seats filled ({fillPct}%)</Text>
                  </View>
                </View>
              );
            })}
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  webContainer: { width: '100%', maxWidth: 1000, alignSelf: 'center', flex: 1 },
  header: {
    padding: Spacing.md, paddingTop: 50, paddingBottom: 24,
    alignItems: 'center',
    borderBottomLeftRadius: BorderRadius.xxl, borderBottomRightRadius: BorderRadius.xxl,
  },
  backBtn: {
    position: 'absolute', top: 50, left: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 20, padding: 8,
    borderWidth: 1, borderColor: Colors.borderLight, ...Shadow.sm,
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 4, fontWeight: '500' },
  section: { paddingHorizontal: Spacing.md, marginTop: 28 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 14 },
  grid2: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    width: '47%', backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: 16, borderLeftWidth: 4, ...Shadow.sm, gap: 4,
  },
  statIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  statVal: { fontSize: 28, fontWeight: '900' },
  statLabel: { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },
  statSub: { fontSize: 11, color: Colors.success, fontWeight: '700' },
  statusRow: { flexDirection: 'row', gap: 10 },
  statusCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: 12, alignItems: 'center', gap: 6,
    borderTopWidth: 3, ...Shadow.sm,
  },
  statusCount: { fontSize: 24, fontWeight: '900' },
  statusLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '700', textTransform: 'uppercase' },
  freeRow: { flexDirection: 'row', gap: 14 },
  freeCard: {
    flex: 1, borderRadius: BorderRadius.xl, padding: 20,
    alignItems: 'center', gap: 8, borderWidth: 1.5, ...Shadow.sm,
  },
  freeBig: { fontSize: 36, fontWeight: '900' },
  freeLabel: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catCard: {
    width: '30%', flex: 1, borderRadius: 14, padding: 12,
    alignItems: 'center', borderTopWidth: 3, gap: 2, ...Shadow.sm,
  },
  catCount: { fontSize: 24, fontWeight: '900' },
  catName: { fontSize: 9, fontWeight: '700', color: '#666', textTransform: 'uppercase', letterSpacing: 0.4, textAlign: 'center' },
  catBarBg: { width: '100%', height: 4, backgroundColor: '#E0E0E0', borderRadius: 4, overflow: 'hidden', marginTop: 4 },
  catBarFill: { height: '100%', borderRadius: 4 },
  catPct: { fontSize: 9, fontWeight: '800' },
  topRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: 14, marginBottom: 10, ...Shadow.sm,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  rank: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  rankText: { fontSize: 12, fontWeight: '900' },
  topTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  topBarBg: { height: 6, backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden', marginBottom: 4 },
  topBarFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 4 },
  topMeta: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
});
