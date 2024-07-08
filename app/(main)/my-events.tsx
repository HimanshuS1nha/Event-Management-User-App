import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import React from "react";
import tw from "twrnc";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";

import SafeView from "@/components/SafeView";
import LoadingModal from "@/components/LoadingModal";
import Header from "@/components/Header";
import Title from "@/components/Title";
import EventCard from "@/components/EventCard";
import { useSelectedEvent } from "@/hooks/useSelectedEvent";
import { EventType } from "@/types";

const MyEvents = () => {
  const { setSelectedEvent } = useSelectedEvent();

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-my-events"],
    queryFn: async () => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        throw new Error("Invalid request. Please login again");
      }
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/get-my-events`,
        { token }
      );
      return data as { myEvents: EventType[] };
    },
  });
  if (error) {
    if (error instanceof AxiosError && error.response?.data.error) {
      Alert.alert("Error", error.response.data.error);
    } else if (error instanceof Error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Error", "Some error occured. Please try again later!");
    }
  }
  return (
    <SafeView>
      <LoadingModal isVisible={isLoading} />

      <ScrollView>
        <Header />

        <Title>My Events</Title>

        {!data?.myEvents && (
          <Text style={tw`text-rose-500 text-center text-base font-bold mt-10`}>
            No events to show
          </Text>
        )}
        <View style={tw`w-full h-full mt-10`}>
          <FlashList
            data={data?.myEvents}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => {
              return (
                <Pressable
                  onPress={() => {
                    setSelectedEvent({ ...item, registerEnabled: false });
                    router.push("/event");
                  }}
                >
                  <EventCard event={item} />
                </Pressable>
              );
            }}
            estimatedItemSize={15}
          />
        </View>
      </ScrollView>
    </SafeView>
  );
};

export default MyEvents;
