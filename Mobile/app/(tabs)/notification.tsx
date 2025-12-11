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

import { fetchAllInjuryRecords, InjuryRecord } from "../../services/injuryRecordService";
import { fetchAthleteByID } from "../../services/athleteService"; 

export default function NotificationScreen() {
  const [records, setRecords] = useState<InjuryRecord[]>([]);
  const [expandedID, setExpandedID] = useState<number | null>(null);
  const [athleteNames, setAthleteNames] = useState<{ [key: number]: string }>({});
  const router = useRouter();

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    const result = await fetchAllInjuryRecords();
    setRecords(result);

    // buscar os nomes dos atletas
    const names: { [key: number]: string } = {};
    for (const record of result) {
      const athlete = await fetchAthleteByID(record.athleteID);
      if (athlete) {
        names[record.injuryRecordID] = athlete.name;
      } else {
        names[record.injuryRecordID] = `Athlete ${record.athleteID}`;
      }
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
              {item.resume ?? "Sem resumo"}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingTop: 40,
    paddingLeft: 16,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  sender: {
    fontSize: 16,
    fontWeight: "600",
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  subject: {
    fontSize: 15,
    color: "#333",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});
