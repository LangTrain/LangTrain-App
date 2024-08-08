import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function Result({ navigation }) {
    const route = useRoute();
    const { score, totalQuestions } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quiz Results</Text>
            <Text style={styles.resultText}>
                You scored {score} out of {totalQuestions}!
            </Text>

            {/* back to log in for now*/}
            <Pressable style={styles.button} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Back to Home</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    resultText: {
        fontSize: 22,
        color: '#444',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 20,
        width: '60%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
