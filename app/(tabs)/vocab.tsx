// import { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, FlatList, SafeAreaView, TouchableOpacity, TextInput, ScrollView } from 'react-native';
// import * as SQLite from 'expo-sqlite';
// import * as Speech from 'expo-speech';
// import { Ionicons } from '@expo/vector-icons';
// import { useLocalSearchParams } from 'expo-router';

// import vocabData from '../../assets/vocab.json';

// export default function VocabScreen() {
//   const params = useLocalSearchParams();
//   const [words, setWords] = useState<any[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
  
//   const [selectedLevel, setSelectedLevel] = useState(params.filterLevel ? (params.filterLevel as string) : 'ALL');

//   useEffect(() => {
//     if (params.filterLevel) {
//       setSelectedLevel(params.filterLevel as string);
//     }
//   }, [params.filterLevel]);

//   useEffect(() => {
//     async function loadDatabase() {
//       const db = await SQLite.openDatabaseAsync('japanese.db');
      
//       await db.execAsync(`DROP TABLE IF EXISTS vocab;`);
      
//       await db.execAsync(`
//         CREATE TABLE vocab (
//           id INTEGER PRIMARY KEY AUTOINCREMENT, 
//           kanji TEXT, 
//           furigana TEXT, 
//           romaji TEXT, 
//           meaning TEXT, 
//           level TEXT
//         );
//       `);
      
//       for (const word of vocabData) {
//         await db.runAsync(
//           'INSERT INTO vocab (kanji, furigana, romaji, meaning, level) VALUES (?, ?, ?, ?, ?)',
//           word.kanji, word.furigana, word.romaji, word.meaning, word.level
//         );
//       }
      
//       setWords(await db.getAllAsync('SELECT * FROM vocab'));
//     }
//     loadDatabase();
//   }, []);

//   const filteredWords = words.filter((item) => {
//     const query = searchQuery.toLowerCase().trim();
//     return (
//       String(item.kanji).toLowerCase().includes(query) || 
//       String(item.furigana).toLowerCase().includes(query) || 
//       String(item.romaji).toLowerCase().includes(query) || 
//       String(item.meaning).toLowerCase().includes(query)
//     ) && (selectedLevel === 'ALL' || item.level === selectedLevel);
//   });

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.header}>JLPT Reference Table 📖</Text>
      
//       <View style={styles.searchWrapper}>
//         <View style={styles.searchShadow} />
//         <View style={styles.searchContainer}>
//           <Ionicons name="search" size={20} color="#000" style={styles.searchIcon} />
//           <TextInput 
//             style={styles.searchInput} placeholder="Search kanji, furigana, romaji, meaning..."
//             placeholderTextColor="#666" value={searchQuery} onChangeText={setSearchQuery}
//           />
//         </View>
//       </View>

//       <View style={styles.filterScrollWrapper}>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
//           {['ALL', 'N5', 'N4', 'N3', 'N2', 'N1'].map((level) => (
//             <TouchableOpacity key={level} style={[styles.filterButton, selectedLevel === level && styles.filterButtonActive]} onPress={() => setSelectedLevel(level)}>
//               <Text style={[styles.filterText, selectedLevel === level && styles.filterTextActive]}>{level}</Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {/* Table Header Row */}
//       <View style={styles.tableHeaderWrapper}>
//         <View style={styles.tableHeader}>
//           <Text style={[styles.headerCell, { flex: 1.2 }]}>Kanji</Text>
//           <Text style={[styles.headerCell, { flex: 1.5 }]}>Furigana</Text>
//           <Text style={[styles.headerCell, { flex: 1.5 }]}>Romaji</Text>
//           <Text style={[styles.headerCell, { flex: 2.2 }]}>Meaning</Text>
//         </View>
//       </View>

//       <FlatList 
//         data={filteredWords}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.listContainer}
//         showsVerticalScrollIndicator={false}
//         renderItem={({ item }) => (
//           <TouchableOpacity 
//             activeOpacity={0.9} 
//             style={styles.cardWrapper} 
//             onPress={() => { Speech.stop(); Speech.speak(item.furigana.split('/')[0], { language: 'ja-JP', rate: 0.4 }); }}
//           >
//             <View style={styles.cardShadow} />
//             <View style={styles.rowCard}>
//               <Text style={[styles.cellText, styles.kanjiCell, { flex: 1.2 }]}>{item.kanji}</Text>
//               <Text style={[styles.cellText, { flex: 1.5 }]}>{item.furigana}</Text>
//               <Text style={[styles.cellText, { flex: 1.5 }]}>{item.romaji}</Text>
//               <Text style={[styles.cellText, styles.meaningCell, { flex: 2.2 }]}>{item.meaning}</Text>
//             </View>
//           </TouchableOpacity>
//         )}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#520D58' },
//   header: { fontSize: 24, fontWeight: '900', textAlign: 'center', marginVertical: 12, color: '#ffffff' },
  
