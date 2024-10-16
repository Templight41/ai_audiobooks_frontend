import { StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

export function Header({heading}: {heading: string}) {
    return (
        <ThemedView style={styles.container}>
            <ThemedText type='title'>{heading}</ThemedText>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    }
});