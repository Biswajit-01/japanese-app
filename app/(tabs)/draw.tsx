import { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, PanResponder } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import * as Speech from 'expo-speech';

const { width } = Dimensions.get('window');
const canvasSize = width - 40;

export default function DrawScreen() {
  const [selectedSection, setSelectedSection] = useState<'hiragana' | 'katakana'>('hiragana');
  const [paths, setPaths] = useState<string[]>([]);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  
  const pathsRef = useRef<string[]>([]);
  const currentPathRef = useRef<string>('');
  const pathElementRef = useRef<any>(null);

  const hiraganaCharacters = [
    { kana: 'あ', romaji: 'a', strokes: ['1. Short horizontal line upward', '2. Straight vertical line crossing down', '3. Large sweeping loop at bottom right'] },
    { kana: 'い', romaji: 'i', strokes: ['1. Left curve down and up', '2. Right vertical hook line'] },
    { kana: 'う', romaji: 'u', strokes: ['1. Top small diagonal dot', '2. Bottom curved hook body'] },
    { kana: 'え', romaji: 'e', strokes: ['1. Top horizontal line', '2. Bottom angle turning into a loop'] },
    { kana: 'お', romaji: 'o', strokes: ['1. Top horizontal bar', '2. Middle vertical drop and loop', '3. Right tick mark'] },
    { kana: 'か', romaji: 'ka', strokes: ['1. Main horizontal-to-vertical bar', '2. Crossing diagonal slash', '3. Right hook'] },
    { kana: 'き', romaji: 'ki', strokes: ['1. Top horizontal line', '2. Second parallel line', '3. Vertical line cutting into a loop'] },
    { kana: 'く', romaji: 'ku', strokes: ['1. Single sharp angular stroke pointing right'] },
    { kana: 'け', romaji: 'ke', strokes: ['1. Vertical line', '2. Horizontal cross bar', '3. Right loop stroke'] },
    { kana: 'こ', romaji: 'ko', strokes: ['1. Top curved horizontal line', '2. Bottom curved horizontal line'] },
    { kana: 'さ', romaji: 'sa', strokes: ['1. Top horizontal line', '2. Vertical down with a right loop'] },
    { kana: 'し', romaji: 'shi', strokes: ['1. Single vertical hook curving up to the right'] },
    { kana: 'す', romaji: 'su', strokes: ['1. Top horizontal line', '2. Vertical line with bottom loop'] },
    { kana: 'せ', romaji: 'se', strokes: ['1. Horizontal line', '2. Vertical line curving right and bottom loop'] },
    { kana: 'そ', romaji: 'so', strokes: ['1. Single continuous zigzag stroke (Z and c shape)'] },
    { kana: 'た', romaji: 'ta', strokes: ['1. Horizontal line', '2. Vertical line', '3. Small right hook and loop'] },
    { kana: 'ち', romaji: 'chi', strokes: ['1. Horizontal top line', '2. Vertical down with a large lower loop'] },
    { kana: 'つ', romaji: 'tsu', strokes: ['1. Single curving scoop stroke'] },
    { kana: 'て', romaji: 'te', strokes: ['1. Top horizontal line curving down into a hook'] },
    { kana: 'と', romaji: 'to', strokes: ['1. Diagonal line down', '2. Curved intersecting loop'] },
    { kana: 'な', romaji: 'na', strokes: ['1. Horizontal line', '2. Vertical cross', '3. Right loop and small dash'] },
    { kana: 'に', romaji: 'ni', strokes: ['1. Left vertical line', '2. Right parallel double-curve lines'] },
    { kana: 'ぬ', romaji: 'nu', strokes: ['1. Diagonal line down', '2. Large looping tail at the bottom'] },
    { kana: 'ね', romaji: 'ne', strokes: ['1. Vertical line', '2. Right loop and bottom swirl'] },
    { kana: 'の', romaji: 'no', strokes: ['1. Single continuous oval loop'] },
    { kana: 'は', romaji: 'ha', strokes: ['1. Vertical line', '2. Separate right loop and vertical curve'] },
    { kana: 'ひ', romaji: 'hi', strokes: ['1. Single continuous curved arch stroke'] },
    { kana: 'ふ', romaji: 'fu', strokes: ['1. Top dot', '2. Left curve dot', '3. Center bridge and bottom hook'] },
    { kana: 'へ', romaji: 'he', strokes: ['1. Single sharp V-shaped peak stroke'] },
    { kana: 'ほ', romaji: 'ho', strokes: ['1. Top vertical line', '2. Horizontal cross bar', '3. Right loop and hook'] },
    { kana: 'ま', romaji: 'ma', strokes: ['1. Top horizontal line', '2. Second horizontal line', '3. Vertical loop line'] },
    { kana: 'み', romaji: 'mi', strokes: ['1. Top curved vertical stroke with loop'] },
    { kana: 'む', romaji: 'mu', strokes: ['1. Diagonal top line', '2. Loop and tail at the bottom'] },
    { kana: 'め', romaji: 'me', strokes: ['1. Diagonal line down', '2. Intersecting loop stroke'] },
    { kana: 'も', romaji: 'mo', strokes: ['1. Top horizontal line', '2. Sweeping downward hook loop'] },
    { kana: 'や', romaji: 'ya', strokes: ['1. Left vertical hook', '2. Right sweeping curve line'] },
    { kana: 'ゆ', romaji: 'yu', strokes: ['1. Vertical curving line with top loop'] },
    { kana: 'よ', romaji: 'yo', strokes: ['1. Vertical line with right horizontal extension and loop'] },
    { kana: 'ら', romaji: 'ra', strokes: ['1. Short top stroke', '2. Bottom sweeping hook curve'] },
    { kana: 'り', romaji: 'ri', strokes: ['1. Left short vertical', '2. Right long vertical hook'] },
    { kana: 'る', romaji: 'ru', strokes: ['1. Single continuous line ending in a loop'] },
    { kana: 'れ', romaji: 're', strokes: ['1. Vertical line', '2. Right side curved loop'] },
    { kana: 'ろ', romaji: 'ro', strokes: ['1. Single continuous zigzag loop ending'] },
    { kana: 'わ', romaji: 'wa', strokes: ['1. Vertical line down', '2. Bottom loop wrapping around'] },
    { kana: 'を', romaji: 'wo', strokes: ['1. Top horizontal line', '2. Diagonal stroke', '3. Bottom curved loop'] },
    { kana: 'ん', romaji: 'n', strokes: ['1. Single upward sweeping diagonal curve'] }
  ];

  const katakanaCharacters = [
    { kana: 'ア', romaji: 'a', strokes: ['1. Top horizontal-to-diagonal stroke', '2. Vertical sliding line down'] },
    { kana: 'イ', romaji: 'i', strokes: ['1. Top diagonal stroke', '2. Main vertical pillar line'] },
    { kana: 'ウ', romaji: 'u', strokes: ['1. Top short vertical dash', '2. Lower curved hook body'] },
    { kana: 'エ', romaji: 'e', strokes: ['1. Top short horizontal bar', '2. Vertical pillar', '3. Bottom long base line'] },
    { kana: 'オ', romaji: 'o', strokes: ['1. Top horizontal line', '2. Vertical drop', '3. Bottom-left sweeping diagonal'] },
    { kana: 'カ', romaji: 'ka', strokes: ['1. Horizontal top turning down into a corner', '2. Left diagonal slash'] },
    { kana: 'キ', romaji: 'ki', strokes: ['1. Two parallel top horizontal lines', '2. Intersecting diagonal leg'] },
    { kana: 'ク', romaji: 'ku', strokes: ['1. Top left-to-right stroke', '2. Bottom-left falling leg'] },
    { kana: 'ケ', romaji: 'ke', strokes: ['1. Top short horizontal', '2. Left diagonal leg', '3. Right diagonal leg'] },
    { kana: 'コ', romaji: 'ko', strokes: ['1. Top horizontal turning down', '2. Bottom base line'] },
    { kana: 'サ', romaji: 'sa', strokes: ['1. Top short horizontal', '2. Second horizontal line', '3. Long vertical drop with hook'] },
    { kana: 'シ', romaji: 'shi', strokes: ['1. Two small top dots', '2. Bottom sweeping curved stroke up'] },
    { kana: 'ス', romaji: 'su', strokes: ['1. Top horizontal stroke', '2. Intersecting diagonal slash down'] },
    { kana: 'セ', romaji: 'se', strokes: ['1. Top horizontal bar', '2. Long vertical line with bottom hook'] },
    { kana: 'ソ', romaji: 'so', strokes: ['1. Top left dot slash', '2. Right sweeping curve'] },
    { kana: 'タ', romaji: 'ta', strokes: ['1. Top horizontal line', '2. Diagonal down stroke'] },
    { kana: 'チ', romaji: 'chi', strokes: ['1. Top horizontal line', '2. Vertical line curving left', '3. Short right dash'] },
    { kana: 'ツ', romaji: 'tsu', strokes: ['1. Two short top dashes', '2. Main sweeping curve stroke'] },
    { kana: 'テ', romaji: 'te', strokes: ['1. Top short horizontal line', '2. Second longer horizontal line', '3. Central vertical pillar'] },
    { kana: 'ト', romaji: 'to', strokes: ['1. Vertical main pillar', '2. Right horizontal branch'] },
    { kana: 'ナ', romaji: 'na', strokes: ['1. Top horizontal line', '2. Diagonal stroke down'] },
    { kana: 'ニ', romaji: 'ni', strokes: ['1. Top short horizontal line', '2. Bottom longer horizontal line'] },
    { kana: 'ヌ', romaji: 'nu', strokes: ['1. Diagonal cross stroke', '2. Bottom right sweeping hook'] },
    { kana: 'ネ', romaji: 'ne', strokes: ['1. Top small vertical dot', '2. Cross bar lines', '3. Right falling leg'] },
    { kana: 'ノ', romaji: 'no', strokes: ['1. Single diagonal sweeping slash'] },
    { kana: 'ハ', romaji: 'ha', strokes: ['1. Left diagonal stroke', '2. Right diagonal stroke'] },
    { kana: 'ヒ', romaji: 'hi', strokes: ['1. Top horizontal line', '2. Vertical hook curving down'] },
    { kana: 'フ', romaji: 'fu', strokes: ['1. Single sweeping hook line from top left to bottom right'] },
    { kana: 'ヘ', romaji: 'he', strokes: ['1. Single sharp V-shaped peak stroke'] },
    { kana: 'ホ', romaji: 'ho', strokes: ['1. Top short vertical dot', '2. Horizontal cross bar', '3. Left and right legs'] },
    { kana: 'マ', romaji: 'ma', strokes: ['1. Top horizontal line turning down', '2. Bottom diagonal dash'] },
    { kana: 'ミ', romaji: 'mi', strokes: ['1. Three parallel diagonal slash strokes'] },
    { kana: 'ム', romaji: 'mu', strokes: ['1. Top diagonal cap', '2. Bottom looping V-shape'] },
    { kana: 'メ', romaji: 'me', strokes: ['1. Diagonal crossing slash lines'] },
    { kana: 'モ', romaji: 'mo', strokes: ['1. Two parallel top horizontal bars', '2. Long vertical line through them'] },
    { kana: 'ヤ', romaji: 'ya', strokes: ['1. Top horizontal hook', '2. Right falling diagonal leg'] },
    { kana: 'ユ', romaji: 'yu', strokes: ['1. Top horizontal line turning down into a U-shape'] },
    { kana: 'ヨ', romaji: 'yo', strokes: ['1. Top horizontal turning down', '2. Middle short horizontal', '3. Bottom base line'] },
    { kana: 'ら', romaji: 'ra', strokes: ['1. Top horizontal line', '2. Bottom curving tail hook'] },
    { kana: 'リ', romaji: 'ri', strokes: ['1. Left short vertical line', '2. Right long vertical pillar hook'] },
    { kana: 'ル', romaji: 'ru', strokes: ['1. Diagonal falling line', '2. Right sweeping curve leg'] },
    { kana: 'レ', romaji: 're', strokes: ['1. Single sweeping checkmark hook stroke'] },
    { kana: 'ロ', romaji: 'ro', strokes: ['1. Outer square box stroke'] },
    { kana: 'ワ', romaji: 'wa', strokes: ['1. Short top vertical tick', '2. Horizontal bar turning down'] },
    { kana: 'ヲ', romaji: 'wo', strokes: ['1. Top horizontal line', '2. Diagonal cross slash', '3. Bottom right hook'] },
    { kana: 'ン', romaji: 'n', strokes: ['1. Left diagonal stroke', '2. Right vertical stroke up'] }
  ];

  const currentList = selectedSection === 'hiragana' ? hiraganaCharacters : katakanaCharacters;
  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * hiraganaCharacters.length));

  const targetChar = currentList[currentIndex];
  const [feedback, setFeedback] = useState<string | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPathRef.current = `M ${locationX} ${locationY}`;
        if (pathElementRef.current) {
          pathElementRef.current.setNativeProps({ d: currentPathRef.current });
        }
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPathRef.current += ` L ${locationX} ${locationY}`;
        if (pathElementRef.current) {
          pathElementRef.current.setNativeProps({ d: currentPathRef.current });
        }
      },
      onPanResponderRelease: () => {
        if (currentPathRef.current) {
          pathsRef.current = [...pathsRef.current, currentPathRef.current];
          setPaths([...pathsRef.current]);
          currentPathRef.current = '';
          if (pathElementRef.current) {
            pathElementRef.current.setNativeProps({ d: '' });
          }
        }
      },
    })
  ).current;

  const clearCanvas = () => { 
    pathsRef.current = [];
    setPaths([]); 
    currentPathRef.current = '';
    setShowAnswer(false);
    if (pathElementRef.current) {
      pathElementRef.current.setNativeProps({ d: '' });
    }
    setFeedback(null); 
  };
  
  const switchSection = (section: 'hiragana' | 'katakana') => {
    setSelectedSection(section);
    const list = section === 'hiragana' ? hiraganaCharacters : katakanaCharacters;
    const randomIndex = Math.floor(Math.random() * list.length);
    setCurrentIndex(randomIndex);
    clearCanvas();
  };

  const revealAndCheck = () => {
    setShowAnswer(true);
    setFeedback(`Check the step-by-step stroke guide below! 🎯`);
    Speech.stop(); 
    Speech.speak(targetChar.kana, { language: 'ja-JP', rate: 0.3 });
  };

  const nextCharacter = () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * currentList.length);
    } while (nextIndex === currentIndex && currentList.length > 1);

    setCurrentIndex(nextIndex);
    clearCanvas();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Trace Pad ✍️</Text>
      
      {/* Section Switcher Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, selectedSection === 'hiragana' && styles.tabActive]} 
          onPress={() => switchSection('hiragana')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, selectedSection === 'hiragana' && styles.textActive]}>Hiragana</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, selectedSection === 'katakana' && styles.tabActive]} 
          onPress={() => switchSection('katakana')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, selectedSection === 'katakana' && styles.textActive]}>Katakana</Text>
        </TouchableOpacity>
      </View>

      {/* Prompt Card / Stroke Guide Display */}
      <View style={styles.promptWrapper}>
        <View style={styles.cardShadow} />
        <View style={styles.promptCard}>
          <Text style={styles.promptTitle}>PRACTICE: {targetChar.kana} ({targetChar.romaji})</Text>
          {showAnswer ? (
            <View style={styles.guideContainer}>
              <Text style={styles.guideHeader}>CORRECT STROKE ORDER:</Text>
              {targetChar.strokes.map((step, idx) => (
                <Text key={idx} style={styles.strokeStepText}>{step}</Text>
              ))}
            </View>
          ) : (
            <Text style={styles.promptSubtitle}>Trace on canvas, then tap "Reveal Guide"</Text>
          )}
        </View>
      </View>

      {/* Tracing Canvas */}
      <View style={styles.canvasWrapper} {...panResponder.panHandlers}>
        <View style={styles.cardShadow} />
        <View style={styles.canvasContainer}>
          <Svg style={styles.svg}>
            <SvgText x={canvasSize / 2} y={canvasSize / 1.3} fontSize={canvasSize * 0.75} fontWeight="bold" fill="rgba(0, 0, 0, 0.08)" textAnchor="middle">
              {targetChar.kana}
            </SvgText>
            {paths.map((path, index) => (
              <Path key={index} d={path} stroke="#FA73FF" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            ))}
            <Path ref={pathElementRef} d="" stroke="#FA73FF" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>
      </View>

      {feedback && <Text style={styles.feedback}>{feedback}</Text>}

      {/* Manual Checking Note Section */}
      <View style={styles.noteWrapper}>
        <Text style={styles.noteText}>
          <Text style={styles.noteBold}>Note:</Text> This section uses manual checking. Please use the correct stroke order and be honest with yourself for the best learning experience! 💡
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.btnWrapper} activeOpacity={0.8} onPress={clearCanvas}>
          <View style={[styles.cardShadow, { top: 4, left: 4 }]} />
          <View style={[styles.button, { backgroundColor: '#A7B3B7' }]}><Text style={styles.buttonText}>Clear</Text></View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.btnWrapper} activeOpacity={0.8} onPress={revealAndCheck}>
          <View style={[styles.cardShadow, { top: 4, left: 4 }]} />
          <View style={[styles.button, { backgroundColor: '#9DEEE9' }]}><Text style={styles.buttonText}>Reveal Guide</Text></View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnWrapper} activeOpacity={0.8} onPress={nextCharacter}>
          <View style={[styles.cardShadow, { top: 4, left: 4 }]} />
          <View style={[styles.button, { backgroundColor: '#FA73FF' }]}><Text style={styles.buttonText}>Next</Text></View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#520D58', alignItems: 'center', paddingTop: 10 },
  header: { fontSize: 26, fontWeight: '900', color: '#ffffff', marginBottom: 8 },
  
  tabContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10, gap: 10, paddingHorizontal: 15 },
  tabButton: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#A7B3B7', borderWidth: 3, borderColor: '#000' },
  tabActive: { backgroundColor: '#FA73FF', shadowColor: '#000', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0 },
  tabText: { color: '#000', fontWeight: '900', fontSize: 12 },
  textActive: { color: '#000' },

  promptWrapper: { position: 'relative', width: canvasSize, marginBottom: 10 },
  cardShadow: { position: 'absolute', top: 6, left: 6, right: -6, bottom: -6, backgroundColor: '#000', borderRadius: 16 },
  promptCard: { backgroundColor: '#A7B3B7', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 16, borderWidth: 3, borderColor: '#000', alignItems: 'center' },
  promptTitle: { fontSize: 12, color: '#000', fontWeight: '900', letterSpacing: 0.5, marginBottom: 2 },
  promptSubtitle: { fontSize: 10, fontWeight: '800', color: '#333' },
  
  guideContainer: { width: '100%', marginTop: 2, alignItems: 'flex-start', paddingHorizontal: 5 },
  guideHeader: { fontSize: 10, fontWeight: '900', color: '#520D58', marginBottom: 1 },
  strokeStepText: { fontSize: 10, fontWeight: '800', color: '#111', lineHeight: 14 },
  
  canvasWrapper: { position: 'relative', width: canvasSize, height: canvasSize, marginBottom: 10 },
  canvasContainer: { width: '100%', height: '100%', backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 4, borderColor: '#000', overflow: 'hidden' },
  svg: { flex: 1 },
  
  feedback: { fontSize: 12, fontWeight: '900', color: '#9DEEE9', marginBottom: 8, textAlign: 'center', backgroundColor: '#000', paddingHorizontal: 14, paddingVertical: 4, borderRadius: 12, overflow: 'hidden' },

  noteWrapper: { width: canvasSize, paddingHorizontal: 4, marginBottom: 10 },
  noteText: { fontSize: 11, color: '#A7B3B7', textAlign: 'center', lineHeight: 15, fontWeight: '700' },
  noteBold: { color: '#9DEEE9', fontWeight: '900' },
  
  buttonRow: { flexDirection: 'row', gap: 12, width: canvasSize, justifyContent: 'space-between' },
  btnWrapper: { flex: 1, position: 'relative' },
  button: { paddingVertical: 10, borderRadius: 12, borderWidth: 3, borderColor: '#000', alignItems: 'center' },
  buttonText: { color: '#000', fontWeight: '900', fontSize: 13 },
});