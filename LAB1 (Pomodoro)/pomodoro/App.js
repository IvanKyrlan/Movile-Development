import 'react-native-gesture-handler';

import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { NavigationContainer } from '@react-navigation/native';

import PomoTimer from './components/PomodoroTimer';

const unloadedSound = {
  playAsync: () => {
    console.log('No sounds loaded');
  },
  unloadAsync: () => {
    console.log('No sounds loaded to be unloaded');
  },
};

export const AudioContext = React.createContext({
  clickSound: unloadedSound,
  alarmSound: unloadedSound,
});

export default function App() {
  const [audio, setAudio] = useState({
    clickSound: unloadedSound,
    alarmSound: unloadedSound,
  });


  useEffect(() => {
    (async function loadClickSound() {
      try {
        const { sound: click } = await Audio.Sound.createAsync();
        const { sound: alarm } = await Audio.Sound.createAsync();

        console.log('Sounds Loaded!');
        setAudio({ clickSound: click, alarmSound: alarm });
      } catch (err) {
        console.error('Error when trying to load sounds: ', err);
      }
    })();

    return () => {
      audio.clickSound.unloadAsync();
      audio.alarmSound.unloadAsync();
    };
  }, []);

  return (
    <AudioContext.Provider value={audio}>
      <NavigationContainer>
        <PomoTimer />
      </NavigationContainer>
    </AudioContext.Provider>
  );
}
