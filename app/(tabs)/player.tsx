import {useState} from 'react';
import { FlatList, RefreshControl, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Header } from '@/components/Header';
import AddBookModal from '@/components/AddBookModal';
import AddButton from '@/components/AddButton';
import BookModal from '@/components/BookModal';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from "react-native";
import {togglePlaying} from '@/features/library/librarySlice';
import { libraryFunc } from '@/lib/functions';

export default function Player() {

    const dispatch = useDispatch();
    const library = useSelector((state: any) => state.library);
    
    const colorScheme = useColorScheme();


    return (
        <ThemedView style={{height: "100%"}}>
            <SafeAreaView style={{height: "100%"}}>
                {/* <ScrollView> */}
                    <Header heading={"Player"} />
                    <ThemedView style={{justifyContent: 'space-between', flexGrow: 1, paddingVertical: 64, paddingHorizontal: 24}}>

                        {/*Selected book title*/}
                        <ThemedView>
                            <ThemedText type={"subtitle"} style={{textAlign: "center"}}>
                                {
                                    library.currentlyPlaying.title !== "" ? library.currentlyPlaying.title : "No audio selected"
                                }
                            </ThemedText>
                            <ThemedText type={"default"} style={{textAlign: "center"}}>
                                {
                                    library.currentlyPlaying.audioId ? "Page " + library.currentlyPlaying.pageStart + " - " + library.currentlyPlaying.pageEnd : null
                                }
                            </ThemedText>
                        </ThemedView>

                        {/*Audio parts*/}
                        <ThemedView>
                            <ThemedText type={"subtitle"} style={{textAlign: "center", top: -24}}>Parts</ThemedText>
                            <FlatList
                                data={library.currentlyPlaying.audioParts}
                                key={library.currentlyPlaying.audioParts.audioPartId}
                                style={{flexGrow: 0}}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            // dispatch(setSelectedAudioId(item.bookId));
                                        }}
                                    >
                                        <ThemedText style={{textAlign: "center"}}>Part {item.part}</ThemedText>
                                    </TouchableOpacity>
                                )}
                            />
                        </ThemedView>
                        

                        {/*Player controls*/}
                        <ThemedView style={{flexDirection: "row", justifyContent: "center", gap: 64, alignItems: "center"}}>
                            <TouchableOpacity>
                                <Ionicons name="play-back" size={30} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                    dispatch(togglePlaying());
                                    library.currentlyPlaying.isPlaying ? libraryFunc.pauseAudio({library, dispatch}) : libraryFunc.playAudio({library, dispatch});
                                }}>
                                <Ionicons name={library.currentlyPlaying.isPlaying ? "pause-circle" : "play-circle"} size={48} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Ionicons name="play-forward" size={30} color="white" />
                            </TouchableOpacity>
                        </ThemedView>
                    </ThemedView>
                {/* </ScrollView> */}
            </SafeAreaView>
        </ThemedView>
    )
}
