import {
  View,
  Text,
  ImageBackground,
  Pressable,
  ScrollView,
} from "react-native";
import React from "react";
import tw from "twrnc";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";

import SafeView from "@/components/SafeView";
import Header from "@/components/Header";
import { eventCategories } from "@/constants/event-categories";
import Title from "@/components/Title";

const AllEvents = () => {
  return (
    <SafeView>
      <ScrollView>
        <Header />

        <Title>All Events</Title>

        <View style={tw`px-5 mt-9 h-full w-full`}>
          <FlashList
            data={eventCategories}
            keyExtractor={(_, i) => i.toString()}
            estimatedItemSize={10}
            numColumns={2}
            renderItem={({ item }) => {
              return (
                <Pressable
                  style={tw`w-[94%] h-44 mb-7`}
                  onPress={() =>
                    router.push({
                      pathname: "/events",
                      params: { category: item },
                    })
                  }
                >
                  <ImageBackground
                    source={require("../../assets/images/category-bg.webp")}
                    style={tw`w-full h-full items-center justify-center`}
                  >
                    <Text style={tw`text-xl text-white font-semibold`}>
                      {item}
                    </Text>
                  </ImageBackground>
                </Pressable>
              );
            }}
          />
        </View>
      </ScrollView>
    </SafeView>
  );
};

export default AllEvents;
