import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { setIsAddingBook } from '@/features/library/librarySlice';

export default function AddButton() {
    const dispatch = useDispatch();
  return (
    <TouchableOpacity style={styles.addButton} onPress={() => {dispatch(setIsAddingBook(true))}}>
        <Ionicons name="add" size={30} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#e95434',
        borderRadius: 50,
        padding: 10,
    },
});