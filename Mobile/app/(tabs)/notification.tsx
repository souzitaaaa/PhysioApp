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
import { ActivityIndicator } from "react-native";

import {
  fetchAllInjuryRecords,
  InjuryRecord,
} from "../../services/injuryRecordService";
import { fetchAthleteByID } from "../../services/athleteService";
import { supabase } from "../../scripts/supabase";

import { styles } from "../../css/notification";

export default function NotificationScreen() {
  // Injury record with athlete name
  type InjuryRecordWithAthlete = InjuryRecord & {
    athleteName: string;
  };

  const [records, setRecords] = useState<InjuryRecordWithAthlete[]>([]);
  const [expandedID, setExpandedID] = useState<number | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Load records and subscribe to realtime updates
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

  // Reset expanded card on screen blur
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setExpandedID(null);
      };
    }, [])
  );

  async function loadRecords() {
    const records = await fetchAllInjuryRecords();

    // Sort by newest first
    const sortedRecords = records.sort(
      (a, b) => b.injuryRecordID - a.injuryRecordID
    );

    const withNames: InjuryRecordWithAthlete[] = [];

    // Attach athlete names
    for (const record of sortedRecords) {
      const athlete = await fetchAthleteByID(record.athleteID);
      withNames.push({
        ...record,
        athleteName: athlete?.name ?? "Nome não encontrado",
      });
    }

    setRecords(withNames);
    setLoading(false);
  }

  // Toggle card expansion
  function toggleExpand(id: number) {
    setExpandedID(expandedID === id ? null : id);
  }

  // Get color by status
  function getStatusColor(statusID: number) {
    switch (statusID) {
      case 1:
        return "#e7000b";
      case 2:
        return "#00a63e";
      case 3:
        return "#d08700";
      case 4:
        return "#0084d1";
    }
  }

  // Format date (DD/MM/YYYY)
  function formatDate(dateString: string | Date | null) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-PT"); // formato dia/mês/ano
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      {/* Screen title */}
      <Text style={styles.title}>Notificações</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22333B" />
          <Text style={styles.loadingText}>A carregar notificações…</Text>
        </View>
      ) : (
        records.map((item) => {
          const expanded = expandedID === item.injuryRecordID;
          const athleteName = item.athleteName;

          return (
            <TouchableOpacity
              key={item.injuryRecordID}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => toggleExpand(item.injuryRecordID)}
            >
              {/* Header row */}
              <View style={styles.row}>
                <View style={styles.senderRow}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor(item.statusID) },
                    ]}
                  />
                  {/* Athlete name */}
                  <Text style={styles.sender}>{athleteName}</Text>
                </View>

                {/* Start date */}
                <Text style={styles.date}>{formatDate(item.dateStart)}</Text>
              </View>

              <Text
              {/* Notification title */}
                style={styles.title_notification}
              >
                {item.title}
              </Text>
              {/* Notification summary */}
              <Text
                style={styles.subject}
                numberOfLines={expanded ? undefined : 3}
                ellipsizeMode={expanded ? "clip" : "tail"}
              >
                {item.resume}
              </Text>

              {/* Expanded action */}
              {expanded && (
                <TouchableOpacity
                  style={styles.customButton}
                  onPress={() => {
                    router.push({
                      pathname: "/historical",
                      params: {
                        athleteID: item.athleteID.toString(),
                        athleteName: athleteName,
                      },
                    });
                  }}
                >
                  <Text style={styles.customButtonText}>Histórico</Text>
                </TouchableOpacity>

              )}
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
}
