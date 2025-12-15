import { Tabs } from "expo-router";
import React from "react";
import { View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { styles } from "../../css/_layout"


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
      <Tabs.Screen
        name="add-note"
        options={{
              href: null, 
        }}
      />
       <Tabs.Screen
        name="end-note"
        options={{
              href: null, 
        }}
      />
    </Tabs>
  );
}

