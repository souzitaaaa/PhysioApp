import React, { useEffect, useState } from "react";
import {
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

import { fetchNotesByRecord } from "../../services/noteService";

import { styles } from "../../css/historical";

export default function HistoricalScreen() {
  const { athleteID, athleteName } = useLocalSearchParams<{
    athleteID: string;
    athleteName: string;
  }>();

  const router = useRouter();

  const [records, setRecords] = useState<InjuryRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, any[]>>({});

  useEffect(() => {
    if (athleteID) loadHistory();
  }, [athleteID]);

  async function loadHistory() {
    setLoading(true);
    const result = await fetchInjuryRecordsByAthlete(Number(athleteID));
    setRecords(result);
    setLoading(false);
  }

  async function toggleExpand(id: number) {
    const newValue = expanded === id ? null : id;
    setExpanded(newValue);

    if (newValue) {
      const n = await fetchNotesByRecord(id);
      setNotes((prev) => ({ ...prev, [id]: n }));
    }
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
            const isClosed = item.statusID === 2;

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
                    {item.dateStart} — {item.taux_status?.status}
                  </Text>
                </View>

                {/* Conteúdo expandido */}
                {isOpen && (
                  <View style={{ marginTop: 10 }}>
                    <Text style={{ fontWeight: "600" }}>Resumo:</Text>
                    <Text>{item.resume}</Text>

                    {/* Notas */}
                    {notes[item.injuryRecordID] && (
                      <View style={{ marginTop: 12 }}>
                        <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                          Notas:
                        </Text>

                        {notes[item.injuryRecordID].map((note) => (
                          <View
                            key={note.noteID}
                            style={{
                              padding: 10,
                              borderWidth: 1,
                              borderColor: "#DDD",
                              borderRadius: 8,
                              marginBottom: 6,
                            }}
                          >
                            <Text style={{ fontWeight: "500" }}>
                              {note.date}
                            </Text>
                            <Text>{note.text}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {!isClosed && (
                      <View style={styles.buttonsRow}>
                        <TouchableOpacity
                          style={styles.btn}
                          onPress={() =>
                            router.push({
                              pathname: "/add-note",
                              params: { injuryRecordID: item.injuryRecordID },
                            })
                          }
                        >
                          <Text style={styles.btnText}>Adicionar Nota</Text>
                          <Ionicons name="add" size={20} color="#000" />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.btn}
                          onPress={() =>
                            router.push({
                              pathname: "/end-note",
                              params: { injuryRecordID: item.injuryRecordID },
                            })
                          }
                        >
                          <Text style={styles.btnText}>Acabar</Text>
                          <Ionicons
                            name="log-out-outline"
                            size={20}
                            color="#000"
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
      </View>
    </ScrollView>
  );
}
