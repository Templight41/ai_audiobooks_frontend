import { setAudioMode, setSliderChange, stopAudio, pauseAudio, playAudio, togglePlaying, setCurrentPlaying, selectBook, setBooks, setSelectedAudio, setAudios, removeBookSelection, deleteBook, setIsAddingBook } from "@/features/library/librarySlice";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "react-native";
import { Audio } from "expo-av";


export const libraryFunc = {
    setCurrentPlaying: async (payload:any) => {
        await payload.dispatch(setCurrentPlaying(payload));
        await libraryFunc.playAudio(payload);
    },
    playAudio: async (payload:any) => {

        if (!payload.library.audio) return;

        try {
          if (!payload.library.sound) {

            const { sound } = await Audio.Sound.createAsync(
              { uri: payload.library.audio },
              { shouldPlay: true }
            );

            sound.setOnPlaybackStatusUpdate((status:any) => {
                if (status.isLoaded) {
                //   state.currentlyPlaying.isPlaying = status.isPlaying;
                //   state.currentlyPlaying.playbackPosition = status.positionMillis;
                //   state.currentlyPlaying.playbackDuration = status.durationMillis;
        
                  // Automatically unload the sound when it finishes
                  if (status.didJustFinish) {
                    sound.unloadAsync();
                    // state.currentlyPlaying.isPlaying = false;
                  }
                }
              });
            // console.log(sound)

            // await payload.dispatch(playAudio(sound))
            await sound.playAsync();
          }

        } catch (error) {
          console.error("Error playing audio:", error);
          Alert.alert("Error", "Failed to play audio.");
        }
    },
    pauseAudio: async (payload:any) => {
        console.log(payload.library.audio)
        if (payload.library.sound) {
          await payload.library.sound.pauseAsync();
          payload.dispatch(pauseAudio());
        }
    },
}