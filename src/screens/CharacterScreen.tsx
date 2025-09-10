// src/screens/CharacterScreen.tsx

import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigationTypes';
import { useUser } from '../context/UserContext'; // 1. Import the useUser hook

// --- Placeholder Images ---
const characterBaseImage = require('../assets/images/character_base.png');
const accessoryHatImage = require('../assets/images/accessory_hat.png');
const accessoryGlassesImage = require('../assets/images/accessory_glasses.png');

// 2. UPDATE aCCESSORY DATA to include a required level
const ACCESSORIES = [
  { id: 'hat', name: 'Hat', image: accessoryHatImage, requiredLevel: 5 },
  { id: 'glasses', name: 'Glasses', image: accessoryGlassesImage, requiredLevel: 2 },
];

type CharacterProps = NativeStackScreenProps<RootStackParamList, 'Character'>;

const CharacterScreen = ({ navigation }: CharacterProps) => {
  const { user } = useUser(); // 3. Get the player's user data
  const [equippedHat, setEquippedHat] = useState(false);
  const [equippedGlasses, setEquippedGlasses] = useState(false);

  const handleAccessoryPress = (accessoryId: string) => {
    if (accessoryId === 'hat') setEquippedHat(!equippedHat);
    else if (accessoryId === 'glasses') setEquippedGlasses(!equippedGlasses);
  };

  const handleBackPress = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Customize Character</Text>

      <View style={styles.characterContainer}>
        <Image source={characterBaseImage} style={styles.characterBase} />
        {equippedHat && <Image source={accessoryHatImage} style={[styles.accessory, styles.hatAccessory]} />}
        {equippedGlasses && <Image source={accessoryGlassesImage} style={styles.accessory} />}
      </View>

      <View style={styles.selectionContainer}>
        <Text style={styles.selectionTitle}>Accessories</Text>
        <View style={styles.accessoryGrid}>
          {ACCESSORIES.map(acc => {
            // 4. CHECK IF THE ITEM IS UNLOCKED
            const isUnlocked = user.level >= acc.requiredLevel;

            return (
              <TouchableOpacity
                key={acc.id}
                style={[styles.accessoryButton, !isUnlocked && styles.lockedButton]}
                onPress={() => isUnlocked && handleAccessoryPress(acc.id)} // Only allow press if unlocked
                activeOpacity={isUnlocked ? 0.7 : 1.0} // Don't show press feedback if locked
              >
                <Image source={acc.image} style={styles.accessoryIcon} />
                {!isUnlocked && (
                  <View style={styles.lockOverlay}>
                    <Text style={styles.lockText}>Lvl {acc.requiredLevel}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Text style={styles.backButtonText}>Back to Menu</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f7', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333', marginVertical: 20 },
  characterContainer: { width: 300, height: 300, backgroundColor: '#fff', borderRadius: 150, justifyContent: 'center', alignItems: 'center', borderWidth: 5, borderColor: '#d0d9e0', position: 'relative', },
  characterBase: { width: '80%', height: '80%', resizeMode: 'contain' },
  accessory: { width: '80%', height: '80%', resizeMode: 'contain', position: 'absolute', },
  hatAccessory: { top: -60, },
  selectionContainer: { marginTop: 30, width: '90%', alignItems: 'center', },
  selectionTitle: { fontSize: 24, fontWeight: '600', color: '#555', marginBottom: 10 },
  accessoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', },
  accessoryButton: { width: 80, height: 80, backgroundColor: '#fff', borderRadius: 10, margin: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#d0d9e0', },
  accessoryIcon: { width: '80%', height: '80%', resizeMode: 'contain' },
  // 5. NEW STYLES for the locked items
  lockedButton: {
    backgroundColor: '#e0e0e0', // Gray out the background
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject, // This makes the overlay fill the button
    backgroundColor: 'rgba(50, 50, 50, 0.7)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: { marginTop: 'auto', marginBottom: 30, backgroundColor: '#555', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 10, },
  backButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default CharacterScreen;