import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import axios from "axios";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

const API_URL = "http://192.168.29.82:3000";

const App = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    name: "",
    uri: null,
    type: "application/pdf"
  });

  const openPicker = async () => {
    const result:any = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });

    if (!result.cancelled) {
      setForm({uri: result.assets[0].uri, name: result.assets[0].name, title: result.assets[0].name});
      console.log("file selected" + JSON.stringify(result.assets[0]));
    } else {
      console.log("file not changed - " + JSON.stringify(result, null, 2));
    }
  };



  const [bookInfo, setBookInfo] = useState({
    pdfName: "",
    bookId: "",
    pageStart: "",
    pageEnd: "",
  });
  const [audio, setAudio] = useState(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const playbackRef = useRef(null);
  const [books, setBooks] = useState([]);
  const [audios, setAudios] = useState([]);

  // const handleFileChange = async () => {
  //   try {
  //     const res = await DocumentPicker.getDocumentAsync({
  //       type: "application/pdf",
  //     });
  //     if (res.canceled === false) {
  //       setFile(res.assets[0]);
  //       console.log("Selected file:", res);
  //     }
  //   } catch (err) {
  //     Alert.alert("Error picking file:", err.message);
  //   }
  // };

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await axios.get(`${API_URL}/books`);
      setBooks(response.data);
    };

    const fetchAudios = async () => {
      const response = await axios.get(`${API_URL}/audios`);
      setAudios(response.data);
    };

    fetchBooks();
    fetchAudios();
  }, []);

  const uploadFile = async () => {
    console.log(JSON.stringify(form, null, 2));
    if (!form.uri) {
      Alert.alert("Please select a file to upload!");
      return;
    }

    const formData = {
      title: form.title,
      name: form.name,
      uri: form.uri,
      type: form.type,
      fileType: "pdf",
    }
    // formData.append("file", {
    //   uri: form.uri,
    //   name: form.name,
    //   type: form.mimeType,
    // });
    // console.log("uploading")
    // formData.append("fileType", "pdf");

    console.log(JSON.stringify(formData));

    try {
      const response = await axios.post(`${API_URL}/upload/book`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setBooks((prevBooks) => [...prevBooks, response.data]);
      console.log("File uploaded to server:", response.data);
    } catch (error) {
      console.log("Error uploading file", error.message);
    }
  };

  const bookSelect = (book) => {
    setBookInfo({
      ...bookInfo,
      pdfName: book.fileName,
      bookId: book.bookId,
    });
  };

  const audioSelect = (audio) => {
    axios.get(`${API_URL}/audios/${audio.audioId}`).then((res) => {
      setAudio(res.data.audioParts[0].audioPartUrl);
    });
  };

  const genAudio = async () => {
    if (!bookInfo.pdfName || !bookInfo.pageStart) {
      Alert.alert("Please select a book and page range to generate audio!");
      return;
    }
    if (!bookInfo.pageEnd || bookInfo.pageEnd < bookInfo.pageStart) {
      setBookInfo((prevState) => ({
        ...prevState,
        pageEnd: prevState.pageStart,
      }));
    }

    try {
      const response = await axios.post(`${API_URL}/generate/audio`, bookInfo);
      setAudio(response.data.audioUrl);
    } catch (error) {
      Alert.alert("Error generating audio", error.message);
    }
  };

  const setAudioMode = async () => {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
      shouldDuckAndroid: false,
    });
  };

  useEffect(() => {
    setAudioMode();
  }, []);

  const playAudio = async () => {
    if (!audio) return;

    try {
      if(!sound) {

        const { sound } = await Audio.Sound.createAsync(
          { uri: audio },
          { shouldPlay: true }
        );
      setSound(sound);
      playbackRef.current = sound;
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setIsPlaying(status.isPlaying);
          setPlaybackPosition(status.positionMillis);
          setPlaybackDuration(status.durationMillis);
          
          // Automatically unload the sound when it finishes
          if (status.didJustFinish) {
            sound.unloadAsync();
            setIsPlaying(false);
          }
        }
      });
    }

      await sound.playAsync();
    } catch (error) {
      console.error("Error playing audio:", error);
      Alert.alert("Error", "Failed to play audio.");
    }
  };

  const pauseAudio = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      setPlaybackPosition(0);
    }
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
  

  const handleSliderChange = (value) => {
    if (sound) {
      sound.getStatusAsync().then((status) => {
        if (status.isLoaded) {
          seekAudio(value);
        } else {
          console.log("Audio is not loaded yet.");
        }
      });
    }
  };
  

  // Unload the sound when the component unmounts
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.uploadSection}>
        <Button title="Select PDF" onPress={openPicker} />
        <Button title="Upload File" onPress={uploadFile} />
      </ThemedView>

      <ThemedText style={styles.heading}>Books</ThemedText>
      <FlatList
        data={books}
        keyExtractor={(item) => item.bookId}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => bookSelect(item)}
          >
            <Text style={styles.bookTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      <ThemedText style={styles.heading}>Audios</ThemedText>
      <FlatList
        data={audios}
        keyExtractor={(item) => item.audioId}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => audioSelect(item)}
          >
            <ThemedText style={styles.bookTitle}>{item.audioId}</ThemedText>
          </TouchableOpacity>
        )}
      />

      <ThemedView style={styles.inputContainer}>
        <ThemedText>Page Start</ThemedText>
        <TextInput
          style={styles.input}
          value={bookInfo.pageStart}
          onChangeText={(text) => setBookInfo({ ...bookInfo, pageStart: text })}
        />

        <ThemedText>Page End</ThemedText>
        <TextInput
          style={styles.input}
          value={bookInfo.pageEnd}
          onChangeText={(text) => setBookInfo({ ...bookInfo, pageEnd: text })}
        />
      </ThemedView>

      <ThemedText style={styles.heading}>Book Info</ThemedText>
      <ThemedText>PDF Name: {bookInfo.pdfName}</ThemedText>
      <ThemedText>Page Start: {bookInfo.pageStart}</ThemedText>
      <ThemedText>Page End: {bookInfo.pageEnd}</ThemedText>

      <Button title="Generate Audio" onPress={genAudio} />

      <ThemedView>
        <ThemedText>Generated Audio:</ThemedText>
        <Button
          title={isPlaying ? "Pause" : "Play"}
          onPress={isPlaying ? pauseAudio : playAudio}
        />
        <Button title="Stop" onPress={stopAudio} />
        <Slider
          style={styles.slider}
          value={playbackPosition}
          minimumValue={0}
          maximumValue={playbackDuration}
          onValueChange={handleSliderChange}
          thumbTintColor="#FF5733"
          minimumTrackTintColor="#FF5733"
          maximumTrackTintColor="#d3d3d3"
        />
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  uploadSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bookButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginVertical: 5,
    borderRadius: 5,
  },
  bookTitle: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  input: {
    borderBottomWidth: 1,
    padding: 5,
    width: "40%",
    color: "#fff",
  },
  slider: {
    width: "100%",
    height: 40,
    marginVertical: 10,
  },
});

export default App;