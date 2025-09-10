// App.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 1. Import the master map from our new types file
import { RootStackParamList } from './src/navigationTypes';
import { UserProvider } from './src/context/UserContext';

// Import all screens
import MainMenuScreen from './src/screens/MainMenuScreen';
import GameSetupScreen from './src/screens/GameSetupScreen';
import GamePlayScreen from './src/screens/GamePlayScreen';
import FinalStatsScreen from './src/screens/FinalStatsScreen';
import CharacterScreen from './src/screens/CharacterScreen';

// 2. Use the imported type to create the navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    // 2. WRAP EVERYTHING WITH THE PROVIDER
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ headerShown: false }}
          initialRouteName="MainMenu"
        >
          {/* All screens are now children of UserProvider and can access the context */}
          <Stack.Screen name="MainMenu" component={MainMenuScreen} />
          <Stack.Screen name="GameSetup" component={GameSetupScreen} />
          <Stack.Screen name="GamePlay" component={GamePlayScreen} />
          <Stack.Screen name="FinalStats" component={FinalStatsScreen} />
          <Stack.Screen name="Character" component={CharacterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

export default App;