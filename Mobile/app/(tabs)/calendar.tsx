import { View, Text, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native"; // <- importante
import { fetchAllReminders, Reminder } from "../../services/reminderService";

import "../../config/calendarLocale";

import { styles } from "../../css/calendar";

export default function HomeScreen() {
  const today = new Date().toISOString().split("T")[0]; 
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [selectedDate, setSelectedDate] = useState<string>(today); 

  useEffect(() => {
    loadReminders();
  }, []);

  // Redefinir para hoje sempre que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      setSelectedDate(today);
    }, [today])
  );

  const loadReminders = async () => {
    const allReminders = await fetchAllReminders();
    setReminders(allReminders);

    const marks = allReminders.reduce((acc, reminder) => {
      acc[reminder.date] = {
        marked: true,
        dotColor: "#ff6347",
      };
      return acc;
    }, {} as Record<string, any>);

    setMarkedDates(marks);
  };

  const remindersOfSelectedDate = reminders.filter(
    (r) => r.date === selectedDate
  );

  return (
    <View style={styles.container}>
      {/* CALENDAR */}
      <View style={styles.rectangleWrapper}>
        <View style={styles.rectangle}>
          <Text style={styles.title}>Calendário</Text>

          <Calendar
            style={styles.calendar}
            hideExtraDays={true}
            markedDates={{
              ...markedDates,
              [selectedDate]: {
                ...markedDates[selectedDate],
                selected: true,
                selectedColor: "#ff6347",
              },
            }}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            theme={{
              backgroundColor: "#22333b",
              calendarBackground: "#22333b",
              textSectionTitleColor: "#ffffff",
              dayTextColor: "#ffffff",
              monthTextColor: "#ffffff",
              arrowColor: "#ffffff",
              todayTextColor: "#ff6347",
            }}
          />
        </View>
      </View>

      {/* REMINDERS FOR SELECTED DAY */}
      <View style={styles.remindersContainer}>
        <Text style={styles.remindersTitle}>
          {selectedDate ? `Lembrete de ${selectedDate}` : "Selecione um dia"}
        </Text>

        <ScrollView style={styles.reminderList}>
          {selectedDate && remindersOfSelectedDate.length === 0 && (
            <Text style={styles.noRemindersText}>
              Nenhum lembrete neste dia
            </Text>
          )}

          {remindersOfSelectedDate.map((r) => (
            <View key={r.reminderID} style={styles.reminderRow}>
              {/* Lado esquerdo: hora */}
              <View style={styles.timeBox}>
                <Text style={styles.timeText}>{r.timeStart?.slice(0,5)}</Text>
                <Text style={styles.timeText}>{r.timeEnd?.slice(0,5)}</Text>
              </View>

              {/* Lado direito: title */}
              <View style={styles.titleBox}>
                <Text style={styles.titleText}>{r.title}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
