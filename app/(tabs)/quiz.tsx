import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, Animated, ScrollView, Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

const hiraganaPool = [
  { kana: 'あ', romaji: 'a', type: 'Hiragana' }, { kana: 'い', romaji: 'i', type: 'Hiragana' }, { kana: 'う', romaji: 'u', type: 'Hiragana' }, { kana: 'え', romaji: 'e', type: 'Hiragana' }, { kana: 'お', romaji: 'o', type: 'Hiragana' },
  { kana: 'か', romaji: 'ka', type: 'Hiragana' }, { kana: 'き', romaji: 'ki', type: 'Hiragana' }, { kana: 'く', romaji: 'ku', type: 'Hiragana' }, { kana: 'け', romaji: 'ke', type: 'Hiragana' }, { kana: 'こ', romaji: 'ko', type: 'Hiragana' },
  { kana: 'さ', romaji: 'sa', type: 'Hiragana' }, { kana: 'し', romaji: 'shi', type: 'Hiragana' }, { kana: 'す', romaji: 'su', type: 'Hiragana' }, { kana: 'せ', romaji: 'se', type: 'Hiragana' }, { kana: 'そ', romaji: 'so', type: 'Hiragana' },
  { kana: 'た', romaji: 'ta', type: 'Hiragana' }, { kana: 'ち', romaji: 'chi', type: 'Hiragana' }, { kana: 'つ', romaji: 'tsu', type: 'Hiragana' }, { kana: 'て', romaji: 'te', type: 'Hiragana' }, { kana: 'と', romaji: 'to', type: 'Hiragana' },
  { kana: 'な', romaji: 'na', type: 'Hiragana' }, { kana: 'に', romaji: 'ni', type: 'Hiragana' }, { kana: 'ぬ', romaji: 'nu', type: 'Hiragana' }, { kana: 'ね', romaji: 'ne', type: 'Hiragana' }, { kana: 'の', romaji: 'no', type: 'Hiragana' },
  { kana: 'は', romaji: 'ha', type: 'Hiragana' }, { kana: 'ひ', romaji: 'hi', type: 'Hiragana' }, { kana: 'ふ', romaji: 'fu', type: 'Hiragana' }, { kana: 'へ', romaji: 'he', type: 'Hiragana' }, { kana: 'ほ', romaji: 'ho', type: 'Hiragana' },
  { kana: 'ま', romaji: 'ma', type: 'Hiragana' }, { kana: 'み', romaji: 'mi', type: 'Hiragana' }, { kana: 'む', romaji: 'mu', type: 'Hiragana' }, { kana: 'め', romaji: 'me', type: 'Hiragana' }, { kana: 'も', romaji: 'mo', type: 'Hiragana' },
  { kana: 'や', romaji: 'ya', type: 'Hiragana' }, { kana: 'ゆ', romaji: 'yu', type: 'Hiragana' }, { kana: 'よ', romaji: 'yo', type: 'Hiragana' },
  { kana: 'ら', romaji: 'ra', type: 'Hiragana' }, { kana: 'り', romaji: 'ri', type: 'Hiragana' }, { kana: 'る', romaji: 'ru', type: 'Hiragana' }, { kana: 'れ', romaji: 're', type: 'Hiragana' }, { kana: 'ろ', romaji: 'ro', type: 'Hiragana' },
  { kana: 'わ', romaji: 'wa', type: 'Hiragana' }, { kana: 'を', romaji: 'wo', type: 'Hiragana' }, { kana: 'ん', romaji: 'n', type: 'Hiragana' }
];

