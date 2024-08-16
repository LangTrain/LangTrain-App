import { StyleSheet, Text, View, Pressable } from 'react-native';
import { db } from '../../firebase';

export default function QuizLevel({ navigation }) {

  const handlePress = (difficulty) => {
    // Navigate to the quiz screen with the selected difficulty
    navigation.navigate('Quiz', { difficulty });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose the Difficulty</Text>

      <Pressable style={styles.button} onPress={() => handlePress('Easy')}>
        <Text style={styles.buttonText}>Easy</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => handlePress('Medium')}>
        <Text style={styles.buttonText}>Medium</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => handlePress('Hard')}>
        <Text style={styles.buttonText}>Hard</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', 
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF', 
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginVertical: 10,
    width: '80%', 
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', 
    fontSize: 18,
    fontWeight: 'bold',
  },
});
