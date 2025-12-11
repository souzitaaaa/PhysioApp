import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { fetchInjuryRecordsByAthlete, InjuryRecord } from "../../services/injuryRecordService";

export default function HistoricalScreen() {
  const { athleteID, athleteName } = useLocalSearchParams<{ athleteID: string, athleteName: string }>();

  const router = useRouter();

  const [records, setRecords] = useState<InjuryRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (athleteID) loadHistory();
  }, [athleteID]);

  async function loadHistory() {
    setLoading(true);
    const result = await fetchInjuryRecordsByAthlete(Number(athleteID));
    setRecords(result);
    setLoading(false);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Histórico do Atleta</Text>
      
      <View style={styles.card}>
        {/* Cabeçalho com botão voltar */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.Text}>Histórico do Atleta</Text>
            <Text>{athleteName || athleteID}</Text>
          </View>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#000" />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
        </View>

        {/* Loading */}
        {loading && <ActivityIndicator size="small" color="#000" />}


        {/* Lista de registos */}
        {!loading && records.map((item) => (
  <View key={item.injuryRecordID} style={styles.card_note}>
    <Text>{item.title}</Text>
    <Text>
      {item.dateStart } --- {item.dateEnd}
    </Text>
    <Text>Resumo: {item.resume}</Text>
  </View>
))}

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
    marginHorizontal: 1,
    marginTop: 12,
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
    backgroundColor: "#CDCDCD"
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


});