const katakanaPool = [
  { kana: 'ア', romaji: 'a', type: 'Katakana' }, { kana: 'イ', romaji: 'i', type: 'Katakana' }, { kana: 'ウ', romaji: 'u', type: 'Katakana' }, { kana: 'エ', romaji: 'e', type: 'Katakana' }, { kana: 'オ', romaji: 'o', type: 'Katakana' },
  { kana: 'カ', romaji: 'ka', type: 'Katakana' }, { kana: 'キ', romaji: 'ki', type: 'Katakana' }, { kana: 'ク', romaji: 'ku', type: 'Katakana' }, { kana: 'ケ', romaji: 'ke', type: 'Katakana' }, { kana: 'コ', romaji: 'ko', type: 'Katakana' },
  { kana: 'サ', romaji: 'sa', type: 'Katakana' }, { kana: 'シ', romaji: 'shi', type: 'Katakana' }, { kana: 'ス', romaji: 'su', type: 'Katakana' }, { kana: 'セ', romaji: 'se', type: 'Katakana' }, { kana: 'ソ', romaji: 'so', type: 'Katakana' },
  { kana: 'タ', romaji: 'ta', type: 'Katakana' }, { kana: 'チ', romaji: 'chi', type: 'Katakana' }, { kana: 'ツ', romaji: 'tsu', type: 'Katakana' }, { kana: 'テ', romaji: 'te', type: 'Katakana' }, { kana: 'ト', romaji: 'to', type: 'Katakana' },
  { kana: 'ナ', romaji: 'na', type: 'Katakana' }, { kana: 'ニ', romaji: 'ni', type: 'Katakana' }, { kana: 'ヌ', romaji: 'nu', type: 'Katakana' }, { kana: 'ネ', romaji: 'ne', type: 'Katakana' }, { kana: 'ノ', romaji: 'no', type: 'Katakana' },
  { kana: 'ハ', romaji: 'ha', type: 'Katakana' }, { kana: 'ヒ', romaji: 'hi', type: 'Katakana' }, { kana: 'フ', romaji: 'fu', type: 'Katakana' }, { kana: 'ヘ', romaji: 'he', type: 'Katakana' }, { kana: 'ホ', romaji: 'ho', type: 'Katakana' },
  { kana: 'マ', romaji: 'ma', type: 'Katakana' }, { kana: 'ミ', romaji: 'mi', type: 'Katakana' }, { kana: 'ム', romaji: 'mu', type: 'Katakana' }, { kana: 'メ', romaji: 'me', type: 'Katakana' }, { kana: 'モ', romaji: 'mo', type: 'Katakana' },
  { kana: 'ヤ', romaji: 'ya', type: 'Katakana' }, { kana: 'ユ', romaji: 'yu', type: 'Katakana' }, { kana: 'ヨ', romaji: 'yo', type: 'Katakana' },
  { kana: 'ラ', romaji: 'ra', type: 'Katakana' }, { kana: 'リ', romaji: 'ri', type: 'Katakana' }, { kana: 'ル', romaji: 'ru', type: 'Katakana' }, { kana: 'レ', romaji: 're', type: 'Katakana' }, { kana: 'ロ', romaji: 'ro', type: 'Katakana' },
  { kana: 'ワ', romaji: 'wa', type: 'Katakana' }, { kana: 'ヲ', romaji: 'wo', type: 'Katakana' }, { kana: 'ン', romaji: 'n', type: 'Katakana' }
];

