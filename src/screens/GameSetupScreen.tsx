// src/screens/GameSetupScreen.tsx

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigationTypes';

// --- Image Assets ---
const categoryFoodImage = require('../assets/images/category_food.png');
const categoryAnimalsImage = require('../assets/images/category_animals.png');
const categorySportsImage = require('../assets/images/category_sports.png');
const playButtonImage = require('../assets/images/button_play.png');

// --- Data Definitions ---
const CATEGORIES = [
  { id: 'food', name: 'Food', image: categoryFoodImage },
  { id: 'animals', name: 'Animals', image: categoryAnimalsImage },
  { id: 'sports', name: 'Sports', image: categorySportsImage },
];

const WORD_COUNT_OPTIONS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

// --- Component Definition ---
type GameSetupProps = NativeStackScreenProps<RootStackParamList, 'GameSetup'>;

const GameSetupScreen = ({ navigation }: GameSetupProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedWordCount, setSelectedWordCount] = useState<number>(10);

  const handleStartGame = () => {
    if (!selectedCategory) {
      Alert.alert('Selection Required', 'Please select a category!');
      return;
    }
    navigation.navigate('GamePlay', { 
      category: selectedCategory, 
      wordCount: selectedWordCount 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerText}>Choose a Category</Text>
        <View style={styles.categoryContainer}>
          {CATEGORIES.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categorySelected,
              ]}
              onPress={() => setSelectedCategory(category.id)}>
              <Image source={category.image} style={styles.categoryImage} />
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.headerText}>How many words?</Text>
        <View style={styles.wordCountContainer}>
          {WORD_COUNT_OPTIONS.map(count => (
            <TouchableOpacity
              key={count}
              style={[
                styles.wordCountButton,
                selectedWordCount === count && styles.wordCountSelected,
              ]}
              onPress={() => setSelectedWordCount(count)}>
              <Text style={styles.wordCountText}>{count}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.playButton} onPress={handleStartGame}>
          <Image source={playButtonImage} style={styles.playButtonImage} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#e0f7fa' 
  },
  scrollContent: { 
    alignItems: 'center', 
    paddingVertical: 20 
  },
  headerText: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#00796b', 
    marginTop: 20, 
    marginBottom: 15 
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  categoryButton: {
    alignItems: 'center',
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: 'transparent',
    elevation: 5,
  },
  categorySelected: { 
    borderColor: '#ffc107' 
  },
  categoryImage: { 
    width: 100, 
    height: 100, 
    resizeMode: 'contain' 
  },
  categoryText: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginTop: 5, 
    color: '#333' 
  },
  wordCountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
    paddingHorizontal: 15,
  },
  wordCountButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    borderWidth: 3,
    borderColor: 'transparent',
    elevation: 3,
  },
  wordCountSelected: { 
    backgroundColor: '#00796b', 
    borderColor: '#fff' 
  },
  wordCountText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#00796b' 
  },
  playButton: { 
    marginTop: 30 
  },
  playButtonImage: { 
    width: 250, 
    height: 80, 
    resizeMode: 'contain' 
  },
});

export default GameSetupScreen;