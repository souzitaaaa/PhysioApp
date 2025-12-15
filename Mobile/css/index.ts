import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
  notificationTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  notificationRow: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "flex-start",
  },

  athleteName: {
    width: "30%",
    fontWeight: "600",
    fontSize: 14,
    paddingRight: 6,
  },

  resume: {
    width: "70%",
    fontSize: 14,
    color: "#444",
  },
});