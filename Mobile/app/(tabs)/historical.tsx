import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import {
  fetchInjuryRecordsByAthlete,
  InjuryRecord,
} from "../../services/injuryRecordService";

export default function HistoricalScreen() {
  const { athleteID, athleteName } = useLocalSearchParams<{
    athleteID: string;
    athleteName: string;
  }>();

  const router = useRouter();

  const [records, setRecords] = useState<InjuryRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    if (athleteID) loadHistory();
  }, [athleteID]);

  async function loadHistory() {
    setLoading(true);
    const result = await fetchInjuryRecordsByAthlete(Number(athleteID));
    setRecords(result);
    setLoading(false);
  }

  function toggleExpand(id: number) {
    setExpanded(expanded === id ? null : id);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Histórico do Atleta</Text>

      <View style={styles.card}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.Text}>Histórico do Atleta</Text>
            <Text>{athleteName || athleteID}</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={20} color="#000" />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
        </View>

        {/* Loading */}
        {loading && <ActivityIndicator size="small" color="#000" />}

        {/* Registos */}
        {!loading &&
          records.map((item) => {
            const isOpen = expanded === item.injuryRecordID;

            return (
              <TouchableOpacity
                key={item.injuryRecordID}
                style={styles.card_note}
                onPress={() => toggleExpand(item.injuryRecordID)}
                activeOpacity={0.7}
              >
                {/* Linha: Nome à esquerda, datas à direita */}
                <View style={styles.rowBetween}>
                  <Text style={styles.noteTitle}>{item.title}</Text>
                  <Text style={styles.noteDates}>
                    {item.dateStart} — {item.dateEnd}
                  </Text>
                </View>

                {/* Conteúdo expandido */}
                {isOpen && (
                  <View style={{ marginTop: 10 }}>
                    <Text style={{ fontWeight: "600" }}>Resumo:</Text>
                    <Text>{item.resume}</Text>

                    <View style={styles.buttonsRow}>
                      <TouchableOpacity style={styles.btn}>
                        <Text style={styles.btnText}>Adicionar Nota</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.btn, { backgroundColor: "#d9534f" }]}
                      >
                        <Text style={styles.btnText}>Acabar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
      </View>
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
    minHeight: 640,
  },
  card_note: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  noteDates: {
    fontSize: 14,
    color: "#555",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 8,
    borderRadius: 16,
    backgroundColor: "#CDCDCD",
  },
  backText: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "500",
  },
  Text: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "600",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  btn: {
    backgroundColor: "#0275d8",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  btnText: {
    color: "#FFF",
    fontWeight: "600",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
