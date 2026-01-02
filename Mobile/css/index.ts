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
    fontSize: 15,
    paddingRight: 6,
  },

  resume: {
    width: "70%",
    fontSize: 15,
    color: "#444",
  },
  dateColumn: {
    width: "30%",
  },

  eventDate: {
    fontSize: 15,
    fontWeight: "600",
  },

  eventTime: {
    fontSize: 12,
    color: "#666",
  },
  timeText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  timeBox: {
    width: 100,
    backgroundColor: "#22333b",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  titleBox: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderColor: "#cccccc",
    borderWidth: 1,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    paddingStart: 40,
    marginLeft: -30,
    justifyContent: "center",
  },
  titleText: {
    color: "#22333b",
    fontSize: 15,
    fontWeight: "500",
  },
  reminderRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "stretch",
  },
  titleName: {
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 16,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
});
