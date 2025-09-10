// src/screens/MainMenuScreen.tsx

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigationTypes';
import { useUser } from '../context/UserContext';

const backgroundImage = require('../assets/images/main_background.png');
const startButtonImage = require('../assets/images/button_start.png');
const characterButtonImage = require('../assets/images/button_character.png');
const settingsButtonImage = require('../assets/images/button_settings.png');

type MainMenuProps = NativeStackScreenProps<RootStackParamList, 'MainMenu'>;

const MainMenuScreen = ({ navigation }: MainMenuProps) => {
  const { user, addXp } = useUser(); // Get the addXp function

  if (!user) { return null; }

  const handleStartPress = () => navigation.navigate('GameSetup');
  const handleCharacterPress = () => navigation.navigate('Character');
  const handleSettingsPress = () => console.log("Settings button pressed");
  const handleAddXpPress = () => addXp(50); // Give 50 XP per press

  const xpToNextLevel = (user.level || 1) * 100; 
  let xpProgressPercent = ((user.xp || 0) / xpToNextLevel) * 100;
  if (isNaN(xpProgressPercent)) { xpProgressPercent = 0; }

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.playerInfoContainer}>
            <Text style={styles.levelText}>Level: {user.level}</Text>
            <View style={styles.xpBarBackground}>
              <View style={[styles.xpBarFill, { width: `${xpProgressPercent}%` }]} />
            </View>
            <Text style={styles.xpText}>{user.xp} / {xpToNextLevel} XP</Text>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>BPSPEAK</Text>
          <Text style={styles.subtitle}>Pronunciation Challenge</Text>
        </View>
        
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={handleStartPress}><Image source={startButtonImage} style={styles.buttonImage} /></TouchableOpacity>
          <TouchableOpacity onPress={handleCharacterPress}><Image source={characterButtonImage} style={styles.buttonImage} /></TouchableOpacity>
          <TouchableOpacity onPress={handleSettingsPress}><Image source={settingsButtonImage} style={styles.buttonImage} /></TouchableOpacity>
          
          {/* Temporary Button for Testing */}
          <TouchableOpacity style={styles.devButton} onPress={handleAddXpPress}>
            <Text style={styles.devButtonText}>DEV: Add 50 XP</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20 },
  playerInfoContainer: { width: '80%', backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 15, padding: 15, alignItems: 'center', },
  levelText: { color: 'white', fontSize: 22, fontWeight: 'bold', },
  xpBarBackground: { width: '100%', height: 20, backgroundColor: '#555', borderRadius: 10, marginTop: 10, overflow: 'hidden', },
  xpBarFill: { height: '100%', backgroundColor: '#3498db', borderRadius: 10, },
  xpText: { color: 'white', fontSize: 14, marginTop: 5, },
  titleContainer: { alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: 20, borderRadius: 15, },
  title: { fontSize: 48, fontWeight: 'bold', color: '#2c3e50' },
  subtitle: { fontSize: 24, color: '#34495e' },
  menuContainer: { width: '100%', alignItems: 'center', paddingBottom: 20 },
  buttonImage: { width: 250, height: 80, resizeMode: 'contain', marginVertical: 10, },
  // Styles for the dev button
  devButton: {
    marginTop: 15,
    backgroundColor: '#9b59b6', // Purple color
    padding: 10,
    borderRadius: 5,
  },
  devButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default MainMenuScreen;