import { StyleSheet, Text, View, SafeAreaView, ScrollView, Pressable, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function RoadmapScreen() {
  const router = useRouter();

  const journeySteps = [
    { 
      level: 'N5', 
      title: 'The Foundation', 
      desc: 'Your first steps into Japanese. Survive daily situations and learn how the language sounds.', 
      color: '#9DEEE9',
      icon: 'egg',
      milestones: [
        'Master Hiragana & Katakana',
        'Learn 100 essential Kanji',
        'Basic grammar (Particles, Masu-form)',
        'Introduce yourself & ask directions'
      ]
    },
    { 
      level: 'N4', 
      title: 'Basic Fluency', 
      desc: 'Start speaking more naturally and understand basic daily life conversations.', 
      color: '#DA9EFF',
      icon: 'walk',
      milestones: [
        'Learn 300 new Kanji',
        'Verb conjugations (Te-form, Ta-form)',
        'Express desires & intentions',
        'Understand standard casual conversations'
      ]
    },
    { 
      level: 'N3', 
      title: 'Intermediate Bridge', 
      desc: 'The great filter! Transition from textbook Japanese to real-world Japanese.', 
      color: '#FA73FF',
      icon: 'bicycle',
      milestones: [
        'Learn 650 new Kanji (Total: ~1,000)',
        'Read short articles & blogs',
        'Understand casual speech & slang',
        'Express complex opinions & feelings'
      ]
    },
    { 
      level: 'N2', 
      title: 'Pre-Advanced', 
      desc: 'You can now work in a Japanese company and consume native media without much trouble.', 
      color: '#A7B3B7',
      icon: 'car',
      milestones: [
        'Learn 1,000 advanced Kanji',
        'Read general news & magazines',
        'Understand natural speed Japanese',
        'Master basic Business Japanese (Keigo)'
      ]
    },
    { 
      level: 'N1', 
      title: 'Native Mastery', 
      desc: 'The final boss. Achieve near-native fluency in reading, listening, and nuances.', 
      color: '#ffffff',
      icon: 'rocket',
      milestones: [
        'Master all 2,136 Joyo Kanji',
        'Read academic & technical texts',
        'Understand deep nuances & idioms',
        'Flawless reading & listening comprehension'
      ]
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Grid */}
      <View style={styles.gridOverlay}>
        {[...Array(10)].map((_, i) => <View key={`v-${i}`} style={[styles.gridLineVertical, { left: i * 60 }]} />)}
        {[...Array(35)].map((_, i) => <View key={`h-${i}`} style={[styles.gridLineHorizontal, { top: i * 50 }]} />)}
      </View>

      {/* Top Header with Back Button */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          {({ pressed }) => (
            <>
              <View style={[styles.cardShadow, { top: 3, left: 3 }]} />
              <View style={[styles.backBtnMain, pressed && styles.pressedSmall]}>
                <Ionicons name="arrow-back" size={24} color="#000" />
              </View>
            </>
          )}
        </Pressable>
        <Text style={styles.headerTitle}>Your Journey 🗺️</Text>
        <View style={{ width: 44 }} /> 
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.timelineWrapper}>
          {/* The Thick Vertical Timeline Line */}
          <View style={styles.timelineLine} />

          {journeySteps.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              
              {/* Timeline Node (Circle on the line) */}
              <View style={[styles.timelineNode, { backgroundColor: step.color }]}>
                <Ionicons name={step.icon as any} size={18} color="#000" />
              </View>

              {/* Roadmap Card */}
              <Pressable style={styles.cardWrapper}>
                {({ pressed }) => (
                  <>
                    <View style={styles.cardShadow} />
                    <View style={[styles.mainCard, { backgroundColor: step.color }, pressed && styles.pressedCard]}>
                      
                      <View style={styles.cardHeader}>
                        <View style={styles.levelBadge}>
                          <Text style={styles.levelText}>{step.level}</Text>
                        </View>
                        <Text style={styles.cardTitle}>{step.title}</Text>
                      </View>
                      
                      <Text style={styles.cardDesc}>{step.desc}</Text>

                      {/* The New Milestones Checklist */}
                      <View style={styles.milestoneContainer}>
                        <Text style={styles.milestoneHeader}>GOALS FOR THIS LEVEL:</Text>
                        {step.milestones.map((milestone, mIndex) => (
                          <View key={mIndex} style={styles.milestoneRow}>
                            <Ionicons name="checkmark-circle" size={16} color="#000" style={styles.checkIcon} />
                            <Text style={styles.milestoneText}>{milestone}</Text>
                          </View>
                        ))}
                      </View>

                    </View>
                  </>
                )}
              </Pressable>

            </View>
          ))}

          {/* Finish Line Indicator */}
          <View style={styles.finishLineWrapper}>
            <View style={[styles.timelineNode, { backgroundColor: '#FA73FF', top: 0, left: -14, width: 36, height: 36, borderRadius: 18 }]}>
              <Ionicons name="flag" size={20} color="#000" />
            </View>
            <Text style={styles.finishLineText}>Keep Practicing!</Text>
          </View>

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
  
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, marginBottom: 20 },
  backButton: { position: 'relative', width: 44, height: 44 },
  backBtnMain: { width: 44, height: 44, backgroundColor: '#A7B3B7', borderRadius: 12, borderWidth: 3, borderColor: '#000', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#ffffff' },
  scrollView: { flex: 1 },
  scrollContainer: { paddingBottom: 40 },
  
  timelineWrapper: { position: 'relative', paddingHorizontal: 20, paddingBottom: 20 },
  timelineLine: { position: 'absolute', left: 40, top: 15, bottom: 15, width: 8, backgroundColor: '#000', borderRadius: 4 },
  
  stepContainer: { flexDirection: 'row', marginBottom: 40, position: 'relative' },
  timelineNode: { position: 'absolute', left: 4, top: 15, width: 32, height: 32, borderRadius: 16, borderWidth: 4, borderColor: '#000', justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  
  cardWrapper: { flex: 1, marginLeft: 50, position: 'relative' },
  cardShadow: { position: 'absolute', top: 6, left: 6, right: -6, bottom: -6, backgroundColor: '#000', borderRadius: 16 },
  mainCard: { padding: 18, borderRadius: 16, borderWidth: 4, borderColor: '#000' },
  
  pressedSmall: { transform: [{ translateX: 3 }, { translateY: 3 }] },
  pressedCard: { transform: [{ translateX: 6 }, { translateY: 6 }] },
  
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  levelBadge: { backgroundColor: '#000', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  levelText: { color: '#ffffff', fontWeight: '900', fontSize: 16 },
  cardTitle: { fontSize: 20, fontWeight: '900', color: '#000', flex: 1, flexWrap: 'wrap' },
  cardDesc: { fontSize: 14, fontWeight: '700', color: 'rgba(0,0,0,0.7)', lineHeight: 20, marginBottom: 16 },

  milestoneContainer: { backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 12, padding: 12, borderWidth: 2, borderColor: '#000' },
  milestoneHeader: { fontSize: 11, fontWeight: '900', color: '#000', marginBottom: 8, letterSpacing: 1 },
  milestoneRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6, paddingRight: 10 },
  checkIcon: { marginTop: 1, marginRight: 6 },
  milestoneText: { fontSize: 13, fontWeight: '700', color: '#111', lineHeight: 18, flex: 1 },

  finishLineWrapper: { flexDirection: 'row', alignItems: 'center', marginLeft: 24, marginTop: 10, position: 'relative' },
  finishLineText: { marginLeft: 45, fontSize: 18, fontWeight: '900', color: '#FA73FF', letterSpacing: 1 }
});