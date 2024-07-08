import { Tabs } from "expo-router";
import React from "react";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";

const MainLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000",
          borderColor: "#6b7280",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => {
            return <Ionicons name="home-sharp" size={size} color={color} />;
          },
        }}
      />

      <Tabs.Screen
        name="all-events"
        options={{
          title: "All Events",
          tabBarIcon: ({ size, color }) => {
            return <MaterialIcons name="event" size={size} color={color} />;
          },
        }}
      />

      <Tabs.Screen
        name="my-events"
        options={{
          title: "My Events",
          tabBarIcon: ({ size, color }) => {
            return (
              <FontAwesome name="calendar-check-o" size={size} color={color} />
            );
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color }) => {
            return <FontAwesome name="user" size={size} color={color} />;
          },
        }}
      />
    </Tabs>
  );
};

export default MainLayout;
