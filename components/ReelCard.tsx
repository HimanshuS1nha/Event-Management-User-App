import { Image, Linking, Pressable, View } from "react-native";
import React, { useCallback, memo } from "react";
import tw from "twrnc";
import { Entypo } from "@expo/vector-icons";

const ReelCard = ({ reel }: { reel: { image: string; url: string } }) => {
  const handlePress = useCallback(() => {
    if (reel.url) {
      Linking.canOpenURL(reel.url).then((supported) => {
        if (supported) {
          Linking.openURL(reel.url);
        }
      });
    }
  }, []);
  return (
    <View
      style={tw`w-40 h-40 rounded-lg shadow-xl shadow-gray-300 mr-5 items-center justify-center`}
    >
      <Image
        source={{ uri: reel.image }}
        style={tw`w-full h-full rounded-lg`}
      />

      <Pressable
        style={tw`absolute bg-rose-500 p-2 rounded-full z-20`}
        onPress={handlePress}
      >
        <Entypo name="controller-play" size={26} color="white" />
      </Pressable>
    </View>
  );
};

export default memo(ReelCard);
