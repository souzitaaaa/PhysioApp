import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import {
  fetchAllInjuryRecords,
  InjuryRecord,
} from "../../services/injuryRecordService";
import { fetchAthleteByID } from "../../services/athleteService";

import { styles } from "../../css/index";

type NotificationItem = InjuryRecord & {
  athleteName: string;
};

export default function HomeScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadNotifications();
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
        <Text style={styles.notificationTitle}>Proximos Eventos</Text>
      </TouchableOpacity>
    </View>
  );
}
