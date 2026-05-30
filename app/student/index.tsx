import React, { useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, FlatList,
  TouchableOpacity, Animated, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';
import { Colors, Gradients } from '../../constants/Colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/Theme';
import EventCard from '../../components/events/EventCard';
import CategoryChip from '../../components/events/CategoryChip';

const { width } = Dimensions.get('window');



const QUICK_LINKS = [
  { label: 'Browse Events', icon: 'search', color: Colors.primary, route: '/student/events' },
  { label: 'My Dashboard', icon: 'grid', color: Colors.accentPurple, route: '/student/dashboard' },
  { label: 'Notifications', icon: 'notifications', color: Colors.accentOrange, route: '/student/notifications' },
  { label: 'My Profile', icon: 'person', color: Colors.accentGreen, route: '/student/profile' },
];

const CATEGORIES = [
  { label: 'All', emoji: '🌟' },
  { label: 'Technology', emoji: '💻' },
  { label: 'Cultural', emoji: '🎭' },
  { label: 'Sports', emoji: '🏆' },
  { label: 'Academic', emoji: '📚' },
  { label: 'Workshop', emoji: '🔧' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { getFeaturedEvents, getUpcomingEvents } = useEvents();
  const featured = getFeaturedEvents();
  const upcoming = getUpcomingEvents().slice(0, 6);

  const firstName = user?.name?.split(' ')[0] || 'Student';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.webContainer}>
      {/* Hero Section */}
      <LinearGradient colors={Gradients.hero} style={styles.hero}>
        <View style={styles.heroContent}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.greeting}>Good {getGreeting()}, {firstName}! 👋</Text>
              <Text style={styles.heroTitle}>Discover Amazing{'\n'}College Events</Text>
              <Text style={styles.heroSub}>Register, participate, and earn certificates</Text>
            </View>
            <TouchableOpacity style={styles.avatarBtn} onPress={() => router.push('/student/profile')}>
              <Ionicons name="person" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => router.push('/student/events')}
            activeOpacity={0.9}
          >
            <Ionicons name="search" size={18} color={Colors.textMuted} />
            <Text style={styles.searchPlaceholder}>Search events, workshops...</Text>
            <View style={styles.filterBtn}>
              <Ionicons name="options" size={16} color={Colors.primary} />
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>



      {/* Quick Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.quickGrid}>
          {QUICK_LINKS.map((q, i) => (
            <TouchableOpacity
              key={i}
              style={styles.quickCard}
              onPress={() => router.push(q.route as any)}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[q.color + '20', q.color + '10']}
                style={styles.quickGradient}
              >
                <View style={[styles.quickIcon, { backgroundColor: q.color }]}>
                  <Ionicons name={q.icon as any} size={22} color="#fff" />
                </View>
                <Text style={styles.quickLabel}>{q.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Featured Events Carousel */}
      {featured.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⭐ Featured Events</Text>
            <TouchableOpacity onPress={() => router.push('/student/events')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featured}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={e => e.id}
            contentContainerStyle={styles.carouselList}
            renderItem={({ item }) => <EventCard event={item} compact />}
          />
        </View>
      )}

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Browse by Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {CATEGORIES.map((c, i) => (
            <CategoryChip
              key={i}
              label={c.label}
              emoji={c.emoji}
              active={false}
              onPress={() => router.push('/student/events')}
            />
          ))}
        </ScrollView>
      </View>

      {/* Upcoming Events */}
      <View style={[styles.section, { paddingHorizontal: Spacing.md }]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🗓️ Upcoming Events</Text>
          <TouchableOpacity onPress={() => router.push('/student/events')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {upcoming.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </View>

      {/* CTA Banner */}
      <View style={[styles.section, { paddingHorizontal: Spacing.md }]}>
        <LinearGradient colors={['#7C4DFF', '#4DA6FF']} style={styles.ctaBanner}>
          <Ionicons name="trophy" size={40} color="rgba(255,255,255,0.3)" style={styles.ctaBg} />
          <Text style={styles.ctaTitle}>Ready to Participate?</Text>
          <Text style={styles.ctaBody}>Register for events, earn certificates, and build your portfolio.</Text>
          <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/student/events')} activeOpacity={0.85}>
            <Text style={styles.ctaBtnText}>Explore Events</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <View style={{ height: 20 }} />
      </View>
    </ScrollView>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  webContainer: { width: '100%', maxWidth: 1200, alignSelf: 'center', paddingBottom: 40 },
  hero: { paddingTop: 56, paddingBottom: 32, borderBottomLeftRadius: BorderRadius.xl, borderBottomRightRadius: BorderRadius.xl },
  heroContent: { paddingHorizontal: Spacing.md },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '500', marginBottom: 4 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#fff', lineHeight: 36, marginBottom: 6 },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.75)' },
  avatarBtn: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    paddingHorizontal: 16, height: 50, ...Shadow.md,
  },
  searchPlaceholder: { flex: 1, fontSize: 14, color: Colors.textMuted },
  filterBtn: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: Colors.primaryUltraLight,
    justifyContent: 'center', alignItems: 'center',
  },
  statsContainer: { marginTop: -20, paddingBottom: 4 },
  statsScroll: { paddingHorizontal: Spacing.md, gap: 10 },
  statCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: 14, minWidth: 100, alignItems: 'center',
    borderTopWidth: 3, ...Shadow.sm,
  },
  statIconCircle: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  statValue: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  statLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', textAlign: 'center', marginTop: 2 },
  section: { paddingHorizontal: 0, marginTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, paddingHorizontal: Spacing.md, marginBottom: 12 },
  seeAll: { fontSize: 13, color: Colors.primary, fontWeight: '700' },
  quickGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 12, paddingHorizontal: Spacing.md, justifyContent: 'center'
  },
  quickCard: {
    flex: 1, minWidth: 140, maxWidth: 220,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  quickGradient: { padding: 18, alignItems: 'center', gap: 10 },
  quickIcon: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  quickLabel: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  carouselList: { paddingHorizontal: Spacing.md, paddingBottom: 8 },
  catScroll: { paddingHorizontal: Spacing.md },
  ctaBanner: {
    borderRadius: BorderRadius.xl, padding: 24, overflow: 'hidden',
  },
  ctaBg: { position: 'absolute', right: 16, bottom: -10 },
  ctaTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 6 },
  ctaBody: { fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 20, marginBottom: 20 },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.white, alignSelf: 'flex-start',
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: BorderRadius.full,
  },
  ctaBtnText: { color: Colors.primary, fontWeight: '800', fontSize: 14 },
});
