import { View, Text, Alert, ScrollView, Pressable } from "react-native";
import React from "react";
import tw from "twrnc";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, router } from "expo-router";
import axios, { AxiosError } from "axios";
import { FlashList } from "@shopify/flash-list";

import SafeView from "@/components/SafeView";
import { useSelectedEvent } from "@/hooks/useSelectedEvent";
import LoadingModal from "@/components/LoadingModal";
import Header from "@/components/Header";
import EventCard from "@/components/EventCard";
import Title from "@/components/Title";
import { EventType } from "@/types";

const Events = () => {
  const { category } = useLocalSearchParams();
  const { setSelectedEvent } = useSelectedEvent();

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-events"],
    queryFn: async () => {
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/get-events`,
        { category }
      );
      return data as { events: EventType[] };
    },
  });
  if (error) {
    if (error instanceof AxiosError && error.response?.data.error) {
      Alert.alert("Error", error.response?.data.error);
    } else if (error instanceof Error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Error", "Some error occured. Please try again later!");
    }
  }
  return (
    <SafeView>
      <LoadingModal isVisible={isLoading} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Header showBackButton />
        <View style={tw`mt-3`} />
        <Title>{category} Events</Title>

        {data?.events?.length === 0 && (
          <Text style={tw`text-rose-500 text-center text-2xl mt-10`}>
            No events to show
          </Text>
        )}

        <View style={tw`w-full h-full mt-10`}>
          <FlashList
            data={data?.events}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => {
              return (
                <Pressable
                  onPress={() => {
                    setSelectedEvent({ ...item, registerEnabled: true });
                    router.navigate("/event");
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

export default Events;
