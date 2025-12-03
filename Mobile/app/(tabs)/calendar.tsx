import { StyleSheet, View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.rectangleWrapper}>
        <View style={styles.rectangle}>
      <Text style={styles.title}>Calendário</Text>
      </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',

  },
  rectangleWrapper: {
    width: '100%',
    height: '50%',
    overflow: 'hidden',        
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 16,
  },
  rectangle: {
    flex: 1,
    backgroundColor: '#22333b',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingTop: 40,
    paddingLeft: 16,
    color: '#ffffff'
  },
});
