import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCallback } from "react";

import {
  fetchInjuryRecordsByAthlete,
  InjuryRecord,
} from "../../services/injuryRecordService";

import { fetchNotesByRecord } from "../../services/noteService";

import { supabase } from "../../scripts/supabase";

import { styles } from "../../css/historical";

export default function HistoricalScreen() {
  // Route params
  const { athleteID, athleteName } = useLocalSearchParams<{
    athleteID: string;
    athleteName: string;
  }>();

  const router = useRouter();

  const [records, setRecords] = useState<InjuryRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, any[]>>({});

  // Reset state on screen blur
  useFocusEffect( 
    useCallback(() => {
  
      return () => {
  
        setExpanded(null);
        setNotes({});
      };
    }, [])
  );

  // Load history and subscribe to updates
  useEffect(() => {

    if (!athleteID) return;

    loadHistory();

    // Realtime history channel
    const channel = supabase
      .channel(`injury-history-${athleteID}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "t_injury_record",
          filter: `athleteID=eq.${athleteID}`,
        },
        async () => {
          await loadHistory();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "t_note",
        },
        async (payload) => {
          // Reload notes for open record
          if (expanded) {
            const n = await fetchNotesByRecord(expanded);
            setNotes((prev) => ({ ...prev, [expanded]: n }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [athleteID, expanded]);

  async function loadHistory() {
    setLoading(true);
    const result = await fetchInjuryRecordsByAthlete(Number(athleteID));
    setRecords(result);
    setLoading(false);
  }

  async function toggleExpand(id: number) {
    // Toggle expanded record
    const newValue = expanded === id ? null : id;
    setExpanded(newValue);

    // Load notes when expanded
    if (newValue) {
      const n = await fetchNotesByRecord(id);
      setNotes((prev) => ({ ...prev, [id]: n }));
    }
  }

  // Format date (DD/MM/YYYY)
  function formatDate(dateString: string | Date | null) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-PT");
  }

  return (
    <ScrollView style={styles.container}>
      {/* Screen title */}
      <Text style={styles.title}>Histórico do Atleta</Text>

      <View style={styles.card}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.Text}>Histórico do Atleta</Text>
            <Text>{athleteName}</Text>
          </View>
          {/* Back button */}
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

        {/* Records list */}
        {!loading &&
          records.map((item) => {
            const isOpen = expanded === item.injuryRecordID;
            const hasButtons = item.statusID !== 1 && item.statusID !== 2;

            return (
              <TouchableOpacity
                key={item.injuryRecordID}
                style={styles.card_note}
                onPress={() => toggleExpand(item.injuryRecordID)}
                activeOpacity={0.7}
              >
                {/* Title and date row */}
                <View style={styles.rowBetween}>
                  <View style={styles.leftColumn}>
                    <Text
                      style={styles.noteTitle}
                      numberOfLines={isOpen ? undefined : 1}
                      ellipsizeMode="tail"
                    >
                      {item.title}
                    </Text>
                  </View>

                  <View style={styles.rightColumn}>
                    <Text
                      style={styles.noteDates}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {formatDate(item.dateStart)} — {item.taux_status?.status}
                    </Text>
                  </View>
                </View>

                {/* Expanded content */}
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
                              {formatDate(note.date)}
                            </Text>
                            <Text>{note.text}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Action buttons */}
                    {hasButtons && (
                      <View style={styles.buttonsRow}>
                        {/* Add note */}
                        <TouchableOpacity
                          style={styles.btn}
                          onPress={() =>
                            router.push({
                              pathname: "/add-note",
                              params: {
                                injuryRecordID: item.injuryRecordID,
                                athleteID,
                                athleteName,
                              },
                            })
                          }
                        >
                          <Text style={styles.btnText}>Adicionar Nota</Text>
                          <Ionicons name="add" size={20} color="#000" />
                        </TouchableOpacity>
                        {/* End record */}
                        <TouchableOpacity
                          style={styles.btn}
                          onPress={() =>
                            router.push({
                              pathname: "/end-note",
                              params: {
                                injuryRecordID: item.injuryRecordID,
                                athleteID,
                                athleteName,
                              },
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