export default function QuizScreen() {
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>('hiragana');
  const [questionLimit, setQuestionLimit] = useState<number>(5);
  const [questionCount, setQuestionCount] = useState<number>(1);
  
  const [currentQuestion, setCurrentQuestion] = useState<{ kana: string; romaji: string; type: string } | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const bounceAnim = useRef(new Animated.Value(0.8)).current;
  const fireworkAnim = useRef(new Animated.Value(0)).current;

  const currentPool = activeTab === 'hiragana' ? hiraganaPool : katakanaPool;

  const playSound = async (type: 'correct' | 'wrong' | 'complete') => {
    try {
      let soundUri = '';
      if (type === 'correct') {
        soundUri = 'https://www.myinstants.com/media/sounds/correct-answer-gameshow.mp3';
      } else if (type === 'wrong') {
        soundUri = 'https://www.myinstants.com/media/sounds/erro.mp3';
      } else {
        soundUri = 'https://www.myinstants.com/media/sounds/ta-da.mp3';
      }
      const { sound } = await Audio.Sound.createAsync({ uri: soundUri });
      await sound.playAsync();
    } catch (e) {
      // Fallback silently if offline
    }
  };

  const startQuiz = (tab = activeTab, limit = questionLimit) => {
    setActiveTab(tab);
    setQuestionLimit(limit);
    setScore(0);
    setStreak(0);
    setQuestionCount(1);
    setIsFinished(false);
    fireworkAnim.setValue(0);
    generateQuestion(tab === 'hiragana' ? hiraganaPool : katakanaPool);
  };

  const generateQuestion = (pool = currentPool) => {
    setSelectedAnswer(null);
    setIsCorrect(null);

    const randomIndex = Math.floor(Math.random() * pool.length);
    const target = pool[randomIndex];
    setCurrentQuestion(target);

    const wrongOptions = pool
      .filter((q) => q.romaji !== target.romaji)
      .map((q) => q.romaji);
    
    const shuffledWrong = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
    const allOptions = [...shuffledWrong, target.romaji].sort(() => 0.5 - Math.random());

    setOptions(allOptions);
  };

  useEffect(() => {
    startQuiz('hiragana', 5);
  }, []);

  useEffect(() => {
    if (isFinished) {
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }).start();

      Animated.loop(
        Animated.timing(fireworkAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        })
      ).start();
    } else {
      bounceAnim.setValue(0.8);
      fireworkAnim.setValue(0);
    }
  }, [isFinished]);

  const handleAnswerPress = (option: string) => {
    if (selectedAnswer !== null || !currentQuestion) return;

    setSelectedAnswer(option);
    const correct = option === currentQuestion.romaji;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      playSound('correct');
      Speech.stop();
      Speech.speak(currentQuestion.kana, { language: 'ja-JP'});
    } else {
      setStreak(0);
      playSound('wrong');
    }
  };

  const nextQuestion = () => {
    if (questionCount >= questionLimit) {
      setIsFinished(true);
      playSound('complete');
    } else {
      setQuestionCount((prev) => prev + 1);
      generateQuestion(currentPool);
    }
  };

  const particleScale = fireworkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 3.5],
  });

  const particleOpacity = fireworkAnim.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [1, 0.7, 0],
  });

  if (!currentQuestion) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gridOverlay}>
        {[...Array(10)].map((_, i) => <View key={`v-${i}`} style={[styles.gridLineVertical, { left: i * 60 }]} />)}
        {[...Array(25)].map((_, i) => <View key={`h-${i}`} style={[styles.gridLineHorizontal, { top: i * 60 }]} />)}
      </View>

      <Text style={styles.header}>Kana Quiz 🎮</Text>

      {/* Section Switcher Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'hiragana' && styles.tabActive]} 
          onPress={() => startQuiz('hiragana', questionLimit)}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'hiragana' && styles.textActive]}>Hiragana Quiz</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'katakana' && styles.tabActive]} 
          onPress={() => startQuiz('katakana', questionLimit)}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'katakana' && styles.textActive]}>Katakana Quiz</Text>
        </TouchableOpacity>
      </View>

      {/* Question Count Selector */}
      <View style={styles.limitContainer}>
        <Text style={styles.limitLabel}>Questions:</Text>
        {[5, 10, 15, 20].map((num) => (
          <TouchableOpacity 
            key={num} 
            style={[styles.limitButton, questionLimit === num && styles.limitButtonActive]}
            onPress={() => startQuiz(activeTab, num)}
            activeOpacity={0.8}
          >
            <Text style={[styles.limitButtonText, questionLimit === num && styles.limitTextActive]}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!isFinished ? (
          <>
            {/* Scoreboard Bar */}
            <View style={styles.scoreRow}>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreText}>Progress: <Text style={styles.boldText}>{questionCount}/{questionLimit}</Text></Text>
              </View>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreText}>Score: <Text style={styles.boldText}>{score}</Text></Text>
              </View>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreText}>Streak: <Text style={[styles.boldText, { color: '#FF4500' }]}>🔥 {streak}</Text></Text>
              </View>
            </View>

            {/* Question Card */}
            <View style={styles.promptWrapper}>
              <View style={styles.cardShadow} />
              <View style={styles.promptCard}>
                <Text style={styles.promptTitle}>WHAT IS THIS {currentQuestion.type.toUpperCase()}?</Text>
                <Text style={styles.promptTarget}>{currentQuestion.kana}</Text>
              </View>
            </View>

            {/* Options Grid */}
            <View style={styles.optionsContainer}>
              {options.map((option, index) => {
                let btnBg = '#A7B3B7';
                if (selectedAnswer !== null) {
                  if (option === currentQuestion.romaji) {
                    btnBg = '#00C853';
                  } else if (option === selectedAnswer) {
                    btnBg = '#FF5252';
                  }
                }

                return (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.optionWrapper} 
                    activeOpacity={0.8}
                    onPress={() => handleAnswerPress(option)}
                  >
                    <View style={[styles.cardShadow, { top: 4, left: 4 }]} />
                    <View style={[styles.optionButton, { backgroundColor: btnBg }]}>
                      <Text style={styles.optionText}>{option}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Feedback & Next Button */}
            {selectedAnswer !== null && (
              <View style={styles.feedbackContainer}>
                <Text style={[styles.feedbackText, { color: isCorrect ? '#00E676' : '#FF5252' }]}>
                  {isCorrect ? 'Correct! 🎉' : `Incorrect! It was "${currentQuestion.romaji}" ❌`}
                </Text>
                
                <TouchableOpacity style={styles.nextWrapper} activeOpacity={0.8} onPress={nextQuestion}>
                  <View style={[styles.cardShadow, { top: 4, left: 4 }]} />
                  <View style={styles.nextButton}>
                    <Text style={styles.nextButtonText}>{questionCount === questionLimit ? 'See Results ➔' : 'Next Question ➔'}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <View style={styles.summaryContainer}>
            <Animated.View style={[styles.fireworkSpark, { top: '20%', left: '25%', transform: [{ scale: particleScale }], opacity: particleOpacity, backgroundColor: '#FA73FF' }]} />
            <Animated.View style={[styles.fireworkSpark, { top: '25%', right: '25%', transform: [{ scale: particleScale }], opacity: particleOpacity, backgroundColor: '#9DEEE9' }]} />
            <Animated.View style={[styles.fireworkSpark, { bottom: '25%', left: '30%', transform: [{ scale: particleScale }], opacity: particleOpacity, backgroundColor: '#FFD700' }]} />
            <Animated.View style={[styles.fireworkSpark, { bottom: '30%', right: '30%', transform: [{ scale: particleScale }], opacity: particleOpacity, backgroundColor: '#00E676' }]} />

            {[...Array(15)].map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.confettiBit, 
                  { 
                    left: `${(i * 7) % 95}%`, 
                    top: `${(i * 11) % 85}%`, 
                    backgroundColor: ['#FA73FF', '#9DEEE9', '#FFD700', '#FF4500', '#00E676'][i % 5] 
                  }
                ]} 
              />
            ))}

            <Animated.View style={[styles.summaryWrapper, { transform: [{ scale: bounceAnim }] }]}>
              <View style={styles.cardShadow} />
              <View style={styles.summaryCard}>
                <Text style={styles.trophyEmoji}>🏆✨</Text>
                <Text style={styles.summaryTitle}>QUIZ COMPLETED!</Text>
                <Text style={styles.summaryScore}>Result: {score} / {questionLimit}</Text>
                <Text style={styles.summarySubtitle}>
                  {score === questionLimit ? 'Flawless victory! 🌟' : score >= questionLimit / 2 ? 'Great job practicing! 👍' : 'Keep practicing to improve! 💪'}
                </Text>

                <TouchableOpacity style={styles.restartWrapper} activeOpacity={0.8} onPress={() => startQuiz(activeTab, questionLimit)}>
                  <View style={[styles.cardShadow, { top: 4, left: 4 }]} />
                  <View style={styles.restartButton}>
                    <Text style={styles.restartButtonText}>Play Again 🔄</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#520D58', 
    alignItems: 'center', 
    paddingTop: 10,
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
  header: { fontSize: 26, fontWeight: '900', color: '#ffffff', marginBottom: 8 },

  tabContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10, gap: 10, paddingHorizontal: 15 },
  tabButton: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#A7B3B7', borderWidth: 3, borderColor: '#000' },
  tabActive: { backgroundColor: '#FA73FF', shadowColor: '#000', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0 },
  tabText: { color: '#000', fontWeight: '900', fontSize: 12 },
  textActive: { color: '#000' },

  limitContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  limitLabel: { color: '#ffffff', fontWeight: '800', fontSize: 12 },
  limitButton: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#A7B3B7', borderWidth: 2, borderColor: '#000' },
  limitButtonActive: { backgroundColor: '#9DEEE9' },
  limitButtonText: { color: '#000', fontWeight: '900', fontSize: 12 },
  limitTextActive: { color: '#520D58' },

  scrollContent: { alignItems: 'center', paddingBottom: 40, width: '100%' },

  scoreRow: { flexDirection: 'row', width: '90%'},
  // using percentage width for robust layout across devices
  // ... rest of layout uses flexible width values
  scoreBadge: { backgroundColor: '#A7B3B7', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10, borderWidth: 2, borderColor: '#000' },
  scoreText: { color: '#000', fontWeight: '800', fontSize: 11 },
  boldText: { fontWeight: '900', color: '#520D58' },

  promptWrapper: { position: 'relative', width: '90%', maxWidth: 580, marginBottom: 12 },
  cardShadow: { position: 'absolute', top: 6, left: 6, right: -6, bottom: -6, backgroundColor: '#000', borderRadius: 16 },
  promptCard: { backgroundColor: '#ffffff', paddingVertical: 16, borderRadius: 16, borderWidth: 4, borderColor: '#000', alignItems: 'center' },
  promptTitle: { fontSize: 11, color: '#666', fontWeight: '900', letterSpacing: 1 },
  promptTarget: { fontSize: 48, fontWeight: '900', color: '#520D58', marginTop: 2 },

  optionsContainer: { width: '90%', maxWidth: 580, gap: 8, marginBottom: 12 },
  optionWrapper: { position: 'relative', width: '100%' },
  optionButton: { paddingVertical: 10, borderRadius: 12, borderWidth: 3, borderColor: '#000', alignItems: 'center' },
  optionText: { color: '#000', fontWeight: '900', fontSize: 15, textTransform: 'uppercase' },

  feedbackContainer: { width: '90%', maxWidth: 580, alignItems: 'center', gap: 6 },
  feedbackText: { fontSize: 12, fontWeight: '900', backgroundColor: '#000', paddingHorizontal: 14, paddingVertical: 4, borderRadius: 8, overflow: 'hidden' },
  
  nextWrapper: { position: 'relative', width: '100%' },
  nextButton: { backgroundColor: '#9DEEE9', paddingVertical: 10, borderRadius: 12, borderWidth: 3, borderColor: '#000', alignItems: 'center' },
  nextButtonText: { color: '#000', fontWeight: '900', fontSize: 13 },

  summaryContainer: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', paddingBottom: 40, backgroundColor: '#520D58' },
  summaryWrapper: { position: 'relative', width: '90%', maxWidth: 580, zIndex: 3 },
  
  fireworkSpark: { position: 'absolute', width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: '#FFF', zIndex: 1, opacity: 0.8 },
  confettiBit: { position: 'absolute', width: 8, height: 14, borderRadius: 2, zIndex: 2, opacity: 0.9 },

  trophyEmoji: { fontSize: 36, textAlign: 'center', marginBottom: 4 },
  summaryCard: { backgroundColor: '#A7B3B7', padding: 24, borderRadius: 16, borderWidth: 4, borderColor: '#000', alignItems: 'center' },
  summaryTitle: { fontSize: 18, fontWeight: '900', color: '#520D58', marginBottom: 8 },
  summaryScore: { fontSize: 24, fontWeight: '900', color: '#000', marginBottom: 6 },
  summarySubtitle: { fontSize: 13, fontWeight: '800', color: '#222', textAlign: 'center', marginBottom: 20 },
  restartWrapper: { position: 'relative', width: '100%' },
  restartButton: { backgroundColor: '#FA73FF', paddingVertical: 12, borderRadius: '12' as any, borderWidth: 3, borderColor: '#000', alignItems: 'center' },
  restartButtonText: { color: '#000', fontWeight: '900', fontSize: 15 },
});