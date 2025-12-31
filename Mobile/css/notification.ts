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
  senderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  title_notification: {
    fontSize: 15,
    color: "#333",
    fontWeight: "bold",
  },
  customButton: {
  backgroundColor: "#22333B",
  paddingVertical: 10,
  borderRadius: 10,
  alignItems: "center",
  marginTop: 10,
},

customButtonText: {
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "600",
},

});
