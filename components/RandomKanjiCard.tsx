import * as Speech from 'expo-speech';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Import your local fallback vocabulary file
import vocabData from '../assets/vocab.json';

export default function RandomKanjiCard() {
  const [randomWord, setRandomWord] = useState<any>(null);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRandomWord = async () => {
    setLoading(true);
    setRevealed(false);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch('https://jlpt-vocab-api.vercel.app/api/words/random', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setRandomWord({
          kanji: data.word || data.kanji,
          furigana: data.furigana || data.reading,
          romaji: data.romaji || '',
          meaning: data.meaning || data.english,
          level: `N${data.level || '5'}`,
        });
        setLoading(false);
        return;
      }
      throw new Error('Network response failed');
    } catch (error) {
      const safeData = Array.isArray(vocabData) ? vocabData : [];
      if (safeData.length > 0) {
        const randomIndex = Math.floor(Math.random() * safeData.length);
        const localItem = safeData[randomIndex];
        setRandomWord({
          kanji: localItem.kanji || localItem.word || localItem.kana,
          furigana: localItem.furigana || localItem.reading || localItem.kana,
          romaji: localItem.romaji || '',
          meaning: localItem.meaning || localItem.english,
          level: localItem.level || 'N5',
        });
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomWord();
  }, []);

  const speakWord = (text: string) => {
    if (!text) return;
    Speech.stop();
    Speech.speak(text, { language: 'ja-JP'});
  };

  return (
    <View style={styles.wrapper}>
      {/* Compact Flashcard Box */}
      <View style={styles.cardWrapper}>
        <View style={styles.cardShadow} />
        
        {loading ? (
          <View style={[styles.flashcard, { justifyContent: 'center' }]}>
            <ActivityIndicator size="small" color="#520D58" />
            <Text style={styles.loadingText}>Fetching word...</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.flashcard} 
            activeOpacity={0.9} 
            onPress={() => {
              setRevealed(!revealed);
              speakWord(randomWord?.kanji);
            }}
          >
            <View style={styles.badgeRow}>
              <View style={styles.tagBadge}>
                <Text style={styles.tagText}>✨ DAILY KANJI TEASER</Text>
              </View>
            </View>
            
            <Text style={styles.kanjiDisplay}>{randomWord?.kanji}</Text>
            <Text style={styles.furiganaDisplay}>{randomWord?.furigana}</Text>

            {/* Compact fixed content box to keep layout completely stable */}
            <View style={styles.fixedContentBox}>
              {revealed ? (
                <View style={styles.revealedContainer}>
                  <Text style={styles.romajiText}>{randomWord?.romaji}</Text>
                  <Text style={styles.meaningText} numberOfLines={1}>{randomWord?.meaning}</Text>
                  <Text style={styles.levelIndicator}>JLPT Level: {randomWord?.level}</Text>
                </View>
              ) : (
                <View style={styles.hiddenContainer}>
                  <Text style={styles.hiddenText}>👆 Tap to reveal meaning & audio</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Shorter Shuffle Button */}
      <TouchableOpacity style={styles.actionWrapper} activeOpacity={0.8} onPress={fetchRandomWord}>
        <View style={[styles.cardShadow, { top: 3, left: 3 }]} />
        <View style={styles.shuffleButton}>
          <Text style={styles.actionButtonText}>Shuffle New Word 🔀</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', alignItems: 'center', marginVertical: 4 },
  cardWrapper: { position: 'relative', width: '100%', marginBottom: 8 },
  cardShadow: { position: 'absolute', top: 5, left: 5, right: -5, bottom: -5, backgroundColor: '#000', borderRadius: 14 },
  
  // Reduced height from 230 to 175 for a much more compact look
  flashcard: { backgroundColor: '#9DEEE9', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 14, borderWidth: 3.5, borderColor: '#000', alignItems: 'center', height: 175, justifyContent: 'space-between' },
  
  badgeRow: { flexDirection: 'row', justifyContent: 'center', width: '100%', alignItems: 'center' },
  tagBadge: { backgroundColor: '#FA73FF', paddingVertical: 2, paddingHorizontal: 8, borderRadius: 5, borderWidth: 1.5, borderColor: '#000' },
  tagText: { fontSize: 8, fontWeight: '900', color: '#000', letterSpacing: 0.5 },

  kanjiDisplay: { fontSize: 34, fontWeight: '900', color: '#000', lineHeight: 38 },
  furiganaDisplay: { fontSize: 12, fontWeight: '800', color: '#333' },

  // Shorter fixed box height (45px) to prevent card layout shifting
  fixedContentBox: { width: '100%', height: 45, justifyContent: 'center', alignItems: 'center' },

  hiddenContainer: { backgroundColor: '#ffffff', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, borderWidth: 1.5, borderColor: '#000', width: '100%', alignItems: 'center' },
  hiddenText: { fontSize: 9, fontWeight: '900', color: '#520D58' },

  revealedContainer: { backgroundColor: '#ffffff', paddingVertical: 2, paddingHorizontal: 8, borderRadius: 6, borderWidth: 1.5, borderColor: '#000', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center', gap: 1 },
  romajiText: { fontSize: 10, fontWeight: '800', color: '#555', textTransform: 'uppercase' },
  meaningText: { fontSize: 11, fontWeight: '900', color: '#000', textAlign: 'center' },
  levelIndicator: { fontSize: 7, fontWeight: '900', backgroundColor: '#FA73FF', paddingHorizontal: 4, paddingVertical: 0.5, borderRadius: 3, overflow: 'hidden', borderWidth: 1, borderColor: '#000' },

  actionWrapper: { position: 'relative', width: '100%', marginBottom: 8 },
  shuffleButton: { backgroundColor: '#FA73FF', paddingVertical: 6, borderRadius: 10, borderWidth: 2.5, borderColor: '#000', alignItems: 'center' },
  actionButtonText: { color: '#000', fontWeight: '900', fontSize: 12 },
  loadingText: { color: '#520D58', fontWeight: '900', fontSize: 11 },
});