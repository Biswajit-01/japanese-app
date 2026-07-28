import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#520D58',
        tabBarItemStyle: styles.tabItem,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconBg, { backgroundColor: '#9DEEE9' }]}>
              <Ionicons name="home" size={20} color="#000" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Alphabet',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, { backgroundColor: '#FA73FF' }]}>
              <Ionicons name="text" size={20} color="#000" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="vocab"
        options={{
          title: 'Vocab',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, { backgroundColor: '#DA9EFF' }]}>
              <Ionicons name="library" size={20} color="#000" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="writing"
        options={{
          title: 'Strokes',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, { backgroundColor: '#A7B3B7' }]}>
              <Ionicons name="brush" size={20} color="#000" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="draw"
        options={{
          title: 'Draw',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, { backgroundColor: '#9DEEE9' }]}>
              <Ionicons name="pencil" size={20} color="#000" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: 'Quiz',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, { backgroundColor: '#FA73FF' }]}>
              <Ionicons name="game-controller" size={20} color="#000" />
            </View>
          ),
        }}
      />

      {/* Explicitly hide template tabs */}
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="glasscard" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    borderRadius: 20,
    height: 70,
    borderWidth: 4,
    borderColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    paddingBottom: 8,
    paddingTop: 8,
    // Constrain and center the tab bar on web view to match the app card width
    ...(Platform.OS === 'web' && {
      left: '50%',
      right: 'auto',
      width: 'calc(100% - 32px)',
      maxWidth: 680,
      transform: [{ translateX: '-50%' }],
    }),
  },
  tabItem: {
    paddingTop: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000000',
    marginTop: 2,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  activeIconBg: {
    transform: [{ translateY: -2 }],
  },
});