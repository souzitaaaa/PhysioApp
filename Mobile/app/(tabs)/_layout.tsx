import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // importar FontAwesome

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#007AFF',  
        tabBarInactiveTintColor: '#8e8e93', 
      }}
    >
      <Tabs.Screen
        name="notification"
        options={{
          title: 'Notificações',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bell" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendário',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="calendar" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#f0f0f0',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
});
