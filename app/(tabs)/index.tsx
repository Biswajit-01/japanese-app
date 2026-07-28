import { useState } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import * as Speech from 'expo-speech';

const { width } = Dimensions.get('window');
// Fix card size calculation to respect the 680px web container limit
const effectiveWidth = Math.min(width, 680);
const cardMargin = 4;
const cardSize = (effectiveWidth - 30 - (cardMargin * 10)) / 5; 

export default function AlphabetScreen() {
  const [selectedTab, setSelectedTab] = useState<'hiragana' | 'katakana' | 'kanji'>('hiragana');

  const hiraganaList = [
    { kana: 'あ', romaji: 'a' }, { kana: 'い', romaji: 'i' }, { kana: 'う', romaji: 'u' }, { kana: 'え', romaji: 'e' }, { kana: 'お', romaji: 'o' },
    { kana: 'か', romaji: 'ka' }, { kana: 'き', romaji: 'ki' }, { kana: 'く', romaji: 'ku' }, { kana: 'け', romaji: 'ke' }, { kana: 'こ', romaji: 'ko' },
    { kana: 'さ', romaji: 'sa' }, { kana: 'し', romaji: 'shi' }, { kana: 'す', romaji: 'su' }, { kana: 'せ', romaji: 'se' }, { kana: 'そ', romaji: 'so' },
    { kana: 'た', romaji: 'ta' }, { kana: 'ち', romaji: 'chi' }, { kana: 'つ', romaji: 'tsu' }, { kana: 'て', romaji: 'te' }, { kana: 'と', romaji: 'to' },
    { kana: 'な', romaji: 'na' }, { kana: 'に', romaji: 'ni' }, { kana: 'ぬ', romaji: 'nu' }, { kana: 'ね', romaji: 'ne' }, { kana: 'の', romaji: 'no' },
    { kana: 'は', romaji: 'ha' }, { kana: 'ひ', romaji: 'hi' }, { kana: 'ふ', romaji: 'fu' }, { kana: 'へ', romaji: 'he' }, { kana: 'ほ', romaji: 'ho' },
    { kana: 'ま', romaji: 'ma' }, { kana: 'み', romaji: 'mi' }, { kana: 'む', romaji: 'mu' }, { kana: 'め', romaji: 'me' }, { kana: 'も', romaji: 'mo' },
    { kana: 'や', romaji: 'ya' }, { kana: '', romaji: '' }, { kana: 'ゆ', romaji: 'yu' }, { kana: '', romaji: '' }, { kana: 'よ', romaji: 'yo' },
    { kana: 'ら', romaji: 'ra' }, { kana: 'り', romaji: 'ri' }, { kana: 'る', romaji: 'ru' }, { kana: 'れ', romaji: 're' }, { kana: 'ろ', romaji: 'ro' },
    { kana: 'わ', romaji: 'wa' }, { kana: '', romaji: '' }, { kana: '', romaji: '' }, { kana: 'を', romaji: 'wo' }, { kana: 'ん', romaji: 'n' },
  ];
  const katakanaList = [
    { kana: 'ア', romaji: 'a' }, { kana: 'イ', romaji: 'i' }, { kana: 'ウ', romaji: 'u' }, { kana: 'エ', romaji: 'e' }, { kana: 'オ', romaji: 'o' },
    { kana: 'カ', romaji: 'ka' }, { kana: 'キ', romaji: 'ki' }, { kana: 'ク', romaji: 'ku' }, { kana: 'ケ', romaji: 'ke' }, { kana: 'コ', romaji: 'ko' },
    { kana: 'サ', romaji: 'sa' }, { kana: 'シ', romaji: 'shi' }, { kana: 'ス', romaji: 'su' }, { kana: 'セ', romaji: 'se' }, { kana: 'ソ', romaji: 'so' },
    { kana: 'タ', romaji: 'ta' }, { kana: 'チ', romaji: 'chi' }, { kana: 'ツ', romaji: 'tsu' }, { kana: 'テ', romaji: 'te' }, { kana: 'ト', romaji: 'to' },
    { kana: 'ナ', romaji: 'na' }, { kana: 'ニ', romaji: 'ni' }, { kana: 'ヌ', romaji: 'nu' }, { kana: 'ネ', romaji: 'ne' }, { kana: 'ノ', romaji: 'no' },
    { kana: 'ハ', romaji: 'ha' }, { kana: 'ヒ', romaji: 'hi' }, { kana: 'フ', romaji: 'fu' }, { kana: 'ヘ', romaji: 'he' }, { kana: 'ホ', romaji: 'ho' },
    { kana: 'マ', romaji: 'ma' }, { kana: 'ミ', romaji: 'mi' }, { kana: 'ム', romaji: 'mu' }, { kana: 'メ', romaji: 'me' }, { kana: 'モ', romaji: 'mo' },
    { kana: 'ヤ', romaji: 'ya' }, { kana: '', romaji: '' }, { kana: 'ユ', romaji: 'yu' }, { kana: '', romaji: '' }, { kana: 'ヨ', romaji: 'yo' },
    { kana: 'ラ', romaji: 'ra' }, { kana: 'リ', romaji: 'ri' }, { kana: 'ル', romaji: 'ru' }, { kana: 'レ', romaji: 're' }, { kana: 'ロ', romaji: 'ro' },
    { kana: 'わ', romaji: 'wa' }, { kana: '', romaji: '' }, { kana: '', romaji: '' }, { kana: 'ヲ', romaji: 'wo' }, { kana: 'ン', romaji: 'n' },
  ];
  const kanjiList = [
    { kana: '一', romaji: 'ichi (1)' }, { kana: '二', romaji: 'ni (2)' }, { kana: '三', romaji: 'san (3)' }, { kana: '四', romaji: 'yon (4)' }, { kana: '五', romaji: 'go (5)' },
    { kana: '六', romaji: 'roku (6)' }, { kana: '七', romaji: 'nana (7)' }, { kana: '八', romaji: 'hachi (8)' }, { kana: '九', romaji: 'kyuu (9)' }, { kana: '十', romaji: 'juu (10)' },
    { kana: '日', romaji: 'hi (sun)' }, { kana: '月', romaji: 'tsuki (moon)' }, { kana: '火', romaji: 'hi (fire)' }, { kana: '水', romaji: 'mizu (water)' }, { kana: '木', romaji: 'ki (tree)' },
    { kana: '金', romaji: 'kane (gold)' }, { kana: '土', romaji: 'tsuchi (soil)' }, { kana: '人', romaji: 'hito (person)' }, { kana: '口', romaji: 'kuchi (mouth)' }, { kana: '目', romaji: 'me (eye)' },
  ];

  const data = selectedTab === 'hiragana' ? hiraganaList : selectedTab === 'katakana' ? katakanaList : kanjiList;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gridOverlay}>
        {[...Array(10)].map((_, i) => <View key={`v-${i}`} style={[styles.gridLineVertical, { left: i * 60 }]} />)}
        {[...Array(25)].map((_, i) => <View key={`h-${i}`} style={[styles.gridLineHorizontal, { top: i * 60 }]} />)}
      </View>

      <Text style={styles.header}>Alphabet 🔤</Text>

      <View style={styles.tabContainer}>
        {['hiragana', 'katakana', 'kanji'].map((tab) => (
          <TouchableOpacity 
            key={tab}
            style={[styles.tabButton, selectedTab === tab && styles.tabButtonActive]}
            onPress={() => setSelectedTab(tab as any)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList 
        key={`5-cols-${selectedTab}`} 
        data={data}
        keyExtractor={(item, index) => item.romaji + index}
        numColumns={5} 
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          if (!item.kana) return <View style={styles.emptyCard} />;
          return (
            <TouchableOpacity 
              activeOpacity={0.8}
              style={styles.cardWrapper}
              onPress={() => { Speech.stop(); Speech.speak(item.kana, { language: 'ja-JP'}); }}
            >
              <View style={styles.cardShadow} />
              <View style={styles.card}>
                <Text style={styles.kana}>{item.kana}</Text>
                <Text style={styles.romaji} numberOfLines={1}>{item.romaji}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
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
  header: { fontSize: 26, fontWeight: '900', textAlign: 'center', marginVertical: 15, color: '#ffffff' },
  tabContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20, gap: 8, paddingHorizontal: 10 },
  tabButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#A7B3B7', borderWidth: 2, borderColor: '#000' },
  tabButtonActive: { backgroundColor: '#FA73FF', shadowColor: '#000', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0 },
  tabText: { color: '#000', fontWeight: '900', fontSize: 12 },
  tabTextActive: { color: '#000' },
  gridContainer: { paddingHorizontal: 15, paddingBottom: 30, alignItems: 'center' },
  cardWrapper: { width: cardSize, height: cardSize + 10, margin: cardMargin, position: 'relative' },
  cardShadow: { position: 'absolute', top: 4, left: 4, right: -4, bottom: -4, backgroundColor: '#000', borderRadius: 12 },
  card: { flex: 1, backgroundColor: '#DA9EFF', borderRadius: 12, borderWidth: 2, borderColor: '#000', justifyContent: 'center', alignItems: 'center' },
  emptyCard: { width: cardSize, height: cardSize + 10, margin: cardMargin, backgroundColor: 'transparent' },
  kana: { fontSize: 24, fontWeight: '900', color: '#000' },
  romaji: { fontSize: 10, color: '#333', marginTop: 2, fontWeight: '800', textAlign: 'center', paddingHorizontal: 2 },
});