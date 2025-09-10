// src/navigationTypes.ts

// This file will hold the master list of all screens and their parameters.
// Every screen that uses navigation will import its types from here.
export type RootStackParamList = {
    MainMenu: undefined;
    GameSetup: undefined;
    GamePlay: { category: string; wordCount: number };
    FinalStats: { finalScore: number; roundWords: { word: string; image: any; timeTaken: number }[] };
    Character: undefined;
  };