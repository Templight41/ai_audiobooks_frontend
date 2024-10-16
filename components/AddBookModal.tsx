import { useDispatch, useSelector } from "react-redux";
import Modal from "react-native-modal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TouchableOpacity, View, StyleSheet, TextInput, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import {
  setSelectedAudio,
  deleteBook,
  setIsAddingBook,
} from "@/features/library/librarySlice";
import { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";


const API_URL = "http://192.168.29.82:3000";


export default function AddBookModal() {
  const dispatch = useDispatch();

  const library = useSelector((state: any) => state.library);

  const [form, setForm] = useState<any>({
    title: "",
    uri: null
  })

  const [isUploading, setIsUploading] = useState(false);

  const filePicker = async () => {
    console.log("file picker");
    const result:any = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
    })

    if (!result.canceled) {
      setForm({...form, ...result.assets[0]});
    } else {
        console.log("file not changed - " + JSON.stringify(result, null, 2));
    }
  }

  const submit = async () => {
    
    if(!form.uri || form.title === "") {
        return Alert.alert("Please fill all the fields");
    }

    setIsUploading(true);

    try {

      FileSystem.uploadAsync(`${API_URL}/upload/books`, form.uri, {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: "file",
          parameters: {
              title: form.title,
          }
      }).then((response) => {
          console.log("upload response", response);
      }).catch((error) => {
          console.error("upload error", error);
      });
        
    } catch (error:any) {
        Alert.alert("Error uploading book", error.message);
        console.error(error);
    } finally {
        setForm({
            title: "",
            uri: null
        })
        setIsUploading(false);
        dispatch(setIsAddingBook(false));
    }


  }

  return (
    <View>
      <Modal
        isVisible={library.isAddingBook}
        onSwipeComplete={() => {
          dispatch(setIsAddingBook(false));
        }}
        swipeDirection="down"
      >
        <ThemedView style={{ padding: 32, borderRadius: 8 }}>
          <ThemedText
            type={"subtitle"}
            style={{ textAlign: "center", fontSize: 24 }}
          >
            Add Book
          </ThemedText>
          <ThemedView style={{ gap: 24, padding: 24 }}>
            <ThemedView style={{gap: 12}}>
                <ThemedText>Title</ThemedText>
                <TextInput placeholder="Book Name" style={styles.textInput} value={form.title} onChangeText={(e) => setForm({...form, title: e})} />
            </ThemedView>
            <ThemedView>
                <TouchableOpacity style={styles.button} onPress={filePicker}>
                    <ThemedText type="link" style={{textAlign: "center"}}>{form.uri ? form.name : "Choose File"}</ThemedText>
                </TouchableOpacity>
            </ThemedView>
          </ThemedView>
          <ThemedView
            style={{ flexDirection: "row-reverse", justifyContent: "space-evenly" }}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                dispatch(setIsAddingBook(false));
              }}
            >
              <ThemedText type={"link"} style={{ textAlign: "center" }}>
                Cancel
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={submit}
            >
              <ThemedText type="link">Upload</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </Modal>
    </View>
  );
}

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
