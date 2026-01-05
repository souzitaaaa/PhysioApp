import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Calendar } from "react-native-calendars";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { fetchAllReminders, Reminder } from "../../services/reminderService";

import "../../config/calendarLocale"; // Calendar locale settings

import { styles } from "../../css/calendar";
import { supabase } from "../../scripts/supabase";
import { fetchAthleteByID } from "../../services/athleteService";

export default function HomeScreen() {
  const today = new Date().toISOString().split("T")[0];
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [loadingReminders, setLoadingReminders] = useState(true);
  const [athletes, setAthletes] = useState<Record<number, string>>({});

  // Load reminders and subscribe to realtime updates
  useEffect(() => {
    loadReminders();

    const channel = supabase
      .channel("reminders-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "t_reminder",
        },
        async () => {
          await loadReminders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Reset selected date when screen is focused
  useFocusEffect(
    useCallback(() => {
      setSelectedDate(today);
    }, [today])
  );

  // Load reminders and mark dates
  const loadReminders = async () => {
    setLoadingReminders(true);

    const allReminders = await fetchAllReminders();
    setReminders(allReminders);

    // Prepare marked dates
    const marks = allReminders.reduce((acc, reminder) => {
      acc[reminder.date] = {
        marked: true,
        dotColor: "#ff6347",
      };
      return acc;
    }, {} as Record<string, any>);
    setMarkedDates(marks);

    setLoadingReminders(false);
  };

  // Filter reminders for selected date
  const remindersOfSelectedDate = reminders.filter(
    (r) => r.date === selectedDate
  );

  // Format date (DD/MM/YYYY)
  function formatDate(dateString: string | Date | null) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-PT"); 
  }

  // Get first and last name from full name
  function getFirstAndLastName(fullName: string) {
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[parts.length - 1]}`;
  }

  return (
    <View style={styles.container}>
      {/* Calendar */}
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

      {/* Reminders for selected day */}
      <View style={styles.remindersContainer}>
        <Text style={styles.remindersTitle}>
          {selectedDate
            ? `Lembrete de ${formatDate(selectedDate)}`
            : "Selecione um dia"}
        </Text>

        <ScrollView style={styles.reminderList}>
          {loadingReminders ? (
            <View style={{ marginTop: 20 }}>
              <ActivityIndicator size="large" color="#22333B" />
            </View>
          ) : (
            <>
              {selectedDate && remindersOfSelectedDate.length === 0 && (
                <Text style={styles.noRemindersText}>
                  Nenhum lembrete neste dia
                </Text>
              )}

              {remindersOfSelectedDate.map((r) => (
                <View key={r.reminderID} style={styles.reminderRow}>
                  {/* Left side athlete name */}
                  <View style={styles.nameBox}>
                    <Text style={styles.nameText}>
                      {getFirstAndLastName(
                        r.t_injury_record?.t_athlete?.name ?? ""
                      )}
                    </Text>
                  </View>

                  {/* Right side reminder title */}
                  <View style={styles.titleBox}>
                    <Text style={styles.titleText}>{r.title}</Text>
                  </View>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
