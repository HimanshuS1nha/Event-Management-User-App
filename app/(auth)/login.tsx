import {
  View,
  Text,
  TextInput,
  ImageBackground,
  Pressable,
  Alert,
  Keyboard,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import tw from "twrnc";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { ZodError } from "zod";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

import SafeView from "@/components/SafeView";
import LoadingModal from "@/components/LoadingModal";
import Title from "@/components/Title";
import { useUser } from "@/hooks/useUser";
import { loginValidator } from "@/validators/login-validator";

const Login = () => {
  const { setUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSignupVisible, setIsSignupVisible] = useState(true);

  const handleChangeText = useCallback(
    (type: "email" | "password", text: string) => {
      if (type === "email") {
        setEmail(text);
      } else if (type === "password") {
        setPassword(text);
      }
    },
    []
  );

  const changePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prev) => !prev);
  }, [isPasswordVisible]);

  const { mutate: handleLogin, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async () => {
      const parsedData = await loginValidator.parseAsync({
        email,
        password,
      });

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/login/user`,
        {
          ...parsedData,
        }
      );

      return data;
    },

    onSuccess: async (data) => {
      if (data?.verified) {
        setUser(data.user);
        const { image, ...restUser } = data.user;
        await AsyncStorage.setItem("user-image", image);
        await SecureStore.setItemAsync("user", JSON.stringify(restUser));
        await SecureStore.setItemAsync("token", data.token);
        router.replace("/home");
      } else {
        router.push({ pathname: "/verify", params: { email } });
      }
    },
    onError: (error) => {
      if (error instanceof ZodError) {
        Alert.alert("Error", error.errors[0].message);
      } else if (error instanceof AxiosError && error.response?.data.error) {
        Alert.alert("Error", error.response?.data.error);
      } else {
        Alert.alert("Error", "Some error occured. Please try again later!");
      }
    },
  });

  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener("keyboardDidShow", () =>
      setIsSignupVisible(false)
    );

    const keyboardDidHide = Keyboard.addListener("keyboardDidHide", () =>
      setIsSignupVisible(true)
    );

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);
  return (
    <SafeView>
      <LoadingModal isVisible={isPending} />
      <ImageBackground
        source={require("../../assets/images/auth-bg.webp")}
        style={tw`flex-1 items-center justify-center gap-y-12`}
      >
        <Title>Login</Title>

        <View style={tw`gap-y-6 w-full items-center`}>
          <View style={tw`gap-y-3 w-[80%]`}>
            <Text style={tw`text-white ml-1.5 font-medium text-base`}>
              Email
            </Text>
            <TextInput
              style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
              placeholder="Enter your email"
              placeholderTextColor={"#fff"}
              value={email}
              onChangeText={(text) => handleChangeText("email", text)}
            />
          </View>
          <View style={tw`gap-y-3 w-[80%]`}>
            <Text style={tw`text-white ml-1.5 font-medium text-base`}>
              Password
            </Text>
            <View>
              <TextInput
                style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
                placeholder="Enter your password"
                placeholderTextColor={"#fff"}
                value={password}
                onChangeText={(text) => handleChangeText("password", text)}
                secureTextEntry={!isPasswordVisible}
              />
              <Pressable
                style={tw`absolute right-3 top-[30%]`}
                onPress={changePasswordVisibility}
              >
                {isPasswordVisible ? (
                  <Entypo name="eye-with-line" size={24} color="white" />
                ) : (
                  <Entypo name="eye" size={24} color="white" />
                )}
              </Pressable>
            </View>
          </View>
        </View>

        <Pressable
          style={tw`bg-violet-600 w-[80%] items-center py-3 justify-center rounded-lg`}
          onPress={() => handleLogin()}
          disabled={isPending}
        >
          <Text style={tw`text-white text-base font-semibold`}>Login</Text>
        </Pressable>

        {isSignupVisible && (
          <View
            style={tw`absolute w-full bottom-7 flex-row items-center justify-center gap-x-3`}
          >
            <Text style={tw`text-white`}>Don&apos;t have an account?</Text>
            <Pressable onPress={() => router.navigate("/signup")}>
              <Text style={tw`text-blue-600 text-base font-medium`}>
                Signup
              </Text>
            </Pressable>
          </View>
        )}
      </ImageBackground>
    </SafeView>
  );
};

export default Login;
