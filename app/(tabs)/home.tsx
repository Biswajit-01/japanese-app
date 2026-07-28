import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import RandomKanjiCard from '../../components/RandomKanjiCard';

export default function HomeScreen() {
  const router = useRouter();
  const [dailyFact, setDailyFact] = useState({ english: '', japanese: '' });
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [streak, setStreak] = useState<number>(1);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const jlptRoadmaps = [
    { level: 'N5', title: 'Beginner', desc: 'Basic vocab & kanji', color: '#9DEEE9' },
    { level: 'N4', title: 'Basic', desc: 'Daily conversations', color: '#DA9EFF' },
    { level: 'N3', title: 'Intermediate', desc: 'Bridge to fluency', color: '#FA73FF' },
    { level: 'N2', title: 'Pre-Advanced', desc: 'Business & media', color: '#A7B3B7' },
    { level: 'N1', title: 'Advanced', desc: 'Native mastery', color: '#ffffff' },
  ];

  const secondaryModules = [
    { title: 'Vocab', subtitle: 'Dictionary', icon: 'library', route: '/(tabs)/vocab', color: '#9DEEE9' }, 
    { title: 'Strokes', subtitle: 'Writing Guide', icon: 'brush', route: '/(tabs)/writing', color: '#DA9EFF' }, 
    { title: 'Draw', subtitle: 'Trace Pad', icon: 'pencil', route: '/(tabs)/draw', color: '#A7B3B7' }, 
    { title: 'Quiz', subtitle: 'Test Memory', icon: 'game-controller', route: '/(tabs)/quiz', color: '#9DEEE9' }, 
  ];

  const checkAndUpdateStreak = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const lastActive = await AsyncStorage.getItem('last_active_date');
      const currentStreak = await AsyncStorage.getItem('streak_count');

      if (!lastActive) {
        await AsyncStorage.setItem('last_active_date', today);
        await AsyncStorage.setItem('streak_count', '1');
        setStreak(1);
        return;
      }

      const lastDate = new Date(lastActive);
      const currentDate = new Date(today);
      const diffTime = currentDate.getTime() - lastDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

      if (diffDays === 0) {
        setStreak(currentStreak ? parseInt(currentStreak) : 1);
      } else if (diffDays === 1) {
        const newStreak = (currentStreak ? parseInt(currentStreak) : 1) + 1;
        await AsyncStorage.setItem('streak_count', newStreak.toString());
        await AsyncStorage.setItem('last_active_date', today);
        setStreak(newStreak);
      } else {
        await AsyncStorage.setItem('streak_count', '1');
        await AsyncStorage.setItem('last_active_date', today);
        setStreak(1);
      }
    } catch (error) {
      console.error('Failed to update streak', error);
    }
  };

  useEffect(() => {
    NetInfo.fetch().then(state => {
      setIsOnline(state.isConnected ?? false);
    });

    const unsubscribeNetwork = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    checkAndUpdateStreak();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gridOverlay}>
        {[...Array(10)].map((_, i) => <View key={`v-${i}`} style={[styles.gridLineVertical, { left: i * 60 }]} />)}
        {[...Array(25)].map((_, i) => <View key={`h-${i}`} style={[styles.gridLineHorizontal, { top: i * 60 }]} />)}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.networkBadge}>
            <View style={[styles.statusDot, { backgroundColor: isOnline ? '#6BCB77' : '#FF766D' }]} />
            <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
          </View>
          
          <View style={styles.headerTopRight}>
            <Text style={styles.headerTitle}>NihonPath 🇯🇵</Text>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {streak} Days</Text>
            </View>
          </View>
        </View>

        {/* 1. Master the Alphabet Card */}
        <Pressable onPress={() => router.push('/(tabs)')} style={styles.cardWrapper}>
          {({ pressed }) => (
            <>
              <View style={styles.cardShadow} />
              <View style={[styles.mainCard, { backgroundColor: '#FA73FF' }, pressed && styles.pressedCard]}>
                <View style={styles.badge}><Text style={styles.badgeText}>STEP 1: THE LETTERS</Text></View>
                <Text style={styles.heroTitle}>Master the Alphabet</Text>
                <Text style={styles.heroDesc}>You cannot read words without knowing the letters! Start here.</Text>
              </View>
            </>
          )}
        </Pressable>

        {/* 2. Random Kanji Teaser Component */}
        <RandomKanjiCard />

        <Text style={styles.sectionLabel}>YOUR LEARNING PATH</Text>

        <Pressable style={styles.cardWrapper} onPress={() => router.push('/roadmap')}>
          {({ pressed }) => (
            <>
              <View style={[styles.cardShadow, { top: 6, left: 6 }]} />
              <View style={[styles.mainCard, { backgroundColor: '#ffffff', padding: 20 }, pressed && styles.pressedGridCard]}>
                <View style={styles.roadmapHeader}>
                  <Ionicons name="map" size={28} color="#520D58" />
                  <Text style={styles.generalRoadmapTitle}>The Complete Journey</Text>
                </View>
                <Text style={styles.heroDesc}>From absolute beginner to fluent speaker. View your step-by-step master roadmap.</Text>
              </View>
            </>
          )}
        </Pressable>

        {/* JLPT Roadmaps */}
        <Text style={[styles.sectionLabel, { marginTop: 15 }]}>JLPT REFERENCE LEVELS</Text>
        <View style={styles.jlptGridContainer}>
          {jlptRoadmaps.map((item, index) => (
            <Pressable 
              key={index} 
              style={[styles.jlptCardWrapper, index >= 3 && styles.jlptCardWrapperWide]} 
              onPress={() => router.push({ pathname: '/(tabs)/vocab', params: { filterLevel: item.level } })}
            >
              {({ pressed }) => (
                <>
                  <View style={[styles.cardShadow, { top: 6, left: 6, bottom: -6, right: -6 }]} />
                  <View style={[styles.jlptCard, { backgroundColor: item.color }, pressed && styles.pressedGridCard]}>
                    <Text style={styles.jlptLevel}>{item.level}</Text>
                    <Text style={styles.jlptTitle}>{item.title}</Text>
                    <Text style={styles.jlptDesc}>{item.desc}</Text>
                  </View>
                </>
              )}
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 15 }]}>PRACTICE & REVIEW</Text>

        <View style={styles.gridContainer}>
          {secondaryModules.map((item, index) => (
            <Pressable key={index} style={styles.gridItemWrapper} onPress={() => router.push(item.route as any)}>
              {({ pressed }) => (
                <>
                  <View style={[styles.cardShadow, { top: 6, left: 6, bottom: -6, right: -6 }]} />
                  <View style={[styles.gridCard, { backgroundColor: item.color }, pressed && styles.pressedGridCard]}>
                    <View style={styles.gridIconContainer}><Ionicons name={item.icon as any} size={28} color="#000" /></View>
                    <Text style={styles.gridCardTitle}>{item.title}</Text>
                    <Text style={styles.gridCardSubtitle}>{item.subtitle}</Text>
                  </View>
                </>
              )}
            </Pressable>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#520D58',
    ...(Platform.OS === 'web' && {
      maxWidth: 680,
      alignSelf: 'center',
      width: '100%',
      marginVertical: 20,
      borderRadius: 24,
      borderWidth: 4,
      borderColor: '#000000',
      overflow: 'hidden',
      boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
    }),
  },
  gridOverlay: { ...StyleSheet.absoluteFillObject, zIndex: -1, opacity: 0.08 },
  gridLineVertical: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: '#ffffff' },
  gridLineHorizontal: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#ffffff' },
  scrollContainer: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 60 },
  headerRow: { marginBottom: 25, marginTop: 10 },
  networkBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#000', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 10 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  headerTopRight: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  headerTitle: { fontSize: 32, fontWeight: '900', color: '#ffffff' },
  streakBadge: { backgroundColor: '#FA73FF', paddingVertical: 5, paddingHorizontal: 12, borderRadius: 10, borderWidth: 2.5, borderColor: '#000000', shadowColor: '#000', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3 },
  streakText: { fontSize: 12, fontWeight: '900', color: '#000000' },
  cardWrapper: { position: 'relative', marginBottom: 25 },
  cardShadow: { position: 'absolute', top: 8, left: 8, right: -8, bottom: -8, backgroundColor: '#000000', borderRadius: 20 },
  mainCard: { borderRadius: 20, borderWidth: 4, borderColor: '#000000', padding: 24 },
  pressedCard: { transform: [{ translateX: 8 }, { translateY: 8 }] },
  pressedGridCard: { transform: [{ translateX: 6 }, { translateY: 6 }] },
  badge: { backgroundColor: '#000', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 16 },
  badgeText: { color: '#FA73FF', fontWeight: 'bold', fontSize: 11, letterSpacing: 1 },
  heroTitle: { fontSize: 28, fontWeight: '900', color: '#000000', marginBottom: 10 },
  heroDesc: { fontSize: 15, color: '#1a0b0b', lineHeight: 22, fontWeight: '600', marginBottom: 15 },
  sectionLabel: { color: '#A7B3B7', fontWeight: 'bold', letterSpacing: 1.5, fontSize: 13, marginBottom: 16, marginTop: 10 },
  roadmapHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  generalRoadmapTitle: { fontSize: 22, fontWeight: '900', color: '#520D58' },
  jlptGridContainer: {
    ...(Platform.OS === 'web' ? {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      justifyContent: 'space-between',
      paddingBottom: 10,
    } : {
      flexDirection: 'row',
    }),
  },
  jlptCardWrapper: { 
    ...(Platform.OS === 'web' ? {
      width: '31%',
      marginBottom: 16,
    } : {
      width: 150,
      marginRight: 16,
    }),
    position: 'relative',
  },
  jlptCardWrapperWide: {
    ...(Platform.OS === 'web' ? {
      width: '48%', // Makes N2 and N1 stretch to fill the second row perfectly without a gap
    } : {}),
  },
  jlptCard: { borderRadius: 16, borderWidth: 4, borderColor: '#000000', padding: 16, height: 150, justifyContent: 'space-between' },
  jlptLevel: { fontSize: 32, fontWeight: '900', color: '#000' },
  jlptTitle: { fontSize: 14, fontWeight: '900', color: '#000', marginTop: 4 },
  jlptDesc: { fontSize: 12, fontWeight: '700', color: 'rgba(0,0,0,0.7)', marginTop: 4, lineHeight: 16 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 },
  gridItemWrapper: { width: '47%', position: 'relative', marginBottom: 8 },
  gridCard: { borderRadius: 20, borderWidth: 4, borderColor: '#000000', padding: 16, alignItems: 'flex-start', height: 140, justifyContent: 'flex-end' },
  gridIconContainer: { backgroundColor: 'rgba(255,255,255,0.6)', padding: 8, borderRadius: 12, borderWidth: 2, borderColor: '#000', position: 'absolute', top: 12, right: 12 },
  gridCardTitle: { fontSize: 18, fontWeight: '900', color: '#000000', marginBottom: 2 },
  gridCardSubtitle: { fontSize: 12, fontWeight: '700', color: 'rgba(0,0,0,0.6)' },
});