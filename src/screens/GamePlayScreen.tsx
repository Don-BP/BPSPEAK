// src/screens/GamePlayScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigationTypes';
import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';
import { useUser } from '../context/UserContext'; // <-- IMPORTED

const VOCABULARY_DATA = {
  food: [
    { word: 'Apple', image: require('../assets/images/word_apple.png') },
    { word: 'Banana', image: require('../assets/images/word_banana.png') },
  ],
  animals: [
    { word: 'Cat', image: require('../assets/images/word_cat.png') },
    { word: 'Dog', image: require('../assets/images/word_dog.png') },
  ],
  sports: [
    { word: 'Soccer', image: require('../assets/images/word_soccer.png') },
    { word: 'Baseball', image: require('../assets/images/word_baseball.png') },
  ],
};

type GamePlayProps = NativeStackScreenProps<RootStackParamList, 'GamePlay'>;

const GamePlayScreen = ({ route, navigation }: GamePlayProps) => {
  const { category, wordCount } = route.params;
  const { addXp } = useUser(); // <-- HOOKED INTO CONTEXT

  const [wordList, setWordList] = useState<{ word: string, image: any }[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [statusMessage, setStatusMessage] = useState('Tap the Mic to Speak');

  useEffect(() => {
    const onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value.length > 0) {
        setRecognizedText(e.value[0]);
        checkAnswer(e.value[0]);
      }
    };
    const onSpeechEnd = () => {
      setIsListening(false);
      setStatusMessage('Tap the Mic to Speak');
    };
    const onSpeechError = (e: any) => {
      console.error(e);
      setStatusMessage('Error! Tap to try again.');
      setIsListening(false);
    };
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [currentWordIndex, wordList]);

  useEffect(() => {
    const fullCategoryList = VOCABULARY_DATA[category as keyof typeof VOCABULARY_DATA] || [];
    const shuffled = fullCategoryList.sort(() => 0.5 - Math.random());
    setWordList(shuffled.slice(0, wordCount));
  }, [category, wordCount]);

  const handleNextWord = () => {
    if (currentWordIndex < wordList.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setRecognizedText('');
    } else {
      const wordsWithStats = wordList.map(wordData => ({
        ...wordData,
        timeTaken: Math.random() * 8 + 2,
      }));
      navigation.navigate('FinalStats', {
        finalScore: score,
        roundWords: wordsWithStats,
      });
    }
  };

  const checkAnswer = (spokenWord: string) => {
    const currentWord = wordList[currentWordIndex].word;
    if (spokenWord.toLowerCase() === currentWord.toLowerCase()) {
      setStatusMessage('Correct!');
      setScore(prev => prev + 100);
      addXp(10); // <-- GRANTS 10 XP FOR A CORRECT ANSWER
      setTimeout(() => {
        handleNextWord();
      }, 1000);
    } else {
      setStatusMessage('Try Again!');
    }
  };

  const handleMicButtonPress = async () => {
    if (isListening) {
      await Voice.stop();
      setIsListening(false);
    } else {
      try {
        if (Platform.OS === 'android') {
          await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
        }
        setRecognizedText('');
        setStatusMessage('Listening...');
        await Voice.start('en-US');
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSkip = () => { handleNextWord(); };
  const handleGiveUp = () => { handleNextWord(); };

  if (wordList.length === 0 || currentWordIndex >= wordList.length) {
    return <SafeAreaView style={styles.container}><Text style={styles.loadingText}>Loading Round...</Text></SafeAreaView>;
  }

  const currentWord = wordList[currentWordIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.wordCountText}>{currentWordIndex + 1} / {wordList.length}</Text>
      </View>
      
      <View style={styles.wordContainer}>
        <Image source={currentWord.image} style={styles.wordImage} />
        <Text style={styles.wordText}>{currentWord.word}</Text>
      </View>
      
      <View style={styles.micContainer}>
        <TouchableOpacity style={[styles.micButton, isListening && styles.micButtonListening]} onPress={handleMicButtonPress}>
          <Text style={styles.buttonText}>{isListening ? 'Listening...' : 'Speak'}</Text>
        </TouchableOpacity>
        <Text style={styles.statusText}>{statusMessage}</Text>
        <Text style={styles.recognizedText}>You said: {recognizedText}</Text>
      </View>

      <View style={styles.skipButtonsContainer}>
        <TouchableOpacity style={[styles.button, styles.giveUpButton]} onPress={handleGiveUp}>
          <Text style={styles.buttonText}>Give Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.skipButton]} onPress={handleSkip}>
          <Text style={styles.buttonText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2c3e50', alignItems: 'center', justifyContent: 'space-between' },
    header: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20, paddingTop: 20 },
    scoreText: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
    wordCountText: { fontSize: 24, color: '#fff' },
    loadingText: { fontSize: 24, color: '#fff', marginTop: '50%' },
    wordContainer: { alignItems: 'center', justifyContent: 'center', flex: 1, paddingBottom: 20 },
    wordImage: { width: 250, height: 250, resizeMode: 'contain', borderRadius: 20, backgroundColor: 'white' },
    wordText: { fontSize: 48, color: '#fff', fontWeight: 'bold', marginTop: 20, textTransform: 'uppercase' },
    micContainer: { width: '100%', alignItems: 'center', padding: 10 },
    micButton: { backgroundColor: '#2980b9', padding: 20, borderRadius: 50, width: 200, alignItems: 'center' },
    micButtonListening: { backgroundColor: '#e74c3c' },
    statusText: { color: '#fff', fontSize: 18, marginTop: 10, fontStyle: 'italic' },
    recognizedText: { color: '#bdc3c7', fontSize: 16, marginTop: 5 },
    button: { padding: 15, borderRadius: 10, alignItems: 'center', marginVertical: 5 },
    buttonText: { fontSize: 20, color: '#fff', fontWeight: 'bold' },
    skipButtonsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '90%', paddingBottom: 20 },
    giveUpButton: { backgroundColor: '#c0392b', width: '48%' },
    skipButton: { backgroundColor: '#f39c12', width: '48%' },
});

export default GamePlayScreen;