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
  flexWrap: "nowrap",
  },
  noteDates: {
    fontSize: 14,
    color: "#555",
    textAlign: "right",
  flexWrap: "wrap",
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
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 8,
    borderRadius: 16,
    backgroundColor: "#CDCDCD",
  },
  btnText: {
    color: "#000",
    fontWeight: "600",
  },
  rowBetween: {
  flexDirection: "row",
  width: "100%",
},

leftColumn: {
  width: "50%",
  paddingRight: 8,
},

rightColumn: {
  width: "50%",
  alignItems: "flex-end",
},








});
