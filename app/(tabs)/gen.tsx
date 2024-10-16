import { Header } from "@/components/Header";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://192.168.29.82:3000";

export default function Gen() {
  const dispatch = useDispatch();
  const library = useSelector((state: any) => state.library);


  const [book, setBook] = useState({
    title: "",
    bookId: "",
    pageStart: "",
    pageEnd: "",
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const genAudioHandle = async () => {
    console.log("Generating audio");
    console.log(book);
    if (book.title === "" || book.pageStart === "" || book.pageEnd === "") {
      return Alert.alert("Please fill all the fields");
    }

    setIsGenerating(true);

    try {
      const response = await axios.post(`${API_URL}/generate/audio`, book);
      Alert.alert("Audio generated successfully");
      console.log(response.data);
    } catch (error) {
      Alert.alert("Error generating audio");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ThemedView style={{ height: "100%" }}>
      <SafeAreaView>
        <FlatList
          ListHeaderComponent={<Header heading={"AI Gen"} />}
          style={{ paddingHorizontal: 24, height: "100%" }}
          data={["Books", "Pages", "Info", " "]}
          renderItem={({ item }) => (
            <ThemedView style={{ marginBottom: 32 }}>
              <ThemedText type={"subtitle"} style={{ marginBottom: 8 }}>
                {item}
              </ThemedText>
              {item === "Books" ? (
                <FlatList
                  data={library.books}
                  keyExtractor={(item) => item.bookId}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setBook({
                          ...book,
                          title: item.title,
                          bookId: item.bookId,
                        });
                      }}
                    >
                      <ThemedText
                        type={"link"}
                        style={{ textAlign: "center", fontSize: 18 }}
                      >
                        {item.title}
                      </ThemedText>
                    </TouchableOpacity>
                  )}
                />
              ) : null}
              {item === "Pages" ? (
                <ThemedView style={{ gap: 12 }}>
                  <ThemedView
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <ThemedText>Page start : </ThemedText>
                    <TextInput
                      placeholder="Start"
                      keyboardType="number-pad"
                      style={styles.textInput}
                      value={book.pageStart}
                      onChangeText={(e) => {
                        setBook({ ...book, pageStart: e });
                      }}
                    />
                  </ThemedView>

                  <ThemedView
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <ThemedText>Page end : </ThemedText>
                    <TextInput
                      placeholder="End"
                      keyboardType="number-pad"
                      style={styles.textInput}
                      value={book.pageEnd}
                      onChangeText={(e) => {
                        setBook({ ...book, pageEnd: e });
                      }}
                    />
                  </ThemedView>
                </ThemedView>
              ) : null}
              {item === "Info" ? (
                <ThemedView>
                  <ThemedText>Book - {book.title}</ThemedText>
                  <ThemedText>Page start - {book.pageStart}</ThemedText>
                  <ThemedText>Page end - {book.pageEnd}</ThemedText>
                </ThemedView>
              ) : null}
              {item === " " ? (
                <ThemedView
                  style={{
                    flexDirection: "row-reverse",
                    justifyContent: "space-evenly",
                  }}
                >
                  <TouchableOpacity
                    onPress={genAudioHandle}
                    disabled={isGenerating}
                  >
                    <ThemedText type={"link"}>Generate</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setBook({
                        title: "",
                        bookId: "",
                        pageStart: "",
                        pageEnd: "",
                      });
                    }}
                  >
                    <ThemedText type={"link"}>Clear</ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              ) : null}
            </ThemedView>
          )}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    color: "#fff",
    backgroundColor: "#222",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
});
