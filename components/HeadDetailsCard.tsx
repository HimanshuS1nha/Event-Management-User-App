import { View, Text, Image, ActivityIndicator, Alert } from "react-native";
import React, { memo } from "react";
import tw from "twrnc";
import axios, { AxiosError } from "axios";
import { FontAwesome } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import { HeadType } from "@/types";

const HeadDetailsCard = ({ id }: { id: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["get-head" + id],
    queryFn: async () => {
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/get-head-details`,
        { id }
      );
      return data as { head: HeadType };
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
    <View
      style={tw`bg-gray-700 mr-4 py-2 px-5 w-[150px] h-[180px] rounded-lg gap-y-3 items-center`}
    >
      {isLoading ? (
        <ActivityIndicator size={40} style={tw`mt-12`} />
      ) : (
        <>
          <Image
            source={{ uri: data?.head.image }}
            style={tw`w-24 h-24 rounded-full`}
            resizeMode="stretch"
          />
          <View style={tw`gap-y-1.5`}>
            <Text style={tw`text-white text-center text-lg font-semibold`}>
              {data?.head?.name}
            </Text>
            <View style={tw`flex-row items-center justify-center gap-x-3`}>
              <FontAwesome name="phone" size={18} color="white" />
              <Text style={tw`text-gray-300 text-center`}>
                {data?.head?.phoneNumber}
              </Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default memo(HeadDetailsCard);
