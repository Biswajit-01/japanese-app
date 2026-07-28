import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, useWindowDimensions, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Svg, Path } from 'react-native-svg';

// ML Imports
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import ViewShot from 'react-native-view-shot';

// Sample Kana Data
const hiraganaData = [
  { kana: 'か', romaji: 'ka', strokes: 3, desc: '' },
  { kana: 'し', romaji: 'shi', strokes: 1, desc: '' },
  { kana: 'ん', romaji: 'n', strokes: 1, desc: '1 Stroke: Continuous upward diagonal curve' },
  { kana: 'あ', romaji: 'a', strokes: 3, desc: '' },
];
const katakanaData = [
  { kana: 'カ', romaji: 'ka', strokes: 2, desc: '' },
  { kana: 'シ', romaji: 'shi', strokes: 3, desc: '' },
  { kana: 'ン', romaji: 'n', strokes: 2, desc: '' },
  { kana: 'ア', romaji: 'a', strokes: 2, desc: '' },
];

export default function DrawScreen() {
  const { width } = useWindowDimensions();
  const canvasSize = Math.min((Platform.OS === 'web' ? 680 : width) - 40, 400);

  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>('hiragana');
  const [currentKana, setCurrentKana] = useState(hiraganaData[0]);
  
  const [paths, setPaths] = useState<{ path: string }[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);
  const [isScrollEnabled, setIsScrollEnabled] = useState<boolean>(true);

  // Machine Learning States
  const viewShotRef = useRef<ViewShot>(null);
  const [isTfReady, setIsTfReady] = useState(false);
  const [model, setModel] = useState<tf.LayersModel | null>(null);

  // Initialize TensorFlow when the screen loads
  useEffect(() => {
    async function initializeTensorFlow() {
      await tf.ready(); // Connect to Expo WebGL backend
      setIsTfReady(true);

      try {
        // UNCOMMENT THIS LATER when you download the K-MNIST model files into your assets folder!
        /*
        const loadedModel = await tf.loadLayersModel(
          bundleResourceIO(require('../../assets/model/model.json'), require('../../assets/model/weights.bin'))
        );
        setModel(loadedModel);
        */
      } catch (e) {
        console.log("Model loading failed:", e);
      }
    }
    initializeTensorFlow();
  }, []);

  useEffect(() => {
    handleNext();
  }, [activeTab]);

  const handleTouchStart = (e: any) => {
    setIsScrollEnabled(false); 
    const { nativeEvent } = e;
    setCurrentPath(`M ${nativeEvent.locationX} ${nativeEvent.locationY}`);
    setFeedback(null);
  };

  const handleTouchMove = (e: any) => {
    const { nativeEvent } = e;
    if (currentPath) {
      setCurrentPath(`${currentPath} L ${nativeEvent.locationX} ${nativeEvent.locationY}`);
    }
  };

  const handleTouchEnd = () => {
    setIsScrollEnabled(true); 
    if (currentPath) {
      setPaths([...paths, { path: currentPath }]);
      setCurrentPath('');
    }
  };

  const handleClear = () => {
    setPaths([]);
    setCurrentPath('');
    setFeedback(null);
  };

  const handleVerify = async () => {
    if (!viewShotRef.current || !viewShotRef.current.capture) return;

    // Optional: First check if stroke count is at least close before running ML
    if (paths.length === 0) {
      setFeedback({ text: 'Please draw something first! 🖌️', color: '#FF5252' });
      return;
    }

    setFeedback({ text: 'AI is looking... 👀', color: '#FFD700' });

    try {
      // 1. Snapshot the canvas
      const uri = await viewShotRef.current.capture();

      // 2. Shrink to 28x28 grayscale
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 28, height: 28 } }],
        { format: ImageManipulator.SaveFormat.JPEG }
      );

      // 3. Convert to TF Tensor
      const imgB64 = await FileSystem.readAsStringAsync(manipulatedImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
      const raw = new Uint8Array(imgBuffer);
      
      const imageTensor = decodeJpeg(raw, 1) // 1 channel = grayscale
        .div(255.0) // Normalize
        .expandDims(0); // Batch dimension

      // 4. Predict
      if (model) {
        const prediction = await model.predict(imageTensor) as tf.Tensor;
        const highestProbIndex = prediction.argMax(1).dataSync()[0];
        
        // Example validation (you will map this to your actual Kana labels later)
        setFeedback({ text: `Great shape! (AI Active) 🎉`, color: '#00C853' });
        
        tf.dispose([imageTensor, prediction]); // Prevent memory leaks
      } else {
        // Fallback testing message
        setFeedback({ text: `Image snapped! (TF Ready: ${isTfReady ? 'Yes' : 'No'}) 📸`, color: '#9DEEE9' });
      }

    } catch (error) {
      console.error(error);
      setFeedback({ text: 'Error analyzing image.', color: '#FF5252' });
    }
  };

  const handleNext = () => {
    const pool = activeTab === 'hiragana' ? hiraganaData : katakanaData;
    const randomKana = pool[Math.floor(Math.random() * pool.length)];
    setCurrentKana(randomKana);
    handleClear();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gridOverlay}>
        {[...Array(10)].map((_, i) => <View key={`v-${i}`} style={[styles.gridLineVertical, { left: i * 60 }]} />)}
        {[...Array(30)].map((_, i) => <View key={`h-${i}`} style={[styles.gridLineHorizontal, { top: i * 60 }]} />)}
      </View>

      <Text style={styles.headerTitle}>Trace Pad ✍️</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'hiragana' && styles.tabActive]} 
          onPress={() => setActiveTab('hiragana')}
          activeOpacity={0.8}
        >
          <Text style={styles.tabText}>Hiragana</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'katakana' && styles.tabActive]} 
          onPress={() => setActiveTab('katakana')}
          activeOpacity={0.8}
        >
          <Text style={styles.tabText}>Katakana</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        scrollEnabled={isScrollEnabled}
      >
        
        <View style={[styles.infoCardWrapper, { width: canvasSize }]}>
          <View style={styles.cardShadow} />
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              {currentKana.desc ? 'PRACTICE:' : 'TRACE:'} <Text style={styles.infoKana}>{currentKana.kana}</Text> ({currentKana.romaji})
            </Text>
            {currentKana.desc ? <Text style={styles.infoDesc}>{currentKana.desc}</Text> : null}
            
            <View style={styles.statsRow}>
              <Text style={styles.statText}>Target Strokes: <Text style={styles.statBold}>{currentKana.strokes}</Text></Text>
              <Text style={styles.statText}>
                Strokes Drawn: <Text style={[styles.statBold, paths.length === currentKana.strokes && { color: '#00C853' }]}>{paths.length}</Text>
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.canvasWrapper, { width: canvasSize, height: canvasSize }]}>
          <View style={styles.cardShadow} />
          
          {/* ViewShot Camera Wrap */}
          <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 1.0 }} style={{ width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden' }}>
            <View 
              style={[
                styles.canvasBox, 
                { width: '100%', height: '100%' }, 
                Platform.OS === 'web' && ({ touchAction: 'none' } as any)
              ]}
              onStartShouldSetResponder={() => true}
              onMoveShouldSetResponder={() => true}
              onResponderGrant={handleTouchStart}
              onResponderMove={handleTouchMove}
              onResponderRelease={handleTouchEnd}
              onResponderTerminate={handleTouchEnd}
            >
              <View style={styles.ghostContainer}>
                 <Text style={styles.ghostText}>{currentKana.kana}</Text>
              </View>

              <Svg height="100%" width="100%" style={styles.svgLayer}>
                {paths.map((p, idx) => (
                  <Path
                    key={idx}
                    d={p.path}
                    stroke="#E056FD"
                    strokeWidth={20}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                ))}
                {currentPath ? (
                  <Path
                    d={currentPath}
                    stroke="#E056FD"
                    strokeWidth={20}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                ) : null}
              </Svg>
            </View>
          </ViewShot>
        </View>

        <View style={[styles.noteWrapper, { width: canvasSize }]}>
          <Text style={styles.noteText}>
            💡 Note: Please compare your stroke order and shape manually with the guide.
          </Text>
        </View>

        {feedback && (
          <View style={styles.feedbackBanner}>
            <Text style={[styles.feedbackText, { color: feedback.color }]}>{feedback.text}</Text>
          </View>
        )}

        <View style={[styles.actionRow, { width: canvasSize }]}>
          <TouchableOpacity style={styles.actionBtnWrapper} activeOpacity={0.8} onPress={handleClear}>
            <View style={[styles.cardShadow, { top: 4, left: 4 }]} />
            <View style={[styles.actionBtn, { backgroundColor: '#A7B3B7' }]}>
              <Text style={styles.actionBtnText}>Clear</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtnWrapper} activeOpacity={0.8} onPress={handleVerify}>
            <View style={[styles.cardShadow, { top: 4, left: 4 }]} />
            <View style={[styles.actionBtn, { backgroundColor: '#9DEEE9' }]}>
              <Text style={styles.actionBtnText}>Verify</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtnWrapper} activeOpacity={0.8} onPress={handleNext}>
            <View style={[styles.cardShadow, { top: 4, left: 4 }]} />
            <View style={[styles.actionBtn, { backgroundColor: '#FA73FF' }]}>
              <Text style={styles.actionBtnText}>Next</Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#4A154B',
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

  headerTitle: { fontSize: 28, fontWeight: '900', color: '#ffffff', marginBottom: 15, marginTop: 10 },

  tabContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  tabButton: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 12, backgroundColor: '#A7B3B7', borderWidth: 3, borderColor: '#000' },
  tabActive: { backgroundColor: '#FA73FF' },
  tabText: { color: '#000', fontWeight: '900', fontSize: 14 },

  scrollView: { flex: 1, width: '100%' },
  scrollContent: { alignItems: 'center', paddingBottom: 120, width: '100%' },

  infoCardWrapper: { position: 'relative', marginBottom: 20 },
  cardShadow: { position: 'absolute', top: 6, left: 6, right: -6, bottom: -6, backgroundColor: '#000', borderRadius: 16 },
  infoCard: { backgroundColor: '#A7B3B7', padding: 15, borderRadius: 16, borderWidth: 4, borderColor: '#000', alignItems: 'center' },
  infoTitle: { fontSize: 14, fontWeight: '900', color: '#000', textTransform: 'uppercase' },
  infoKana: { fontSize: 16 },
  infoDesc: { fontSize: 12, fontWeight: '800', color: '#333', marginTop: 4 },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 12, paddingHorizontal: 10 },
  statText: { fontSize: 12, fontWeight: '800', color: '#333' },
  statBold: { fontSize: 14, fontWeight: '900', color: '#000' },

  canvasWrapper: { position: 'relative', marginBottom: 20 },
  canvasBox: { backgroundColor: '#ffffff', borderWidth: 4, borderColor: '#000' },
  
  ghostContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
  ghostText: { fontSize: 250, color: '#EAEAEA', fontWeight: 'bold' },
  svgLayer: { position: 'absolute', top: 0, left: 0 },

  noteWrapper: { backgroundColor: '#FFD700', padding: 12, borderRadius: 12, borderWidth: 3, borderColor: '#000', marginBottom: 15 },
  noteText: { color: '#000', fontWeight: '800', fontSize: 12, textAlign: 'center' },

  feedbackBanner: { backgroundColor: '#000', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, marginBottom: 20 },
  feedbackText: { fontWeight: '900', fontSize: 14 },

  actionRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  actionBtnWrapper: { position: 'relative', flex: 1 },
  actionBtn: { paddingVertical: 14, borderRadius: 12, borderWidth: 4, borderColor: '#000', alignItems: 'center' },
  actionBtnText: { color: '#000', fontWeight: '900', fontSize: 16 }
});