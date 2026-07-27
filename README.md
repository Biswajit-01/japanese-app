# NihonPath 🇯🇵

**NihonPath** is a modern, gamified, and fully responsive Japanese language learning application built with **React Native**, **Expo**, **Expo Router**, and **TypeScript**. It is designed to provide a unified experience across mobile devices and desktop web browsers with a vibrant, neo-brutalist retro UI.

---

## ✨ Features

* **Interactive Home Dashboard**: 
  * Real-time network status indicator (Online/Offline).
  * Daily streak tracker persisted locally using AsyncStorage.
  * Random Kanji teaser widget with audio pronunciation.
  * Quick access modules for Vocab, Stroke Guides, Drawing, and Quizzes.
* **Alphabet Section (`/(tabs)`)**: Comprehensive reference grids for **Hiragana**, **Katakana**, and foundational **Kanji** with native text-to-speech audio playback (`expo-speech`).
* **Vocabularly Dictionary (`/(tabs)/vocab`)**: Filterable JLPT reference table (N5 through N1) featuring instant keyword search across kanji, furigana, romaji, and meanings.
* **Stroke Guide (`/(tabs)/writing`)**: Detailed step-by-step breakdown of stroke orders for writing Hiragana and Katakana characters correctly.
* **Trace Pad / Draw (`/(tabs)/draw`)**: An interactive SVG-based drawing canvas enabling users to practice tracing characters with background ghost guides and visual feedback.
* **Kana Quiz (`/(tabs)/quiz`)**: Gamified multiple-choice quizzes for Hiragana and Katakana with customizable question limits, score tracking, audio sound effects (`expo-av`), and animated victory fireworks summaries.
* **Master Roadmap (`/roadmap`)**: An immersive timeline guiding learners step-by-step from absolute beginner (N5) to native mastery (N1) with clear milestone checklists.
* **Responsive Desktop Web View**: Features a centered container box layout with background grid overlays, ensuring it behaves like a polished web app dashboard rather than a stretched mobile screen.

---

## 🛠️ Tech Stack & Libraries

* **Framework**: React Native / Expo (Expo Router)
* **Language**: TypeScript
* **UI & Styling**: React Native StyleSheet, Vector Icons (`@expo/vector-icons`)
* **Graphics & Canvas**: `react-native-svg`
* **Audio & Speech**: `expo-speech`, `expo-av`
* **Storage & Network**: `@react-native-async-storage/async-storage`, `@react-native-community/netinfo`

---

## 📂 Project Structure

```text
NihonPath/
├── app/
│   ├── (tabs)/
│   │   _layout.tsx       # Custom bottom navigation bar (responsive for web)
│   │   home.tsx          # Main web/mobile dashboard
│   │   index.tsx         # Alphabet reference screen
│   │   vocab.tsx         # JLPT Vocabulary dictionary & table
│   │   writing.tsx       # Stroke guide reference screen
│   │   draw.tsx          # Interactive SVG tracing canvas
│   │   quiz.tsx          # Gamified kana quiz module
│   ├── roadmap.tsx       # Complete N5-N1 master journey roadmap
│   └── _layout.tsx       # Root layout configuration
├── assets/
│   └── vocab.json        # Comprehensive JLPT vocabulary dataset
└── components/
    └── RandomKanjiCard.tsx # Daily/Random Kanji display teaser component