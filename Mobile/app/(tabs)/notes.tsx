import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function NotesScreen() {
  const { sender } = useLocalSearchParams<{ sender: string }>();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notas</Text>

      <View style={styles.card}>
        {/* --- Botão de voltar + título --- */}
        <View style={styles.headerRow}>
          <Text style={styles.senderText}>Histório do {sender}</Text>

          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={20} color="#000000" />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    flex: 1,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
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

  senderText: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "600",
  },
});
