import { useDispatch, useSelector } from "react-redux";
import Modal from "react-native-modal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { removeBookSelection, setSelectedAudio, deleteBook, setCurrentPlaying } from "@/features/library/librarySlice";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { libraryFunc } from "@/lib/functions";

function BookModal() {
    const dispatch = useDispatch();

    const library = useSelector((state: any) => state.library);

    
    return (
    <View>
      <Modal
        isVisible={library.modalVisible}
        onSwipeComplete={() => {
            dispatch(removeBookSelection());
        }}
        swipeDirection="down"
      >
        <ThemedView style={{padding: 32, borderRadius: 8}}>
          <ThemedText type={"subtitle"} style={{textAlign: "center", fontSize: 18}}>{library.selectedBook ? library.selectedBook.title : null}</ThemedText>
          <ThemedView style={{gap: 12, padding: 24}}>
            {
                library.selectedBookAudios ? library.selectedBookAudios.map((audio: any) => (
                    <TouchableOpacity key={audio.audioId} onPress={(()=> {
                        dispatch(setSelectedAudio(audio));
                        // console.log(audio)
                        libraryFunc.setCurrentPlaying({audioParts: audio.audioParts, audioId: audio.audioId, isPlaying: true, audioPartIndex: 0, pageStart: audio.pageStart, pageEnd: audio.pageEnd, library, dispatch});
                        router.replace("player");
                        dispatch(removeBookSelection());
                    })}>
                        <ThemedText type={"link"} style={{textAlign: "center"}}>{audio.pageStart} - {audio.pageEnd}</ThemedText>
                    </TouchableOpacity>
                )) : <ThemedText>No audios found</ThemedText>
            }
          </ThemedView>
          <ThemedView style={{flexDirection: "row-reverse", justifyContent: "space-evenly"}}>
            <TouchableOpacity style={styles.button} onPress={() => {
                dispatch(removeBookSelection());
            }}>
                <ThemedText type={"link"} style={{textAlign: "center"}}>Close</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => {dispatch(deleteBook(library.selectedBook))}}><ThemedText type="link">Delete</ThemedText></TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </Modal>
    </View>
  );
}

export default BookModal

const styles = StyleSheet.create({
  button: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    // backgroundColor: "#e95434",
    borderRadius: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#111",
    padding: 8,
    backgroundColor: "#111",
    borderRadius: 4,
    color: "#fff",
  },
});
