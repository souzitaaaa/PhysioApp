import { View, Text, TouchableOpacity, Button } from "react-native";
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

// Notification item type
type NotificationItem = InjuryRecord & {
  athleteName: string;
};

export default function HomeScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Reminder[]>([]);
  const [userName, setUserName] = useState<string | null>(null);

  const router = useRouter();

  // Get logged user name
  useEffect(() => {
    const fetchUserName = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return;

      const authUserID = user.id;

      // Fetch user data
      const { data, error: userError } = await supabase
        .from("t_user")
        .select("name") 
        .eq("auth_userID", authUserID)
        .single();

      if (userError || !data) return;

      setUserName(data.name);
    };

    fetchUserName();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Erro ao sair:", error);
    } else {
      setUserName(null);
      router.replace("/login"); 
    }
  };

  // Load notifications and reminders
  useEffect(() => {
    loadNotifications();
    loadUpcomingEvents();

    // Realtime injuries listener
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

    // Realtime reminders listener
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

  // Format short date
  function formatDateShort(dateString: string) {
    const [year, month, day] = dateString.split("-").map(Number);
    const months = [
      "Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez",
    ];
    return `${day} ${months[month - 1]}`;
  }

  async function loadNotifications() {
    const records = await fetchAllInjuryRecords();

    const sortedRecords = records.sort(
      (a, b) => b.injuryRecordID - a.injuryRecordID
    );

    // Get latest four
    const latest = sortedRecords.slice(0, 4);
    const withNames: NotificationItem[] = [];

    // Attach athlete names
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

    // Filter future events
    const futureEvents = allReminders.filter((event) => {
      const [year, month, day] = event.date.split("-").map(Number);
      const eventDate = new Date(year, month - 1, day);
      return eventDate >= today;
    });

    // Sort by nearest date
    const sorted = futureEvents.sort((a, b) => {
      const [y1, m1, d1] = a.date.split("-").map(Number);
      const [y2, m2, d2] = b.date.split("-").map(Number);
      return new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime();
    });

    setUpcomingEvents(sorted.slice(0, 4));
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {/* Header title */}
        <Text style={styles.title}>Início</Text>

        {/* Logout button */}
        <TouchableOpacity onPress={handleLogout}>
          <Text style={{ color: "red", fontSize: 18, paddingTop: 40,paddingRight: 16,}}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Greeting */}
      <Text style={styles.titleName}>
        {userName ? `Olá, ${userName}` : "A carregar..."}
      </Text>

      {/* Notifications card */}
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

      {/* Eevents card */}
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => router.push("/calendar")}
      >
        <Text style={styles.notificationTitle}>Próximos Eventos</Text>

        {upcomingEvents.map((event) => (
          <View key={event.reminderID} style={styles.reminderRow}>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>
                {formatDateShort(event.date)}
              </Text>
            </View>

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
