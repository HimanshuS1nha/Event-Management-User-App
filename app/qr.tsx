import { View, Pressable, Text } from "react-native";
import React from "react";
import tw from "twrnc";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import QRCode from "react-native-qrcode-svg";

import SafeView from "@/components/SafeView";
import { useUser } from "@/hooks/useUser";
import Title from "@/components/Title";

const QR = () => {
  const { user } = useUser();
  return (
    <SafeView style={tw`justify-center items-center gap-y-12`}>
      <Pressable style={tw`absolute top-[8%] left-5`} onPress={router.back}>
        <AntDesign name="left" size={20} color="white" />
      </Pressable>

      <View style={tw`gap-y-1.5 items-center`}>
        <Title>My QR Code</Title>
        <Text style={tw`text-rose-500 font-bold`}>
          Use this to enter the event!
        </Text>
      </View>

      <View style={tw`bg-gray-700 p-2`}>
        <QRCode
          value={user?.id}
          size={200}
          // logo={require("../assets/logo.png")}
          logoBackgroundColor="transparent"
        />
      </View>
    </SafeView>
  );
};

export default QR;
