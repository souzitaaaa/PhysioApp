import { StyleSheet, View, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.rectangleWrapper}>
        <View style={styles.rectangle}>
          <Text style={styles.title}>Calendário</Text>

          <Calendar
            style={styles.calendar}
            hideExtraDays={true} 
            theme={{
              backgroundColor: '#22333b',
              calendarBackground: '#22333b',
              textSectionTitleColor: '#ffffff',
              dayTextColor: '#ffffff',
              monthTextColor: '#ffffff',
              arrowColor: '#ffffff',
              todayTextColor: '#ff6347',
            }}
          />
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
    height: '60%',
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
    color: '#ffffff',
    paddingTop: 40,
    paddingLeft: 16,
  },
  calendar: {
    borderRadius: 16,
  },
});
