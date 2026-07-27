import * as Speech from 'expo-speech';
import { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const cardSize = (screenWidth - 60) / 5; 

export default function KanaGrid({ currentSection }: { currentSection: string }) {
  const [tappedCard, setTappedCard] = useState(-1);

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
    { kana: 'わ', romaji: 'wa' }, { kana: '', romaji: '' }, { kana: '', romaji: '' }, { kana: '', romaji: '' }, { kana: 'を', romaji: 'wo' },
    { kana: 'ん', romaji: 'n' }, { kana: '', romaji: '' }, { kana: '', romaji: '' }, { kana: '', romaji: '' }, { kana: '', romaji: '' }
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
    { kana: 'ワ', romaji: 'wa' }, { kana: '', romaji: '' }, { kana: '', romaji: '' }, { kana: '', romaji: '' }, { kana: 'ヲ', romaji: 'wo' },
    { kana: 'ン', romaji: 'n' }, { kana: '', romaji: '' }, { kana: '', romaji: '' }, { kana: '', romaji: '' }, { kana: '', romaji: '' }
  ];

  const kanjiList = [
    { kana: '一', romaji: 'ichi' },
    { kana: '二', romaji: 'ni' },
    { kana: '三', romaji: 'san' },
    { kana: '日', romaji: 'hi' },
    { kana: '月', romaji: 'tsuki' }
  ];

  let activeList = hiraganaList;
  if (currentSection === 'Katakana') activeList = katakanaList;
  if (currentSection === 'Kanji') activeList = kanjiList;

  const handleTap = (index: number, word: string) => {
    if (word === '') return; 
    
    setTappedCard(index);
    setTimeout(() => {
      setTappedCard(-1);
    }, 300);

    let speechRate = 0.4;
    if (index < 5) {
      speechRate = 0.1; 
    }

    // Instantly cuts off the old word and plays the new one with the clean, default voice
    Speech.stop(); 
    Speech.speak(word, { language: 'ja-JP'}); 
  };

  return (
    <ScrollView contentContainerStyle={styles.grid}>
      {activeList.map((item, index) => {
        if (item.kana === '') {
          return <View key={index} style={[styles.card, styles.emptyCard]} />;
        }

        return (
          <TouchableOpacity 
            key={index} 
            style={[styles.card, tappedCard === index && styles.cardTapped]}
            onPress={() => handleTap(index, item.kana)}
          >
            <Text style={[styles.kanaText, currentSection === 'Kanji' && styles.kanjiText]}>
              {item.kana}
            </Text>
            <Text style={styles.romajiText}>
              {item.romaji}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', 
    padding: 10,
    gap: 10, 
    paddingBottom: 50, 
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)', 
    borderRadius: 15, 
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)', 
    width: cardSize, 
    height: cardSize, 
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, 
  },
  emptyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowOpacity: 0,
    elevation: 0,
  },
  cardTapped: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)', 
    borderColor: '#fff',
  },
  kanaText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff', 
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  kanjiText: {
    fontSize: 16, 
  },
  romajiText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#eee',
    marginTop: 4, 
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  }
});