// src/context/UserContext.tsx

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native'; // Import components for loading screen
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- (Interfaces are unchanged) ---
interface UserData {
  level: number;
  xp: number;
  unlockedCharacters: string[];
  unlockedAccessories: string[];
}
interface IUserContext {
  user: UserData;
  isLoading: boolean;
  addXp: (amount: number) => void;
  unlockItem: (type: 'character' | 'accessory', id: string) => void;
}

const UserContext = createContext<IUserContext | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData>({ level: 1, xp: 0, unlockedCharacters: [], unlockedAccessories: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@userData');
        if (jsonValue != null) {
          setUser(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error("Failed to load user data.", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, []);

  const saveUserData = async (newUserData: UserData) => {
    try {
      const jsonValue = JSON.stringify(newUserData);
      await AsyncStorage.setItem('@userData', jsonValue);
    } catch (e) {
      console.error("Failed to save user data.", e);
    }
  };
  
  const addXp = (amount: number) => {
    const xpToNextLevel = user.level * 100;
    let newXp = user.xp + amount;
    let newLevel = user.level;
    if (newXp >= xpToNextLevel) {
      newLevel += 1;
      newXp = newXp - xpToNextLevel;
      console.log(`LEVEL UP! Reached Level ${newLevel}`);
    }
    const newUserData = { ...user, xp: newXp, level: newLevel };
    setUser(newUserData);
    saveUserData(newUserData);
  };
  
  const unlockItem = (type: 'character' | 'accessory', id: string) => {
    console.log(`Unlocking ${type}: ${id}`);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Player Data...</Text>
      </View>
    );
  }

  return (
    <UserContext.Provider value={{ user, isLoading, addXp, unlockItem }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): IUserContext => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Add styles for the loading screen
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  loadingText: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
  }
});