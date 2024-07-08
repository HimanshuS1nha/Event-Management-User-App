import { View, Image } from "react-native";
import React, { memo } from "react";
import tw from "twrnc";

const ImageCard = ({ image }: { image: string }) => {
  return (
    <View style={tw`w-40 h-40 rounded-lg shadow-xl shadow-gray-300 mr-5`}>
      <Image source={{ uri: image }} style={tw`w-full h-full rounded-lg`} />
    </View>
  );
};

export default memo(ImageCard);
