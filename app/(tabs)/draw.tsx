import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Path, Svg } from 'react-native-svg';

const { width } = Dimensions.get('window');
const canvasSize = Math.min((Platform.OS === 'web' ? 680 : width) - 40, 400);

export default function DrawScreen() {
  const router = useRouter();
  const [paths, setPaths] = useState<{ path: string; color: string; strokeWidth: number }[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [currentColor, setCurrentColor] = useState<string>('#000000');
  const [currentWidth, setCurrentWidth] = useState<number>(8);

  const colors = ['#000000', '#FF5252', '#00C853', '#29B6F6', '#FA73FF', '#FFD700'];

  // Handle drawing touch events
  const handleTouchStart = (e: any) => {
    const { nativeEvent } = e;
    const locX = nativeEvent.locationX;
    const locY = nativeEvent.locationY;
    setCurrentPath(`M ${locX} ${locY}`);
  };

  const handleTouchMove = (e: any) => {
    const { nativeEvent } = e;
    const locX = nativeEvent.locationX;
    const locY = nativeEvent.locationY;
    if (currentPath) {
      setCurrentPath(`${currentPath} L ${locX} ${locY}`);
    }
  };

  const handleTouchEnd = () => {
    if (currentPath) {
      setPaths([...paths, { path: currentPath, color: currentColor, strokeWidth: currentWidth }]);
      setCurrentPath('');
    }
  };

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Grid */}
      <View style={styles.gridOverlay}>
        {[...Array(10)].map((_, i) => <View key={`v-${i}`} style={[styles.gridLineVertical, { left: i * 60 }]} />)}
        {[...Array(30)].map((_, i) => <View key={`h-${i}`} style={[styles.gridLineHorizontal, { top: i * 60 }]} />)}
      </View>

      {/* Top Header */}
      <View style={styles.headerRow}>
        <PressableWithBack router={router} />
        <Text style={styles.headerTitle}>Trace & Draw ✍️</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
        
        {/* Ghost Reference Guide Card */}
        <View style={styles.ghostCardWrapper}>
          <View style={styles.cardShadow} />
          <View style={styles.ghostCard}>
            <Text style={styles.ghostLabel}>PRACTICE CHARACTER:</Text>
            <Text style={styles.ghostCharacter}>あ</Text>
            <Text style={styles.ghostSub}>Trace over the grid below</Text>
          </View>
        </View>

        {/* Drawing Canvas Board */}
        <View style={styles.canvasWrapper}>
          <View style={styles.cardShadow} />
          <View 
            style={[styles.canvasBox, Platform.OS === 'web' && ({ touchAction: 'none' } as any)]}
            onStartShouldSetResponder={() => true}
            onResponderGrant={handleTouchStart}
            onResponderMove={handleTouchMove}
            onResponderRelease={handleTouchEnd}
          >
            <Svg height={canvasSize} width={canvasSize} style={styles.svgCanvas}>
              {/* Ghost guide background stroke */}
              <Path
                d="M 100 80 Q 200 20 300 120 T 200 320"
                stroke="rgba(0,0,0,0.08)"
                strokeWidth="24"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              {/* User drawn paths */}
              {paths.map((p, idx) => (
                <Path
                  key={idx}
                  d={p.path}
                  stroke={p.color}
                  strokeWidth={p.strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ))}
              {/* Active drawing path */}
              {currentPath ? (
                <Path
                  d={currentPath}
                  stroke={currentColor}
                  strokeWidth={currentWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ) : null}
            </Svg>
          </View>
        </View>

        {/* Color Palette & Controls */}
        <View style={styles.controlsContainer}>
          <View style={styles.paletteRow}>
            {colors.map((col) => (
              <TouchableOpacity
                key={col}
                style={[styles.colorBubble, { backgroundColor: col }, currentColor === col && styles.selectedColor]}
                onPress={() => setCurrentColor(col)}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.clearWrapper} activeOpacity={0.8} onPress={clearCanvas}>
            <View style={[styles.cardShadow, { top: 4, left: 4 }]} />
            <View style={styles.clearButton}>
              <Ionicons name="trash-outline" size={18} color="#000" />
              <Text style={styles.clearButtonText}>Clear Canvas</Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function PressableWithBack({ router }: { router: any }) {
  return (
    <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.8}>
      <View style={[styles.cardShadow, { top: 3, left: 3 }]} />
      <View style={styles.backBtnMain}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </View>
    </TouchableOpacity>
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
  
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, marginBottom: 15 },
  backButton: { position: 'relative', width: 44, height: 44 },
  backBtnMain: { width: 44, height: 44, backgroundColor: '#A7B3B7', borderRadius: 12, borderWidth: 3, borderColor: '#000', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#ffffff' },

  scrollContent: { alignItems: 'center', paddingBottom: 40, width: '100%' },

  ghostCardWrapper: { position: 'relative', width: canvasSize, marginBottom: 15 },
  cardShadow: { position: 'absolute', top: 6, left: 6, right: -6, bottom: -6, backgroundColor: '#000', borderRadius: 16 },
  ghostCard: { backgroundColor: '#9DEEE9', padding: 12, borderRadius: 16, borderWidth: 4, borderColor: '#000', alignItems: 'center' },
  ghostLabel: { fontSize: 10, fontWeight: '900', color: '#000', letterSpacing: 1 },
  ghostCharacter: { fontSize: 42, fontWeight: '900', color: '#520D58', marginVertical: 2 },
  ghostSub: { fontSize: 11, fontWeight: '800', color: 'rgba(0,0,0,0.7)' },

  canvasWrapper: { position: 'relative', width: canvasSize, marginBottom: 20 },
  canvasBox: { backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 4, borderColor: '#000', overflow: 'hidden', width: canvasSize, height: canvasSize },
  svgCanvas: { backgroundColor: '#fff' },

  controlsContainer: { width: canvasSize, alignItems: 'center', gap: 15 },
  paletteRow: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  colorBubble: { width: 32, height: 32, borderRadius: 16, borderWidth: 3, borderColor: '#000' },
  selectedColor: { borderWidth: 4, borderColor: '#FFF', transform: [{ scale: 1.15 }] },

  clearWrapper: { position: 'relative', width: '100%' },
  clearButton: { backgroundColor: '#FF5252', flexDirection: 'row', paddingVertical: 12, borderRadius: 12, borderWidth: 3, borderColor: '#000', justifyContent: 'center', alignItems: 'center', gap: 8 },
  clearButtonText: { color: '#000', fontWeight: '900', fontSize: 14 }
});