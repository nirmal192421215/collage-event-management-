import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients } from '../../constants/Colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/Theme';
import { API_URL } from '../../constants/Api';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  year?: string;
  joinedAt: string;
  eventsRegistered: string[];
  eventsAttended: string[];
}

const ROLE_COLOR: Record<string, string> = {
  student: Colors.primary,
  admin: Colors.accentPurple,
  faculty: Colors.accentOrange,
};
const ROLE_BG: Record<string, string> = {
  student: Colors.primaryUltraLight,
  admin: '#F5EFFE',
  faculty: '#FEF5EC',
};

export default function UsersScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'student' | 'admin' | 'faculty'>('all');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/users`);
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (e) {
        console.error('Failed to load users', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = users.filter(u => {
    const matchRole = filter === 'all' || u.role === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.department ?? '').toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const students = users.filter(u => u.role === 'student').length;
  const admins = users.filter(u => u.role === 'admin').length;
  const faculty = users.filter(u => u.role === 'faculty').length;

  const initials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const joined = (d: string) => {
    try { return new Date(d).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }); }
    catch { return '—'; }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.webContainer}>
        {/* Header */}
        <LinearGradient colors={Gradients.aurora} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Users</Text>
          <Text style={styles.headerSub}>{users.length} registered members</Text>
        </LinearGradient>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>

          {/* Summary Cards */}
          <View style={styles.summaryRow}>
            {[
              { label: 'Students', count: students, color: Colors.primary, bg: Colors.primaryUltraLight, emoji: '🎓' },
              { label: 'Faculty', count: faculty, color: Colors.accentOrange, bg: '#FEF5EC', emoji: '👨‍🏫' },
              { label: 'Admins', count: admins, color: Colors.accentPurple, bg: '#F5EFFE', emoji: '🛡️' },
            ].map((s, i) => (
              <TouchableOpacity key={i} style={[styles.summaryCard, { borderTopColor: s.color }]}
                onPress={() => setFilter(s.label.toLowerCase() as any)}>
                <Text style={{ fontSize: 26 }}>{s.emoji}</Text>
                <Text style={[styles.summaryCount, { color: s.color }]}>{s.count}</Text>
                <Text style={styles.summaryLabel}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Search + Filter */}
          <View style={styles.searchRow}>
            <View style={styles.searchWrap}>
              <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, email, dept…"
                placeholderTextColor={Colors.textMuted}
                value={search}
                onChangeText={setSearch}
              />
              {search ? (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Filter Pills */}
          <View style={styles.filterRow}>
            {(['all', 'student', 'admin', 'faculty'] as const).map(r => (
              <TouchableOpacity
                key={r}
                style={[styles.filterPill, filter === r && styles.filterPillActive]}
                onPress={() => setFilter(r)}
              >
                <Text style={[styles.filterText, filter === r && styles.filterTextActive]}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* User List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👥 {filtered.length} {filter === 'all' ? 'Users' : filter.charAt(0).toUpperCase() + filter.slice(1) + 's'}</Text>

            {loading && (
              <View style={styles.loadingBox}>
                <Ionicons name="hourglass-outline" size={32} color={Colors.textMuted} />
                <Text style={styles.loadingText}>Loading users…</Text>
              </View>
            )}

            {!loading && filtered.length === 0 && (
              <View style={styles.emptyBox}>
                <Ionicons name="people-outline" size={48} color={Colors.textMuted} />
                <Text style={styles.emptyText}>No users found</Text>
              </View>
            )}

            {filtered.map(u => (
              <View key={u.id} style={styles.userCard}>
                <View style={[styles.avatar, { backgroundColor: (ROLE_BG[u.role] || Colors.primaryUltraLight) }]}>
                  <Text style={[styles.avatarText, { color: ROLE_COLOR[u.role] || Colors.primary }]}>{initials(u.name)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.userName}>{u.name}</Text>
                    <View style={[styles.rolePill, { backgroundColor: ROLE_BG[u.role] || Colors.primaryUltraLight }]}>
                      <Text style={[styles.roleText, { color: ROLE_COLOR[u.role] || Colors.primary }]}>{u.role}</Text>
                    </View>
                  </View>
                  <Text style={styles.userEmail}>{u.email}</Text>
                  {u.department ? <Text style={styles.userDept}>🏛 {u.department}{u.year ? ` • ${u.year}` : ''}</Text> : null}
                  <View style={styles.statsChips}>
                    <View style={styles.chip}>
                      <Ionicons name="calendar-outline" size={12} color={Colors.primary} />
                      <Text style={styles.chipText}>{u.eventsRegistered?.length ?? 0} registered</Text>
                    </View>
                    <View style={styles.chip}>
                      <Ionicons name="checkbox-outline" size={12} color={Colors.success} />
                      <Text style={styles.chipText}>{u.eventsAttended?.length ?? 0} attended</Text>
                    </View>
                    <View style={styles.chip}>
                      <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
                      <Text style={styles.chipText}>Joined {joined(u.joinedAt)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
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
  summaryRow: { flexDirection: 'row', gap: 12, paddingHorizontal: Spacing.md, marginTop: 20 },
  summaryCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: 14, alignItems: 'center', gap: 4, borderTopWidth: 3, ...Shadow.sm,
  },
  summaryCount: { fontSize: 24, fontWeight: '900' },
  summaryLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '700', textTransform: 'uppercase' },
  searchRow: { paddingHorizontal: Spacing.md, marginTop: 16 },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: Colors.borderLight, ...Shadow.sm,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary, outlineStyle: 'none' } as any,
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: Spacing.md, marginTop: 12 },
  filterPill: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: BorderRadius.full,
    borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white,
  },
  filterPillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
  filterTextActive: { color: '#fff' },
  section: { paddingHorizontal: Spacing.md, marginTop: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary, marginBottom: 12 },
  loadingBox: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  loadingText: { fontSize: 14, color: Colors.textMuted },
  emptyBox: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyText: { fontSize: 14, color: Colors.textMuted },
  userCard: {
    flexDirection: 'row', gap: 12, backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl, padding: 14, marginBottom: 12,
    ...Shadow.sm, borderWidth: 1, borderColor: Colors.borderLight,
  },
  avatar: {
    width: 48, height: 48, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  avatarText: { fontSize: 16, fontWeight: '900' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  userName: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary, flex: 1 },
  rolePill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.full },
  roleText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  userEmail: { fontSize: 12, color: Colors.textMuted, marginBottom: 2 },
  userDept: { fontSize: 12, color: Colors.textSecondary, marginBottom: 6, fontWeight: '600' },
  statsChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.background, borderRadius: BorderRadius.full,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  chipText: { fontSize: 10, fontWeight: '600', color: Colors.textMuted },
});
