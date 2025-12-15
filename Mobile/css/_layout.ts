import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#f0f0f0",
    height: 80,
    borderTopWidth: 0,
    elevation: 0,
  },

  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    width: 120,     
    height: 45,    
    borderRadius: 16,
    marginTop: 32,
  },

  tabItemActive: {
    backgroundColor: "#22333b", 
  },

  tabText: {
    fontSize: 12,
    marginLeft: 6,
  },
});
