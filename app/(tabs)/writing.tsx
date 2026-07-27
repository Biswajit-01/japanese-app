import { useState } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';

export default function WritingScreen() {
  const [selectedTab, setSelectedTab] = useState<'hiragana' | 'katakana'>('hiragana');

  const hiraganaStrokes = [
    { id: '1', kana: 'あ', romaji: 'a', strokes: ['1. Short horizontal line upward.', '2. Vertical straight down crossing it.', '3. Large loop at bottom right.'] },
    { id: '2', kana: 'い', romaji: 'i', strokes: ['1. Left curve down and up.', '2. Right vertical hook line.'] },
    { id: '3', kana: 'う', romaji: 'u', strokes: ['1. Top small diagonal dot.', '2. Bottom curved hook body.'] },
    { id: '4', kana: 'え', romaji: 'e', strokes: ['1. Top horizontal line.', '2. Bottom diagonal, horizontal right, loop.'] },
    { id: '5', kana: 'お', romaji: 'o', strokes: ['1. Top horizontal bar.', '2. Middle vertical line & loop.', '3. Right tick mark.'] },
    { id: '6', kana: 'か', romaji: 'ka', strokes: ['1. Main horizontal-to-vertical.', '2. Crossing diagonal slash.', '3. Right hook.'] },
    { id: '7', kana: 'き', romaji: 'ki', strokes: ['1. Top horizontal line.', '2. Second parallel line.', '3. Vertical line cutting into a loop.'] },
    { id: '8', kana: 'く', romaji: 'ku', strokes: ['1. Single sharp angular stroke pointing right.'] },
    { id: '9', kana: 'け', romaji: 'ke', strokes: ['1. Vertical line.', '2. Horizontal cross line.', '3. Right loop stroke.'] },
    { id: '10', kana: 'こ', romaji: 'ko', strokes: ['1. Top curved horizontal line.', '2. Bottom curved horizontal line.'] },
    { id: '11', kana: 'さ', romaji: 'sa', strokes: ['1. Top horizontal line.', '2. Vertical down with a right loop.'] },
    { id: '12', kana: 'し', romaji: 'shi', strokes: ['1. Single vertical hook curving up to the right.'] },
    { id: '13', kana: 'す', romaji: 'su', strokes: ['1. Top horizontal line.', '2. Vertical line with bottom loop.'] },
    { id: '14', kana: 'せ', romaji: 'se', strokes: ['1. Horizontal line.', '2. Vertical line curving right and bottom loop.'] },
    { id: '15', kana: 'そ', romaji: 'so', strokes: ['1. Single zigzag stroke resembling a Z and a c.'] },
    { id: '16', kana: 'た', romaji: 'ta', strokes: ['1. Horizontal line.', '2. Vertical line.', '3. Small right hook and loop.'] },
    { id: '17', kana: 'ち', romaji: 'chi', strokes: ['1. Horizontal top line.', '2. Vertical down with a large lower loop.'] },
    { id: '18', kana: 'つ', romaji: 'tsu', strokes: ['1. Single curving scoop stroke.'] },
    { id: '19', kana: 'て', romaji: 'te', strokes: ['1. Top horizontal line curving down into a hook.'] },
    { id: '20', kana: 'と', romaji: 'to', strokes: ['1. Diagonal line down.', '2. Curved intersecting loop.'] },
    { id: '21', kana: 'な', romaji: 'na', strokes: ['1. Horizontal line.', '2. Vertical cross.', '3. Right loop and small dash.'] },
    { id: '22', kana: 'に', romaji: 'ni', strokes: ['1. Left vertical line.', '2. Right parallel double-curve lines.'] },
    { id: '23', kana: 'ぬ', romaji: 'nu', strokes: ['1. Diagonal line down.', '2. Large looping tail at the bottom.'] },
    { id: '24', kana: 'ね', romaji: 'ne', strokes: ['1. Vertical line.', '2. Right loop and bottom swirl.'] },
    { id: '25', kana: 'の', romaji: 'no', strokes: ['1. Single continuous oval loop.'] },
    { id: '26', kana: 'は', romaji: 'ha', strokes: ['1. Vertical line.', '2. Separate right loop and vertical curve.'] },
    { id: '27', kana: 'ひ', romaji: 'hi', strokes: ['1. Single continuous curved arch stroke.'] },
    { id: '28', kana: 'ふ', romaji: 'fu', strokes: ['1. Top dot.', '2. Left curve dot.', '3. Center bridge and bottom hook.'] },
    { id: '29', kana: 'へ', romaji: 'he', strokes: ['1. Single sharp V-shaped peak stroke.'] },
    { id: '30', kana: 'ほ', romaji: 'ho', strokes: ['1. Top vertical line.', '2. Horizontal cross bar.', '3. Right loop and hook.'] },
    { id: '31', kana: 'ま', romaji: 'ma', strokes: ['1. Top horizontal line.', '2. Second horizontal line.', '3. Vertical loop line.'] },
    { id: '32', kana: 'み', romaji: 'mi', strokes: ['1. Top curved vertical stroke with loop.'] },
    { id: '33', kana: 'む', romaji: 'mu', strokes: ['1. Diagonal top line.', '2. Loop and tail at the bottom.'] },
    { id: '34', kana: 'め', romaji: 'me', strokes: ['1. Diagonal line down.', '2. Intersecting loop stroke.'] },
    { id: '35', kana: 'も', romaji: 'mo', strokes: ['1. Top horizontal line.', '2. Sweeping downward hook loop.'] },
    { id: '36', kana: 'や', romaji: 'ya', strokes: ['1. Left vertical hook.', '2. Right sweeping curve line.'] },
    { id: '37', kana: 'ゆ', romaji: 'yu', strokes: ['1. Vertical curving line with top loop.'] },
    { id: '38', kana: 'よ', romaji: 'yo', strokes: ['1. Vertical line with right horizontal extension and loop.'] },
    { id: '39', kana: 'ら', romaji: 'ra', strokes: ['1. Short top stroke.', '2. Bottom sweeping hook curve.'] },
    { id: '40', kana: 'り', romaji: 'ri', strokes: ['1. Left short vertical.', '2. Right long vertical hook.'] },
    { id: '41', kana: 'る', romaji: 'ru', strokes: ['1. Single continuous line ending in a loop.'] },
    { id: '42', kana: 'れ', romaji: 're', strokes: ['1. Vertical line.', '2. Right side curved loop.'] },
    { id: '43', kana: 'ろ', romaji: 'ro', strokes: ['1. Single continuous zigzag loop ending.'] },
    { id: '44', kana: 'わ', romaji: 'wa', strokes: ['1. Vertical line down.', '2. Bottom loop wrapping around.'] },
    { id: '45', kana: 'を', romaji: 'wo', strokes: ['1. Top horizontal line.', '2. Diagonal stroke.', '3. Bottom curved loop.'] },
    { id: '46', kana: 'ん', romaji: 'n', strokes: ['1. Single upward sweeping diagonal curve.'] },
  ];

  const katakanaStrokes = [
    { id: '1', kana: 'ア', romaji: 'a', strokes: ['1. Top horizontal-to-diagonal stroke.', '2. Vertical sliding line down.'] },
    { id: '2', kana: 'イ', romaji: 'i', strokes: ['1. Top diagonal stroke.', '2. Main vertical pillar line.'] },
    { id: '3', kana: 'ウ', romaji: 'u', strokes: ['1. Top short vertical dash.', '2. Lower curved hook body.'] },
    { id: '4', kana: 'エ', romaji: 'e', strokes: ['1. Top short horizontal bar.', '2. Vertical pillar.', '3. Bottom long base line.'] },
    { id: '5', kana: 'オ', romaji: 'o', strokes: ['1. Top horizontal line.', '2. Vertical drop.', '3. Bottom-left sweeping diagonal.'] },
    { id: '6', kana: 'カ', romaji: 'ka', strokes: ['1. Horizontal top turning down into a corner.', '2. Left diagonal slash.'] },
    { id: '7', kana: 'キ', romaji: 'ki', strokes: ['1. Two parallel top horizontal lines.', '2. Intersecting diagonal leg.'] },
    { id: '8', kana: 'ク', romaji: 'ku', strokes: ['1. Top left-to-right stroke.', '2. Bottom-left falling leg.'] },
    { id: '9', kana: 'ケ', romaji: 'ke', strokes: ['1. Top short horizontal.', '2. Left diagonal leg.', '3. Right diagonal leg.'] },
    { id: '10', kana: 'コ', romaji: 'ko', strokes: ['1. Top horizontal turning down.', '2. Bottom base line.'] },
    { id: '11', kana: 'サ', romaji: 'sa', strokes: ['1. Top short horizontal.', '2. Second horizontal line.', '3. Long vertical drop with hook.'] },
    { id: '12', kana: 'シ', romaji: 'shi', strokes: ['1. Two small top dots.', '2. Bottom sweeping curved stroke up.'] },
    { id: '13', kana: 'ス', romaji: 'su', strokes: ['1. Top horizontal stroke.', '2. Intersecting diagonal slash down.'] },
    { id: '14', kana: 'セ', romaji: 'se', strokes: ['1. Top horizontal bar.', '2. Long vertical line with bottom hook.'] },
    { id: '15', kana: 'ソ', romaji: 'so', strokes: ['1. Top left dot slash.', '2. Right sweeping curve.'] },
    { id: '16', kana: 'タ', romaji: 'ta', strokes: ['1. Top horizontal line.', '2. Diagonal down stroke.'] },
    { id: '17', kana: 'チ', romaji: 'chi', strokes: ['1. Top horizontal line.', '2. Vertical line curving left.', '3. Short right dash.'] },
    { id: '18', kana: 'ツ', romaji: 'tsu', strokes: ['1. Two short top dashes.', '2. Main sweeping curve stroke.'] },
    { id: '19', kana: 'テ', romaji: 'te', strokes: ['1. Top short horizontal line.', '2. Second longer horizontal line.', '3. Central vertical pillar.'] },
    { id: '20', kana: 'ト', romaji: 'to', strokes: ['1. Vertical main pillar.', '2. Right horizontal branch.'] },
    { id: '21', kana: 'ナ', romaji: 'na', strokes: ['1. Top horizontal line.', '2. Diagonal stroke down.'] },
    { id: '22', kana: 'ニ', romaji: 'ni', strokes: ['1. Top short horizontal line.', '2. Bottom longer horizontal line.'] },
    { id: '23', kana: 'ヌ', romaji: 'nu', strokes: ['1. Diagonal cross stroke.', '2. Bottom right sweeping hook.'] },
    { id: '24', kana: 'ネ', romaji: 'ne', strokes: ['1. Top small vertical dot.', '2. Cross bar lines.', '3. Right falling leg.'] },
    { id: '25', kana: 'ノ', romaji: 'no', strokes: ['1. Single diagonal sweeping slash.'] },
    { id: '26', kana: 'ハ', romaji: 'ha', strokes: ['1. Left diagonal stroke.', '2. Right diagonal stroke.'] },
    { id: '27', kana: 'ヒ', romaji: 'hi', strokes: ['1. Top horizontal line.', '2. Vertical hook curving down.'] },
    { id: '28', kana: 'フ', romaji: 'fu', strokes: ['1. Single sweeping hook line from top left to bottom right.'] },
    { id: '29', kana: 'ヘ', romaji: 'he', strokes: ['1. Single sharp V-shaped peak stroke.'] },
    { id: '30', kana: 'ホ', romaji: 'ho', strokes: ['1. Top short vertical dot.', '2. Horizontal cross bar.', '3. Left and right legs.'] },
    { id: '31', kana: 'マ', romaji: 'ma', strokes: ['1. Top horizontal line turning down.', '2. Bottom diagonal dash.'] },
    { id: '32', kana: 'ミ', romaji: 'mi', strokes: ['1. Three parallel diagonal slash strokes.'] },
    { id: '33', kana: 'ム', romaji: 'mu', strokes: ['1. Top diagonal cap.', '2. Bottom looping V-shape.'] },
    { id: '34', kana: 'メ', romaji: 'me', strokes: ['1. Diagonal crossing slash lines.'] },
    { id: '35', kana: 'モ', romaji: 'mo', strokes: ['1. Two parallel top horizontal bars.', '2. Long vertical line through them.'] },
    { id: '36', kana: 'ヤ', romaji: 'ya', strokes: ['1. Top horizontal hook.', '2. Right falling diagonal leg.'] },
    { id: '37', kana: 'ユ', romaji: 'yu', strokes: ['1. Top horizontal line turning down into a U-shape.'] },
    { id: '38', kana: 'ヨ', romaji: 'yo', strokes: ['1. Top horizontal turning down.', '2. Middle short horizontal.', '3. Bottom base line.'] },
    { id: '39', kana: 'ラ', romaji: 'ra', strokes: ['1. Top horizontal line.', '2. Bottom curving tail hook.'] },
    { id: '40', kana: 'リ', romaji: 'ri', strokes: ['1. Left short vertical line.', '2. Right long vertical pillar hook.'] },
    { id: '41', kana: 'ル', romaji: 'ru', strokes: ['1. Diagonal falling line.', '2. Right sweeping curve leg.'] },
    { id: '42', kana: 'レ', romaji: 're', strokes: ['1. Single sweeping checkmark hook stroke.'] },
    { id: '43', kana: 'ロ', romaji: 'ro', strokes: ['1. Outer square box stroke.'] },
    { id: '44', kana: 'ワ', romaji: 'wa', strokes: ['1. Short top vertical tick.', '2. Horizontal bar turning down.'] },
    { id: '45', kana: 'ヲ', romaji: 'wo', strokes: ['1. Top horizontal line.', '2. Diagonal cross slash.', '3. Bottom right hook.'] },
    { id: '46', kana: 'ン', romaji: 'n', strokes: ['1. Left diagonal stroke.', '2. Right vertical stroke up.'] },
  ];

  const currentList = selectedTab === 'hiragana' ? hiraganaStrokes : katakanaStrokes;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Stroke Guide ✍️</Text>
      <Text style={styles.subHeader}>Tap any character card to hear its pronunciation.</Text>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, selectedTab === 'hiragana' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('hiragana')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, selectedTab === 'hiragana' && styles.tabTextActive]}>Hiragana</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, selectedTab === 'katakana' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('katakana')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, selectedTab === 'katakana' && styles.tabTextActive]}>Katakana</Text>
        </TouchableOpacity>
      </View>

      <FlatList 
        data={currentList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            activeOpacity={0.9}
            style={styles.cardWrapper}
            onPress={() => { Speech.stop(); Speech.speak(item.kana, { language: 'ja-JP', rate: 0.3 }); }}
          >
            <View style={styles.cardShadow} />
            <View style={styles.card}>
              <View style={styles.cardLeft}>
                <Text style={styles.kana}>{item.kana}</Text>
                <View style={styles.romajiBadge}>
                  <Text style={styles.romaji}>{item.romaji}</Text>
                </View>
              </View>

              <View style={styles.cardRight}>
                <Text style={styles.strokeTitle}>STROKE STEPS ({item.strokes.length}):</Text>
                {item.strokes.map((step, index) => (
                  <Text key={index} style={styles.strokeStep}>{step}</Text>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#520D58' },
  header: { fontSize: 26, fontWeight: '900', textAlign: 'center', marginTop: 15, color: '#ffffff' },
  subHeader: { fontSize: 13, color: '#9DEEE9', textAlign: 'center', fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 15, letterSpacing: 0.5 },
  
  tabContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20, gap: 12 },
  tabButton: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 12, backgroundColor: '#A7B3B7', borderWidth: 2, borderColor: '#000' },
  tabButtonActive: { backgroundColor: '#FA73FF', shadowColor: '#000', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0 },
  tabText: { color: '#000', fontWeight: '900', fontSize: 13 },
  tabTextActive: { color: '#000' },

  listContainer: { paddingHorizontal: 20, paddingBottom: 40 },
  cardWrapper: { position: 'relative', marginBottom: 20 },
  cardShadow: { position: 'absolute', top: 6, left: 6, right: -6, bottom: -6, backgroundColor: '#000', borderRadius: 16 },
  card: { backgroundColor: '#DA9EFF', flexDirection: 'row', padding: 16, borderRadius: 16, borderWidth: 3, borderColor: '#000', alignItems: 'center' },
  cardLeft: { alignItems: 'center', justifyContent: 'center', width: 75, borderRightWidth: 3, borderRightColor: '#000', marginRight: 15, paddingRight: 15 },
  kana: { fontSize: 42, fontWeight: '900', color: '#000' },
  romajiBadge: { backgroundColor: '#000', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 4 },
  romaji: { fontSize: 14, color: '#DA9EFF', fontWeight: '900' },
  cardRight: { flex: 1 },
  strokeTitle: { fontSize: 12, fontWeight: '900', color: '#000', marginBottom: 8, letterSpacing: 1 },
  strokeStep: { fontSize: 13, color: '#222', marginBottom: 4, fontWeight: '700', lineHeight: 18 },
});