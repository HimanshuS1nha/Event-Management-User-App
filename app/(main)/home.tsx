import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Linking,
} from "react-native";
import React from "react";
import tw from "twrnc";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

import SafeView from "@/components/SafeView";
import Header from "@/components/Header";
import ReelCard from "@/components/ReelCard";
import ImageCard from "@/components/ImageCard";
import { reels } from "@/constants/reels";
import { images } from "@/constants/images";

const Home = () => {
  return (
    <SafeView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-4`}
      >
        <Header />
        <View style={tw`w-full h-[300px] items-center justify-center mt-2`}>
          <Image
            source={require("../../assets/images/home.webp")}
            style={tw`w-full h-full`}
          />
          <Text style={tw`text-sky-400 text-5xl font-bold absolute top-[25%]`}>
            Event 2K24
          </Text>

          <Pressable
            style={tw`absolute bottom-[25%] w-40 items-center justify-center py-3 bg-violet-600 rounded-full`}
            onPress={() => router.navigate("/all-events")}
          >
            <Text style={tw`text-white text-base`}>Explore Events</Text>
          </Pressable>
        </View>

        <View style={tw`mt-9`}>
          <View style={tw`flex-row items-center px-4 justify-between`}>
            <Text style={tw`text-sky-400 text-xl font-semibold`}>
              Explore Our Reels
            </Text>
            <Pressable onPress={() => Linking.openURL("https://instagram.com")}>
              <AntDesign name="instagram" size={26} color="red" />
            </Pressable>
          </View>

          <View style={tw`mt-4 px-4`}>
            <FlashList
              data={reels}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => {
                return <ReelCard reel={item} />;
              }}
              estimatedItemSize={10}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>

        <View style={tw`mt-9`}>
          <View style={tw`flex-row items-center px-4 justify-between`}>
            <Text style={tw`text-sky-400 text-xl font-semibold`}>
              Past Memories
            </Text>
            <Pressable onPress={() => Linking.openURL("https://instagram.com")}>
              <AntDesign name="instagram" size={26} color="red" />
            </Pressable>
          </View>
          <View style={tw`mt-4 px-4`}>
            <FlashList
              data={images}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => {
                return <ImageCard image={item} />;
              }}
              estimatedItemSize={10}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeView>
  );
};

export default Home;