//   searchWrapper: { marginHorizontal: 15, marginBottom: 12, position: 'relative' },
//   searchShadow: { position: 'absolute', top: 4, left: 4, right: -4, bottom: -4, backgroundColor: '#000', borderRadius: 12 },
//   searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 14, borderRadius: 12, borderWidth: 3, borderColor: '#000', height: 46 },
//   searchIcon: { marginRight: 8 },
//   searchInput: { flex: 1, color: '#000', fontSize: 15, fontWeight: '700' },
  
//   filterScrollWrapper: { height: 45, marginBottom: 10 },
//   filterContainer: { flexDirection: 'row', paddingHorizontal: 15, gap: 8, alignItems: 'center' },
//   filterButton: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#A7B3B7', borderWidth: 2, borderColor: '#000' },
//   filterButtonActive: { backgroundColor: '#DA9EFF', shadowColor: '#000', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 1, shadowRadius: 0 },
//   filterText: { color: '#000', fontWeight: '900', fontSize: 12 },
//   filterTextActive: { color: '#000' },

//   tableHeaderWrapper: { marginHorizontal: 15, marginBottom: 10 },
//   tableHeader: { flexDirection: 'row', backgroundColor: '#FA73FF', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12, borderWidth: 3, borderColor: '#000' },
//   headerCell: { fontWeight: '900', color: '#000', fontSize: 14, textAlign: 'center' },

//   listContainer: { paddingHorizontal: 15, paddingBottom: 40 },
//   cardWrapper: { position: 'relative', marginBottom: 16 }, // Increased spacing between cards
//   cardShadow: { position: 'absolute', top: 6, left: 6, right: -6, bottom: -6, backgroundColor: '#000', borderRadius: 16 }, // Larger shadow offset
  
//   rowCard: { backgroundColor: '#9DEEE9', flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 12, borderRadius: 16, borderWidth: 3, borderColor: '#000' }, // Taller vertical padding for larger cards
//   cellText: { fontSize: 14, color: '#000', fontWeight: '700', textAlign: 'center', lineHeight: 20 },
//   kanjiCell: { fontWeight: '900', fontSize: 18 }, // Larger prominent font for Kanji
//   meaningCell: { fontWeight: '800', fontSize: 13, lineHeight: 18 }, // Gives descriptions plenty of clean line space
// });

import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, SafeAreaView, Dimensions, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import * as Speech from 'expo-speech';

// Safe JSON asset import
import vocabData from '../../assets/vocab.json';

const { width } = Dimensions.get('window');
const canvasSize = width - 40;
const PAGE_SIZE = 15;

