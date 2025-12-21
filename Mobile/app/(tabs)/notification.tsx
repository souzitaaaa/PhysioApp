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

import { fetchAllInjuryRecords, InjuryRecord } from "../../services/injuryRecordService";
import { fetchAthleteByID } from "../../services/athleteService";

import { styles } from "../../css/notification";


export default function NotificationScreen() {
  const [records, setRecords] = useState<InjuryRecord[]>([]);
  const [expandedID, setExpandedID] = useState<number | null>(null);
  const [athleteNames, setAthleteNames] = useState<{ [key: number]: string }>({});
  const router = useRouter();

  // Carregar os registros ao montar a tela
  useEffect(() => {
    loadRecords();
  }, []);

  // Limpar o expandedID quando a tela perder o foco
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setExpandedID(null);
      };
    }, [])
  );

  async function loadRecords() {
    const result = await fetchAllInjuryRecords();
    setRecords(result);

    const names: { [key: number]: string } = {};
    for (const record of result) {
      const athlete = await fetchAthleteByID(record.athleteID);
      names[record.injuryRecordID] = athlete ? athlete.name : `Athlete ${record.athleteID}`;
    }
    setAthleteNames(names);
  }

  function toggleExpand(id: number) {
    setExpandedID(expandedID === id ? null : id);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Notificações</Text>

      {records.map((item) => {
        const expanded = expandedID === item.injuryRecordID;
        const athleteName = athleteNames[item.injuryRecordID] || `Athlete ${item.athleteID}`;

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

