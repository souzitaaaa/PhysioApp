import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import {
  fetchAllInjuryRecords,
  InjuryRecord,
} from "../../services/injuryRecordService";
import { fetchAthleteByID } from "../../services/athleteService";
import { fetchAllReminders, Reminder } from "../../services/reminderService";

import { styles } from "../../css/index";

type NotificationItem = InjuryRecord & {
  athleteName: string;
};

export default function HomeScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Reminder[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadNotifications();
    loadUpcomingEvents();
  }, []);

  async function loadNotifications() {
    const records = await fetchAllInjuryRecords();
    const latest = records.slice(0, 4);
    const withNames: NotificationItem[] = [];

    for (const record of latest) {
      const athlete = await fetchAthleteByID(record.athleteID);
      withNames.push({
        ...record,
        athleteName: athlete?.name ?? `Athlete ${record.athleteID}`,
      });
    }

    setNotifications(withNames);
  }

  async function loadUpcomingEvents() {
    const allReminders = await fetchAllReminders();

    const now = new Date();

    const futureEvents = allReminders.filter((event) => {
      const [year, month, day ] = event.date.split("-").map(Number);
      const [hour, minute ] = (event.timeStart ?? "00:00").split(":").map(Number);

      const eventDateTime = new Date (year, month -1, day, hour, minute);

      return eventDateTime >= now;
    })

    // Ordenar por data e hora
    const sorted = futureEvents.sort((a, b) => {
    const [y1, m1, d1] = a.date.split("-").map(Number);
    const [h1, min1] = (a.timeStart ?? "00:00").split(":").map(Number);
    const dateTimeA = new Date(y1, m1 - 1, d1, h1, min1);

    const [y2, m2, d2] = b.date.split("-").map(Number);
    const [h2, min2] = (b.timeStart ?? "00:00").split(":").map(Number);
    const dateTimeB = new Date(y2, m2 - 1, d2, h2, min2);

    return dateTimeA.getTime() - dateTimeB.getTime();
  });

    setUpcomingEvents(sorted.slice(0, 4)); // pegar os 4 próximos
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Início</Text>

      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => router.push("/notification")}
      >
        <Text style={styles.notificationTitle}>Notificações</Text>

        {notifications.map((item) => (
          <View key={item.injuryRecordID} style={styles.notificationRow}>
            <Text style={styles.athleteName} numberOfLines={1}>
              {item.athleteName}
            </Text>
            <Text style={styles.resume} numberOfLines={2} ellipsizeMode="tail">
              {item.resume}
            </Text>
          </View>
        ))}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => router.push("/calendar")}
      >
        <Text style={styles.notificationTitle}>Próximos Eventos</Text>

        {upcomingEvents.map((event) => (
          <View key={event.reminderID} style={styles.notificationRow}>
            <Text style={styles.athleteName}>
              {event.date} {event.timeStart?.slice(0, 5) ?? "--:--"} 
              {event.timeEnd?.slice(0, 5) ?? "--:--"}
            </Text>
            <Text style={styles.resume} numberOfLines={2} ellipsizeMode="tail">
              {event.title}
            </Text>
          </View>
        ))}
      </TouchableOpacity>
    </View>
  );
}
