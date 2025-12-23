import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import {
  fetchAllInjuryRecords,
  InjuryRecord,
} from "../../services/injuryRecordService";
import { fetchAthleteByID } from "../../services/athleteService";
import { supabase } from "../../scripts/supabase";

import { styles } from "../../css/notification";

export default function NotificationScreen() {
  const [records, setRecords] = useState<InjuryRecord[]>([]);
  const [expandedID, setExpandedID] = useState<number | null>(null);
  const [athleteNames, setAthleteNames] = useState<{ [key: number]: string }>(
    {}
  );
  const router = useRouter();

  useEffect(() => {
  loadRecords();

  const channel = supabase
    .channel("injury-records-realtime")
    .on(
      "postgres_changes",
      {
        event: "*", 
        schema: "public",
        table: "t_injury_record",
      },
      async () => {

        await loadRecords();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);


  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setExpandedID(null);
      };
    }, [])
  );

  async function loadRecords() {
  const records = await fetchAllInjuryRecords();

  // Ordena do mais recente para o mais antigo pelo ID
  const sortedRecords = records.sort(
    (a, b) => b.injuryRecordID - a.injuryRecordID
  );

  // Adiciona os nomes dos atletas
  const withNames: (InjuryRecord & { athleteName: string })[] = [];

  for (const record of sortedRecords) {
    const athlete = await fetchAthleteByID(record.athleteID);
    withNames.push({
      ...record,
      athleteName: athlete?.name ?? `Athlete ${record.athleteID}`,
    });
  }

  setRecords(withNames);
}


  function toggleExpand(id: number) {
    setExpandedID(expandedID === id ? null : id);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Notificações</Text>

      {records.map((item) => {
        const expanded = expandedID === item.injuryRecordID;
        const athleteName =
          athleteNames[item.injuryRecordID] || `Athlete ${item.athleteID}`;

        return (
          <TouchableOpacity
            key={item.injuryRecordID}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => toggleExpand(item.injuryRecordID)}
          >
            <View style={styles.row}>
              <Text style={styles.sender}>{athleteName}</Text>
              <Text style={styles.date}>{item.dateStart}</Text>
            </View>

            <Text
              style={styles.subject}
              numberOfLines={expanded ? undefined : 3}
              ellipsizeMode={expanded ? "clip" : "tail"}
            >
              {item.resume}
            </Text>

            {expanded && (
              <View style={styles.buttonsRow}>
                <View style={styles.button}>
                  <Button
                    title="Histórico"
                    color="#22333B"
                    onPress={() => {
                      router.push({
                        pathname: "/historical",
                        params: {
                          athleteID: item.athleteID.toString(),
                          athleteName: athleteName,
                        },
                      });
                    }}
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