export default function VocabScreen() {
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [displayedData, setDisplayedData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const levels = ['ALL', 'N5', 'N4', 'N3', 'N2', 'N1'];

  const safeData = Array.isArray(vocabData) ? vocabData : [];

  const updateDisplayList = (level: string, query: string) => {
    const pool = safeData.filter((item: any) => {
      const matchesLevel = level === 'ALL' || item?.level?.toUpperCase() === level;
      const q = query.toLowerCase();
      const matchesSearch = 
        !query ||
        item?.kanji?.toLowerCase().includes(q) ||
        item?.word?.toLowerCase().includes(q) ||
        item?.kana?.toLowerCase().includes(q) ||
        item?.furigana?.toLowerCase().includes(q) ||
        item?.reading?.toLowerCase().includes(q) ||
        item?.romaji?.toLowerCase().includes(q) ||
        item?.meaning?.toLowerCase().includes(q) ||
        item?.english?.toLowerCase().includes(q);

      return matchesLevel && matchesSearch;
    });

    setDisplayedData(pool.slice(0, PAGE_SIZE));
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level);
    updateDisplayList(level, searchQuery);
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    updateDisplayList(selectedLevel, text);
  };

  useEffect(() => {
    updateDisplayList('ALL', '');
  }, []);

  const getFilteredPool = () => {
    return safeData.filter((item: any) => {
      const matchesLevel = selectedLevel === 'ALL' || item?.level?.toUpperCase() === selectedLevel;
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery ||
        item?.kanji?.toLowerCase().includes(q) ||
        item?.word?.toLowerCase().includes(q) ||
        item?.kana?.toLowerCase().includes(q) ||
        item?.furigana?.toLowerCase().includes(q) ||
        item?.reading?.toLowerCase().includes(q) ||
        item?.romaji?.toLowerCase().includes(q) ||
        item?.meaning?.toLowerCase().includes(q) ||
        item?.english?.toLowerCase().includes(q);

      return matchesLevel && matchesSearch;
    });
  };

  const loadMoreItem = () => {
    if (isLoading) return;
    const filteredPool = getFilteredPool();
    const currentLength = displayedData.length;
    if (currentLength >= filteredPool.length) return;

    setIsLoading(true);
    setTimeout(() => {
      const nextBatch = filteredPool.slice(0, currentLength + PAGE_SIZE);
      setDisplayedData(nextBatch);
      setIsLoading(false);
    }, 400);
  };

  const speakWord = (text: string) => {
    if (!text) return;
    Speech.stop();
    Speech.speak(text, { language: 'ja-JP', rate: 0.3 });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>JLPT Reference Table 📖</Text>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.cardShadowSmall} />
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search kanji, furigana, romaji, meaning..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
        </View>
      </View>

      {/* Level Switcher Tabs */}
      <View style={styles.tabWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabContainer}>
          {levels.map((lvl) => (
            <TouchableOpacity 
              key={lvl}
              style={[styles.tabButton, selectedLevel === lvl && styles.tabActive]} 
              onPress={() => handleLevelChange(lvl)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, selectedLevel === lvl && styles.textActive]}>{lvl}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Column Headings Bar */}
      <View style={styles.columnHeaderWrapper}>
        <View style={styles.cardShadow} />
        <View style={styles.columnHeaderContainer}>
          <Text style={[styles.columnHeaderText, styles.colKanji]}>Kanji</Text>
          <Text style={[styles.columnHeaderText, styles.colFurigana]}>Furigana</Text>
          <Text style={[styles.columnHeaderText, styles.colRomaji]}>Romaji</Text>
          <Text style={[styles.columnHeaderText, styles.colMeaning]}>Meaning</Text>
        </View>
      </View>

      {/* Lazy Loaded List Cards */}
      <FlatList
        data={displayedData}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.cardWrapper} 
            activeOpacity={0.8} 
            onPress={() => speakWord(item?.kanji || item?.furigana || item?.kana || item?.word)}
          >
            <View style={styles.cardShadow} />
            <View style={styles.vocabCard}>
              <Text style={[styles.rowCell, styles.colKanji, styles.kanjiText]} numberOfLines={1}>
                {item?.kanji || item?.word || item?.kana || ''}
              </Text>
              <Text style={[styles.rowCell, styles.colFurigana, styles.furiganaText]} numberOfLines={1}>
                {item?.furigana || item?.reading || item?.kana || ''}
              </Text>
              <Text style={[styles.rowCell, styles.colRomaji, styles.romajiText]} numberOfLines={1}>
                {item?.romaji || ''}
              </Text>
              <Text style={[styles.rowCell, styles.colMeaning, styles.meaningText]} numberOfLines={3}>
                {item?.meaning || item?.english || ''}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        onEndReached={loadMoreItem}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color="#9DEEE9" />
              <Text style={styles.loaderText}>Loading more words...</Text>
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#520D58', alignItems: 'center', paddingTop: 10 },
  header: { fontSize: 24, fontWeight: '900', color: '#ffffff', marginBottom: 8 },

  searchWrapper: { position: 'relative', width: canvasSize, marginBottom: 8 },
  cardShadowSmall: { position: 'absolute', top: 4, left: 4, right: -4, bottom: -4, backgroundColor: '#000', borderRadius: 12 },
  searchContainer: { backgroundColor: '#ffffff', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12, borderWidth: 3, borderColor: '#000' },
  searchIcon: { fontSize: 14, marginRight: 6 },
  searchInput: { flex: 1, fontSize: 12, fontWeight: '800', color: '#000' },
  
  tabWrapper: { height: 38, marginBottom: 8 },
  tabContainer: { gap: 8, paddingHorizontal: 5, alignItems: 'center' },
  tabButton: { paddingVertical: 4, paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#A7B3B7', borderWidth: 2.5, borderColor: '#000', height: 30, justifyContent: 'center' },
  tabActive: { backgroundColor: '#FA73FF', shadowColor: '#000', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 1, shadowRadius: 0 },
  tabText: { color: '#000', fontWeight: '900', fontSize: 11 },
  textActive: { color: '#000' },

  columnHeaderWrapper: { position: 'relative', width: canvasSize, marginBottom: 8 },
  cardShadow: { position: 'absolute', top: 4, left: 4, right: -4, bottom: -4, backgroundColor: '#000', borderRadius: 12 },
  columnHeaderContainer: { backgroundColor: '#FA73FF', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 12, borderWidth: 3, borderColor: '#000', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  columnHeaderText: { fontSize: 12, fontWeight: '900', color: '#000', textTransform: 'uppercase' },

  listContainer: { width: canvasSize, paddingBottom: 20, gap: 10 },
  
  cardWrapper: { position: 'relative', width: '100%', marginBottom: 2 },
  vocabCard: { backgroundColor: '#9DEEE9', paddingVertical: 10, paddingHorizontal: 10, borderRadius: 12, borderWidth: 3, borderColor: '#000', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  
  // Column width proportions
  colKanji: { flex: 1 },
  colFurigana: { flex: 1 },
  colRomaji: { flex: 1 },
  colMeaning: { flex: 1.5 },

  rowCell: {}, // Added missing rowCell definition to fix TypeScript warning

  kanjiText: { fontSize: 16, fontWeight: '900', color: '#000' },
  furiganaText: { fontSize: 12, fontWeight: '800', color: '#333' },
  romajiText: { fontSize: 12, fontWeight: '800', color: '#222', textTransform: 'uppercase' },
  meaningText: { fontSize: 12, fontWeight: '900', color: '#000' },

  loaderContainer: { paddingVertical: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  loaderText: { color: '#9DEEE9', fontWeight: '800', fontSize: 12 },
});