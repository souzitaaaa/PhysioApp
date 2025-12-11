import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#22333b",
      }}
    >
      {/* Notificações */}
      <Tabs.Screen
        name="notification"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.tabItem,
                focused && styles.tabItemActive,
              ]}
            >
              <FontAwesome name="bell" size={size} color={color} />

              {focused && (
                <Text style={[styles.tabText, { color }]}>
                  Notificações
                </Text>
              )}
            </View>
          ),
        }}
      />

      {/* Início */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.tabItem,
                focused && styles.tabItemActive,
              ]}
            >
              <FontAwesome name="home" size={size} color={color} />

              {focused && (
                <Text style={[styles.tabText, { color }]}>
                  Início
                </Text>
              )}
            </View>
          ),
        }}
      />

      {/* Calendário */}
      <Tabs.Screen
        name="calendar"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.tabItem,
                focused && styles.tabItemActive,
              ]}
            >
              <FontAwesome name="calendar" size={size} color={color} />

              {focused && (
                <Text style={[styles.tabText, { color }]}>
                  Calendário
                </Text>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="historical"
        options={{
              href: null, 
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
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
