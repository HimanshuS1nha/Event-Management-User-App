import {
  View,
  Text,
  Alert,
  Pressable,
  TextInput,
  ImageBackground,
  ScrollView,
  Image,
} from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

import SafeView from "@/components/SafeView";
import LoadingModal from "@/components/LoadingModal";
import Title from "@/components/Title";
import { signupValidator } from "@/validators/signup-validator";
import { branches } from "@/constants/branches";
import { years } from "@/constants/years";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const handleChangeText = useCallback(
    (
      type:
        | "name"
        | "email"
        | "phoneNumber"
        | "branch"
        | "year"
        | "rollNo"
        | "password"
        | "confirmPassword",
      text: string
    ) => {
      if (type === "name") {
        setName(text);
      } else if (type === "email") {
        setEmail(text);
      } else if (type === "phoneNumber") {
        setPhoneNumber(text);
      } else if (type === "branch") {
        setBranch(text);
      } else if (type === "year") {
        setYear(text);
      } else if (type === "rollNo") {
        setRollNo(text);
      } else if (type === "password") {
        setPassword(text);
      } else if (type === "confirmPassword") {
        setConfirmPassword(text);
      }
    },
    []
  );

  const pickImage = useCallback(async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        base64: true,
      });
      if (res.canceled) {
        return;
      }
      const base64 = `data:image/png;base64,${res.assets?.[0].base64}`;
      setImage(base64);
    } catch (error) {
      Alert.alert("Error", "Some error occured.");
    }
  }, []);

  const changePasswordVisibility = useCallback(
    (type: "password" | "confirmPassword") => {
      if (type === "password") {
        setIsPasswordVisible((prev) => !prev);
      } else if (type === "confirmPassword") {
        setIsConfirmPasswordVisible((prev) => !prev);
      }
    },
    [isPasswordVisible, isConfirmPasswordVisible]
  );

  const { mutate: handleSignup, isPending } = useMutation({
    mutationKey: ["signup"],
    mutationFn: async () => {
      const parsedData = await signupValidator.parseAsync({
        name,
        email,
        phoneNumber,
        branch,
        year,
        rollNo,
        password,
        confirmPassword,
        image,
      });

      if (parsedData.password !== parsedData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/signup/user`,
        { ...parsedData }
      );

      return data;
    },
    onSuccess: () => {
      router.push({ pathname: "/verify", params: { email } });
    },
    onError: (error) => {
      if (error instanceof ZodError) {
        Alert.alert("Error", error.errors[0].message);
      } else if (error instanceof AxiosError && error.response?.data.error) {
        Alert.alert("Error", error.response?.data.error);
      } else if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "Some error occured. Please try again later!");
      }
    },
  });
  return (
    <SafeView>
      <LoadingModal isVisible={isPending} />
      <ScrollView>
        <ImageBackground
          source={require("../../assets/images/auth-bg.webp")}
          style={tw`flex-1 items-center justify-center gap-y-8`}
        >
          <View style={tw`mt-9`} />
          <Title>Signup</Title>

          <View style={tw`gap-y-6 w-full items-center`}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={tw`w-[100px] h-[100px] rounded-full`}
              />
            ) : (
              <View
                style={tw`bg-gray-700 rounded-full w-[100px] h-[100px] items-center justify-center`}
              >
                <FontAwesome name="user" size={70} color="white" />

                <Pressable
                  style={tw`absolute rounded-full bottom-0 bg-green-500 p-1 right-0`}
                  onPress={pickImage}
                >
                  <Entypo name="plus" size={28} color="white" />
                </Pressable>
              </View>
            )}
            <View style={tw`gap-y-3 w-[80%]`}>
              <Text style={tw`text-white ml-1.5 font-medium text-base`}>
                Name
              </Text>
              <TextInput
                style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
                placeholder="Enter your name"
                placeholderTextColor={"#fff"}
                value={name}
                onChangeText={(text) => handleChangeText("name", text)}
              />
            </View>
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
                Phone Number
              </Text>
              <TextInput
                style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
                placeholder="Enter your phone number"
                placeholderTextColor={"#fff"}
                value={phoneNumber}
                onChangeText={(text) => handleChangeText("phoneNumber", text)}
                keyboardType="number-pad"
              />
            </View>
            <View style={tw`gap-y-3 w-[80%]`}>
              <Text style={tw`text-white ml-1.5 font-medium text-base`}>
                Branch
              </Text>
              <View style={tw`w-full border border-white rounded-lg`}>
                <Picker
                  selectedValue={branch}
                  style={tw`w-full px-4 py-2 text-white`}
                  dropdownIconColor={"#fff"}
                  onValueChange={(value) => handleChangeText("branch", value)}
                  mode="dropdown"
                >
                  {branches.map((branch) => {
                    return (
                      <Picker.Item
                        key={branch.value}
                        value={branch.value}
                        label={branch.label}
                        style={tw`text-sm`}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>
            <View style={tw`gap-y-3 w-[80%]`}>
              <Text style={tw`text-white ml-1.5 font-medium text-base`}>
                Year
              </Text>
              <View style={tw`w-full border border-white rounded-lg`}>
                <Picker
                  selectedValue={year}
                  style={tw`w-full px-4 py-2 text-white`}
                  dropdownIconColor={"#fff"}
                  onValueChange={(value) => handleChangeText("year", value)}
                  mode="dropdown"
                >
                  {years.map((year) => {
                    return (
                      <Picker.Item
                        key={year.value}
                        value={year.value}
                        label={year.label}
                        style={tw`text-sm`}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>
            <View style={tw`gap-y-3 w-[80%]`}>
              <Text style={tw`text-white ml-1.5 font-medium text-base`}>
                Roll Number
              </Text>
              <TextInput
                style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
                placeholder="Enter your roll number"
                placeholderTextColor={"#fff"}
                value={rollNo}
                onChangeText={(text) => handleChangeText("rollNo", text)}
                keyboardType="number-pad"
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
                  onPress={() => changePasswordVisibility("password")}
                >
                  {isPasswordVisible ? (
                    <Entypo name="eye-with-line" size={24} color="white" />
                  ) : (
                    <Entypo name="eye" size={24} color="white" />
                  )}
                </Pressable>
              </View>
            </View>
            <View style={tw`gap-y-3 w-[80%]`}>
              <Text style={tw`text-white ml-1.5 font-medium text-base`}>
                Confirm Password
              </Text>
              <View>
                <TextInput
                  style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
                  placeholder="Enter your password"
                  placeholderTextColor={"#fff"}
                  value={confirmPassword}
                  onChangeText={(text) =>
                    handleChangeText("confirmPassword", text)
                  }
                  secureTextEntry={!isConfirmPasswordVisible}
                />
                <Pressable
                  style={tw`absolute right-3 top-[30%]`}
                  onPress={() => changePasswordVisibility("confirmPassword")}
                >
                  {isConfirmPasswordVisible ? (
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
            onPress={() => handleSignup()}
            disabled={isPending}
          >
            <Text style={tw`text-white text-base font-semibold`}>Signup</Text>
          </Pressable>

          <View style={tw`w-full flex-row items-center justify-center gap-x-3`}>
            <Text style={tw`text-white`}>Already have an account?</Text>
            <Pressable onPress={() => router.back()}>
              <Text style={tw`text-blue-600 text-base font-medium`}>Login</Text>
            </Pressable>
          </View>
        </ImageBackground>
      </ScrollView>
    </SafeView>
  );
};

export default Signup;
