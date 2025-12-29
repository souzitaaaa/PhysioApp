import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingTop: 40,
    paddingLeft: 16,
    marginBottom: 12,
  },

  titleHistorical: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },

  titleReminder: {
    fontSize: 20,
    fontWeight: "bold",
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
    flex: 1, 
  },

  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    minHeight: 60,
    marginBottom: 16,
  },

  inputReminder: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  infoText: {
    fontSize: 16,
    marginBottom: 6,
  },

  label: {
    fontWeight: "bold",
  },

  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 8,
    borderRadius: 16,
    backgroundColor: "#CDCDCD",
  },

  btncancel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 8,
    borderRadius: 16,
    borderColor: "#CDCDCD",
    borderWidth: 2,
  },

  btnText: {
    color: "#000",
    textAlign: "center",
    fontWeight: "bold",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  pickerButton: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#FAFAFA",
  },
});
