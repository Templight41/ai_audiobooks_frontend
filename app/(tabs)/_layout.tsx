import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";

import { useSelector, useDispatch } from "react-redux";
import { playAudio, pauseAudio, stopAudio, setSliderChange, setAudioMode } from "@/features/library/librarySlice";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const dispatch = useDispatch();

  const library = useSelector((state: any) => state.library);

  const { audio, sound } = library;

  // const setAudioMode = async () => {
  //   await Audio.setAudioModeAsync({
  //     playsInSilentModeIOS: true,
  //     playThroughEarpieceAndroid: false,
  //     staysActiveInBackground: true,
  //     shouldDuckAndroid: false,
  //   });
  // };

  React.useEffect(() => {
    dispatch(setAudioMode());
  }, []);

  const playAudioHandle = async () => {
    dispatch(playAudio());
  };

  const pauseAudioHandle = async () => {
    if (sound) {
      dispatch(pauseAudio());
    }
  };

  const stopAudioHandle = async () => {
    dispatch(stopAudio());
  };

  const seekAudio = async (position) => {
    if (sound) {
      try {
        await sound.setPositionAsync(position);
      } catch (error) {
        console.log("Error seeking audio:", error);
      }
    }
  };

  const handleSliderChange = (value:any) => {
    dispatch(setSliderChange(value));
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "code-slash" : "code-slash-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
