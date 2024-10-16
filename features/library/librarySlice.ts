import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Alert } from "react-native";
import { act } from "react-test-renderer";
import { Audio } from "expo-av";


const API_URL = "http://192.168.29.82:3000"

const initialState = <any>{
  selectedBook: null,
  books: [],
  selectedAudio: null,
  audios: [],
  modalVisible: false,
  selectedBookAudios: [],
  isAddingBook: false,
  sound: null,
  audio: null,
  currentlyPlaying: {
    title: "",
    isPlaying: false,
    playbackPosition: 0,
    playbackDuration: 0,
    playbackRef: null,
    audioId: null,
    audioParts: [],
    audioPartIndex: 0,
    pageStart: 0,
    pageEnd: 0,
  },
};

export const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    setCurrentPlaying: (state, action) => {
      state.currentlyPlaying.title = state.selectedBook.title;
      state.currentlyPlaying.audioId = action.payload.audioId;
      state.currentlyPlaying.audioParts = action.payload.audioParts;
      state.currentlyPlaying.isPlaying = action.payload.isPlaying;
      state.currentlyPlaying.audioPartIndex = action.payload.audioPartIndex;
      state.currentlyPlaying.pageStart = action.payload.pageStart;
      state.currentlyPlaying.pageEnd = action.payload.pageEnd;
      state.audio = "https://aiaudiobooks.blob.core.windows.net/audio/f1a006b9-3307-4677-85e3-84947a3ab93b.mp3";

      // this.playAudio();
      // console.log(action.payload)
    },
    setIsAddingBook: (state, action) => {
      state.isAddingBook = action.payload;
    },
    selectBook: (state, action) => {
      state.selectedBook = action.payload;
      state.selectedBookAudios = state.audios.filter((audio: any) => audio.bookId === action.payload.bookId);
      state.modalVisible = true;
    },
    removeBookSelection: (state) => {
      state.modalVisible = false;
      state.selectedBook = null;
      // state.selectedBookAudios = [];
    },
    deleteBook: (state, action) => {
      const deleteBook = async () => {
        try {
          await axios.delete(`${API_URL}/books/${action.payload.bookId}`);

          state.books = state.books.filter((book: any) => book.bookId !== action.payload.bookId);
          state.audios = state.audios.filter((audio: any) => audio.bookId !== action.payload.bookId);
          state.selectedBook = null;
          state.selectedBookAudios = [];
          state.modalVisible = false;

        } catch (error: any) {
          Alert.alert("Error deleting book", error.message);
        }
      }
      deleteBook();

    },
    setBooks: (state, action) => {
      state.books = action.payload;
    },
    setSelectedAudio: (state, action) => {
      state.selectedAudio = action.payload;
    },
    setAudios: (state, action) => {
      state.audios = action.payload;
    },
    togglePlaying: (state) => {
      if (state.currentlyPlaying.audioParts.length === 0) return Alert.alert("No audio to play");
      state.currentlyPlaying.isPlaying = !state.currentlyPlaying.isPlaying
    },
    playForward: (state) => {
      if (state.currentlyPlaying.audioPartIndex === state.currentlyPlaying.audioParts.length - 1) return;
      state.currentlyPlaying.audioPartIndex = state.currentlyPlaying.audioPartIndex + 1;
    },
    playBack: (state) => {
      if (state.currentlyPlaying.audioPartIndex === 0) return;
      state.currentlyPlaying.audioPartIndex = state.currentlyPlaying.audioPartIndex - 1;
    },
    playAudio: (state, action) => {
      const sound = action.payload;
      console.log(action.payload)
      state.sound = sound;
      state.currentlyPlaying.playbackRef = state.sound;
      state.sound.setOnPlaybackStatusUpdate((status:any) => {
        if (status.isLoaded) {
          state.currentlyPlaying.isPlaying = status.isPlaying;
          state.currentlyPlaying.playbackPosition = status.positionMillis;
          state.currentlyPlaying.playbackDuration = status.durationMillis;

          // Automatically unload the sound when it finishes
          if (status.didJustFinish) {
            sound.unloadAsync();
            state.currentlyPlaying.isPlaying = false;
          }
        }
      });
    },
    pauseAudio: (state) => {
        state.currentlyPlaying.isPlaying = false;
    },
    stopAudio: (state) => {
      const stopFunc = async () => {
        if (state.sound) {
          state.sound.stopAsync();
          state.currentlyPlaying.isPlaying = false;
          state.currentlyPlaying.playbackPosition = 0;
        }
      }
      stopFunc()
    },
    setSliderChange: (state, action) => {
      if (state.sound) {
        state.sound.setPositionAsync(action.payload)
          .then(async (status) => {
            if (status.isLoaded) {
                try {
                  await state.sound.setPositionAsync(action.payload);
                } catch (error) {
                  console.log("Error seeking audio:", error);
                }
            }
          })
      }
    },
    setAudioMode: () => {
      const setAudioMode = async () => {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          playThroughEarpieceAndroid: false,
          staysActiveInBackground: true,
          shouldDuckAndroid: false,
        });
      };
      setAudioMode();
    }
  }
});

export const { setAudioMode, setSliderChange, stopAudio, pauseAudio, playAudio, togglePlaying, setCurrentPlaying, selectBook, setBooks, setSelectedAudio, setAudios, removeBookSelection, deleteBook, setIsAddingBook } = librarySlice.actions;
export default librarySlice.reducer;
