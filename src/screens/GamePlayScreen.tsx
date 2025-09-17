// src/screens/GamePlayScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  Platform
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigationTypes';
import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';
import { useUser } from '../context/UserContext';

// --- Data ---
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

// --- Type Definitions ---
type GamePlayProps = NativeStackScreenProps<RootStackParamList, 'GamePlay'>;

// --- Component ---
const GamePlayScreen = ({ route, navigation }: GamePlayProps) => {
  const { category, wordCount } = route.params;
  const { addXp } = useUser();

  // --- State Variables ---
  const [wordList, setWordList] = useState<{ word: string, image: any }[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [statusMessage, setStatusMessage] = useState('Tap the Mic to Speak');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [roundStats, setRoundStats] = useState<{ word: string; image: any; timeTaken: number }[]>([]);
  
  // This ref holds the logic for checking the answer.
  // It allows the voice listeners (which are set only once) to access the latest state.
  const checkAnswerRef = useRef((_spokenWord: string) => {});

  // This useEffect updates the function inside the ref whenever the state changes.
  useEffect(() => {
    checkAnswerRef.current = (spokenWord: string) => {
      const currentWord = wordList[currentWordIndex];
      if (!currentWord) return;

      if (spokenWord.toLowerCase().trim() === currentWord.word.toLowerCase().trim()) {
        const endTime = Date.now();
        const timeTaken = startTime ? (endTime - startTime) / 1000 : 10;
        
        setRoundStats(prevStats => [...prevStats, { ...currentWord, timeTaken }]);
        
        setStatusMessage('Correct!');
        setScore(prev => prev + 100);
        addXp(10);
        
        setTimeout(() => handleNextWord(), 1000);
      } else {
        setStatusMessage('Try Again!');
      }
    };
  }, [wordList, currentWordIndex, startTime, score, addXp, navigation]);

  // This useEffect sets up the native listeners ONCE when the component mounts.
  useEffect(() => {
    const onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value[0]) {
        setRecognizedText(e.value[0]);
        // By calling the function via the ref, we always get the latest version.
        checkAnswerRef.current(e.value[0]);
      }
    };
    const onSpeechEnd = () => {
        setStatusMessage('Tap the Mic to Speak');
        setIsListening(false);
    };
    const onSpeechError = (e: any) => {
      if (e.error?.code === '7' || e.error?.code === '11') {
        console.log("Ignoring 'no match' error.");
        setIsListening(false);
        return;
      }
      console.error('onSpeechError:', e.error);
      setStatusMessage('Mic error. Try again.');
      setIsListening(false);
    };

    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;

    const setupPermissions = async () => {
        if (Platform.OS === 'android') {
            await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
        }
    };
    setupPermissions();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
    // --- FIX: This comment disables the incorrect linter warning for this line. ---
    // The empty array is intentional: we only want this effect to run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Word list setup
  useEffect(() => {
    const fullCategoryList = VOCABULARY_DATA[category as keyof typeof VOCABULARY_DATA] || [];
    const shuffled = fullCategoryList.sort(() => 0.5 - Math.random());
    setWordList(shuffled.slice(0, wordCount));
  }, [category, wordCount]);

  // This useEffect triggers navigation when the round is complete.
  useEffect(() => {
    if (roundStats.length === wordList.length && wordList.length > 0) {
      navigation.navigate('FinalStats', { finalScore: score, roundWords: roundStats });
    }
  }, [roundStats, wordList, navigation, score]);

  // Advances to the next word or finishes the round
  const handleNextWord = () => {
      if (currentWordIndex < wordList.length - 1) {
          setCurrentWordIndex(prev => prev + 1);
          setRecognizedText('');
          setStatusMessage('Tap the Mic to Speak');
          setStartTime(Date.now());
      }
  };

  // Manually starts and stops the voice recognition
  const handleMicButtonPress = async () => {
    if (isListening) {
      await Voice.stop();
      return;
    }
    try {
      setRecognizedText('');
      setStatusMessage('Listening...');
      await Voice.start('en-US');
      setIsListening(true);
      setStartTime(Date.now());
    } catch (e: any) {
      console.error("[Mic Control] Voice.start() FAILED:", e);
      if (e.message?.includes("busy")) {
        setStatusMessage('Mic busy. Try again.');
      } else {
        setStatusMessage('Mic error. Try again.');
      }
    }
  };

  // Handles skipping a word
  const handleSkipOrGiveUp = () => {
      const currentWord = wordList[currentWordIndex];
      const timeTaken = 10.0;
      setRoundStats(prev => [...prev, { ...currentWord, timeTaken }]);
      
      if (currentWordIndex < wordList.length - 1) {
        handleNextWord(); 
      }
  };
  
  // --- Render Logic ---
  if (wordList.length === 0 || !wordList[currentWordIndex]) {
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
        <TouchableOpacity style={[styles.button, styles.giveUpButton]} onPress={handleSkipOrGiveUp}><Text style={styles.buttonText}>Give Up</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.skipButton]} onPress={handleSkipOrGiveUp}><Text style={styles.buttonText}>Skip</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- Styles ---
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