import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  containerLogin: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  group: {
    position: "relative",
    marginBottom: 30,
  },

  label: {
    position: "absolute",
    left: 5,
  },

  input: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
    backgroundColor: "transparent",
    color: "#fff",
  },

  barContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 2,
    overflow: "hidden",
  },

  barBase: {
    position: "absolute",
    width: "100%",
    height: 2,
    backgroundColor: "#999",
  },

  barActive: {
    position: "absolute",
    width: "100%",
    height: 2,
    backgroundColor: "#f0f0f0",
  },

  buttonLogin: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 6,
    marginTop: 20,
    width: "35%",
    alignSelf: "flex-end",
  },

  buttonTextLogin: {
    color: "#22333b",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  iconLogin: {
    color: "#22333b",
  }
});
