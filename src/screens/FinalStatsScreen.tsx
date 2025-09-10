// src/screens/FinalStatsScreen.tsx

import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigationTypes'; // <-- CORRECTED IMPORT PATH

// Define the shape of a single word stat object for clarity
type WordStat = {
  word: string;
  image: any;
  timeTaken: number;
};

type FinalStatsProps = NativeStackScreenProps<RootStackParamList, 'FinalStats'>;

const FinalStatsScreen = ({ route, navigation }: FinalStatsProps) => {
  const { finalScore, roundWords } = route.params;
  const handleMainMenuPress = () => navigation.popToTop();
  const handleScreenshotPress = () => Alert.alert("Coming Soon", "The screenshot feature will be added in a future step.");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Round Complete!</Text>
        <Text style={styles.scoreText}>Final Score: {finalScore}</Text>
      </View>

      <ScrollView style={styles.resultsList}>
        {/* FIX #2: Explicitly type 'item' and 'index' here */}
        {roundWords.map((item: WordStat, index: number) => (
          <View key={index} style={styles.wordRow}>
            <Text style={styles.wordText}>{item.word}</Text>
            <View style={styles.barContainer}>
              <View style={[styles.bar, { width: `${item.timeTaken * 10}%` }]} />
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.button} onPress={handleScreenshotPress}><Text style={styles.buttonText}>Capture Score</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleMainMenuPress}><Text style={styles.buttonText}>Main Menu</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
// Styles are unchanged...
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#e0f7fa', alignItems: 'center' }, headerContainer: { padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#b0bec5', width: '100%', }, headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#00796b' }, scoreText: { fontSize: 24, color: '#37474f', marginTop: 10 }, resultsList: { width: '100%' }, wordRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#eceff1', }, wordText: { fontSize: 18, color: '#333', width: '30%' }, barContainer: { flex: 1, height: 20, backgroundColor: '#cfd8dc', borderRadius: 10, marginLeft: 10, overflow: 'hidden' }, bar: { height: '100%', backgroundColor: '#ffc107', borderRadius: 10, maxWidth: '100%', }, footerContainer: { padding: 20, width: '100%', alignItems: 'center', }, button: { backgroundColor: '#00796b', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 10, marginVertical: 5, width: '80%', alignItems: 'center', }, buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }, });
export default FinalStatsScreen;