import { StyleSheet, View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Início</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'flex-start',                
    backgroundColor: '#f0f0f0',  
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingTop: 40,              
    paddingLeft: 16, 
  },
});
