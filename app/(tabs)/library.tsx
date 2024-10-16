import { useState, useEffect } from "react";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Header } from "@/components/Header";
import { Collapsible } from "@/components/Collapsible";
import { useSelector, useDispatch } from "react-redux";
import {
    selectBook,
  setBooks,
  setSelectedAudio,
  setAudios,
  removeBookSelection
} from "@/features/library/librarySlice";

import BookModal from "@/components/BookModal";
import AddButton from "@/components/AddButton";
import AddBookModal from "@/components/AddBookModal";

const API_URL = "http://192.168.29.82:3000";


function Library() {
  const dispatch = useDispatch();

  const [isRefreshing, setIsRefreshing] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);

  const library = useSelector((state: any) => state.library);
  const auth = useSelector((state: any) => state.auth);


  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${API_URL}/books`);
      dispatch(setBooks(response.data));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAudios = async () => {
    try {
      const response = await axios.get(`${API_URL}/audios`);
      dispatch(setAudios(response.data));
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchBooks();
    fetchAudios();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    console.log("refreshing new");
    await fetchBooks();
    await fetchAudios();

    setIsRefreshing(false);
  };

  return (
    <ThemedView style={{height: "100%"}}>
      <SafeAreaView>
        <FlatList
          ListHeaderComponent={
            <>
              <Header heading={"Library"} />
              <AddBookModal />
              <BookModal />
            </>
          }
          data={library.books}
          id={library.books.bookId}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                // console.log("item", item);
                console.log(library.selectedAudio);
                dispatch(selectBook(item))
              }}
              style={styles.bookButton}
            >
              <ThemedText style={{textAlign: "center", fontSize: 18 }}>{item.title}</ThemedText>
            </TouchableOpacity>
          )}
          style={{ height: "100%" }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                handleRefresh();
              }}
            />
          }
        />
        <AddButton />
      </SafeAreaView>
    </ThemedView>
  );
}

export default Library;

const styles = StyleSheet.create({
  bookButton: {
    padding: 20,
    margin: 10,
    borderRadius: 10,
  },
});
