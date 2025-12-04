import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "../../scripts/supabase";
import { useRouter } from "expo-router";

type Email = {
  emailID: number;
  sender: string;
  dateSended: string;
  subject: string;
};

export default function NotificationScreen() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [expandedID, setExpandedID] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetchEmails();
  }, []);

  async function fetchEmails() {
    const { data, error } = await supabase.from<Email>("t_email").select("*");

    if (error) {
      console.log("Erro ao carregar emails:", error);
      return;
    }

    setEmails(data || []);
  }

  function toggleExpand(id: number) {
    setExpandedID(expandedID === id ? null : id);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Notificações</Text>

      {emails.map((item) => {
        const expanded = expandedID === item.emailID;

        return (
          <TouchableOpacity
            key={item.emailID}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => toggleExpand(item.emailID)}
          >
            <View style={styles.row}>
              <Text style={styles.sender}>{item.sender}</Text>
              <Text style={styles.date}>{item.dateSended}</Text>
            </View>

            <Text
              style={styles.subject}
              numberOfLines={expanded ? undefined : 3}
              ellipsizeMode={expanded ? "clip" : "tail"}
            >
              {item.subject}
            </Text>

            {expanded && (
              <View style={styles.buttonsRow}>
                <View style={styles.button}>
                  <Button
                    title="Notas"
                    color="#22333B"
                    onPress={() => {
                      router.push({
                        pathname: "/notes",
                        params: { sender: item.sender },
                      });
                    }}
                  />
                </View>

                <View style={styles.button}>
                  <Button
                    title="936 812 349"
                    color="#22333B"
                    onPress={() => console.log("936 812 349")}
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
