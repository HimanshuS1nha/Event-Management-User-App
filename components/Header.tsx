import { View, TouchableOpacity, Image } from "react-native";
import React, { memo } from "react";
import tw from "twrnc";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";

const Header = ({ showBackButton = false }: { showBackButton?: boolean }) => {
  return (
    <View style={tw`my-4 px-4`}>
      {showBackButton ? (
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="left" size={20} color="white" />
        </TouchableOpacity>
      ) : (
        <Image
          source={require("../assets/images/logo.webp")}
          style={tw`w-10 h-10 rounded-full`}
        />
      )}
    </View>
  );
};

export default memo(Header);
