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
import { supabase } from "../../scripts/supabase";

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

    const injuryChannel = supabase
      .channel("injuries-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "t_injury_record" },
        async () => {
          await loadNotifications();
        }
      )
      .subscribe();

    const remindersChannel = supabase
      .channel("reminders-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "t_reminder" },
        async () => {
          await loadUpcomingEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(injuryChannel);
      supabase.removeChannel(remindersChannel);
    };
  }, []);

  function formatDateShort(dateString: string) {
    const [year, month, day] = dateString.split("-").map(Number);

    const months = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    return `${day} ${months[month - 1]}`;
  }

  async function loadNotifications() {
    const records = await fetchAllInjuryRecords();

    const sortedRecords = records.sort(
      (a, b) => b.injuryRecordID - a.injuryRecordID
    );

    const latest = sortedRecords.slice(0, 4);
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureEvents = allReminders.filter((event) => {
      const [year, month, day] = event.date.split("-").map(Number);
      const eventDate = new Date(year, month - 1, day);
      return eventDate >= today;
    });

    const sorted = futureEvents.sort((a, b) => {
      const [y1, m1, d1] = a.date.split("-").map(Number);
      const [y2, m2, d2] = b.date.split("-").map(Number);

      const dateA = new Date(y1, m1 - 1, d1);
      const dateB = new Date(y2, m2 - 1, d2);

      return dateA.getTime() - dateB.getTime();
    });

    setUpcomingEvents(sorted.slice(0, 4));
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
            <Text style={styles.resume} numberOfLines={1} ellipsizeMode="tail">
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
          <View key={event.reminderID} style={styles.reminderRow}>
            {/* Caixa azul (data) */}
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>
                {formatDateShort(event.date)}
              </Text>
            </View>

            {/* Caixa branca (título) */}
            <View style={styles.titleBox}>
              <Text style={styles.titleText} numberOfLines={1}>
                {event.title}
              </Text>
            </View>
          </View>
        ))}
      </TouchableOpacity>
    </View>
  );
}
