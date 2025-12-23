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
import { supabase } from "@/scripts/supabase";

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

    // --- Realtime: Injuries ---
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

    // --- Realtime: Reminders ---
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
      "jan",
      "fev",
      "mar",
      "abr",
      "mai",
      "jun",
      "jul",
      "ago",
      "set",
      "out",
      "nov",
      "dez",
    ];

    return `${day} ${months[month - 1]}`;
  }

  async function loadNotifications() {
    const records = await fetchAllInjuryRecords();

    const sortedRecords = records.sort(
      (a, b) => b.injuryRecordID - a.injuryRecordID

    );
    
    const latest = sortedRecords.slice(0,4);

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
      const [year, month, day] = event.date.split("-").map(Number);
      const [hour, minute] = (event.timeStart ?? "00:00")
        .split(":")
        .map(Number);

      const eventDateTime = new Date(year, month - 1, day, hour, minute);

      return eventDateTime >= now;
    });

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
          <View key={event.reminderID} style={styles.reminderRow}>
            {/* Retângulo azul (data + horas) */}

              <View style={styles.timeBox}>
                <Text style={styles.timeText}>
                  {formatDateShort(event.date)}
                </Text>

                <Text style={styles.timeText}>
                  {event.timeStart?.slice(0, 5)}
                  {event.timeEnd ? ` - ${event.timeEnd.slice(0, 5)}` : ""}
                </Text>
              </View>

            {/* Retângulo branco (título) */}
            <View style={styles.titleBox}>
              <Text style={styles.titleText} numberOfLines={2}>
                {event.title}
              </Text>
            </View>
          </View>
        ))}
      </TouchableOpacity>
    </View>
  );
}
