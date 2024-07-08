import { Text, ImageBackground, Pressable, Alert } from "react-native";
import React, { useCallback, useState } from "react";
import tw from "twrnc";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import OTPTextInput from "react-native-otp-textinput";

import SafeView from "@/components/SafeView";
import LoadingModal from "@/components/LoadingModal";
import Title from "@/components/Title";

const Verify = () => {
  const { email } = useLocalSearchParams();

  const [otp, setOtp] = useState("");

  const handleChange = useCallback((text: string) => {
    setOtp(text);
  }, []);

  const { mutate: handleVerify, isPending } = useMutation({
    mutationKey: ["verify"],
    mutationFn: async () => {
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/verify/user`,
        {
          otp,
          email,
        }
      );
      return data;
    },
    onSuccess: () => {
      router.replace("/login");
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data.error) {
        Alert.alert("Error", error.response?.data.error);
      } else {
        Alert.alert("Error", "Some error occured. Please try again later!");
      }
    },
  });
  return (
    <SafeView>
      <LoadingModal isVisible={isPending} />
      <ImageBackground
        source={require("../../assets/images/auth-bg.webp")}
        style={tw`flex-1 items-center justify-center gap-y-8`}
      >
        <Title>Verify</Title>
        <OTPTextInput
          inputCount={6}
          keyboardType="number-pad"
          tintColor={"#38bdf8"}
          textInputStyle={tw`text-white`}
          handleTextChange={handleChange}
        />
        <Pressable
          style={tw`bg-violet-600 w-[80%] items-center py-3 justify-center rounded-lg`}
          disabled={isPending}
          onPress={() => handleVerify()}
        >
          <Text style={tw`text-white text-base font-semibold`}>Verify</Text>
        </Pressable>
      </ImageBackground>
    </SafeView>
  );
};

export default Verify;
