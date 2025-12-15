import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  rectangleWrapper: {
    width: "100%",
    height: "60%",
    overflow: "hidden",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 16,
  },
  rectangle: {
    flex: 1,
    backgroundColor: "#22333b",
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    paddingTop: 40,
    paddingLeft: 16,
  },
  calendar: {
    borderRadius: 16,
  },
  remindersContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  remindersTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#22333b",
  },
  reminderList: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
  },
  reminderItem: {
    backgroundColor: "#334455",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  reminderText: {
    color: "#ffffff",
    fontSize: 16,
  },
  noRemindersText: {
    color: "#aaaaaa",
    fontStyle: "italic",
  },
  reminderRow: {
  flexDirection: "row",
  marginBottom: 12,
  alignItems: "stretch", 
},
timeBox: {
  width: 80,
  backgroundColor: "#22333b",
  borderRadius: 16,
  paddingVertical: 12,
  paddingHorizontal: 4,
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1,   
},

timeText: {
  color: "#ffffff",
  fontSize: 14,
  fontWeight: "bold",
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
  fontSize: 16,
  fontWeight: "500",
},

});
