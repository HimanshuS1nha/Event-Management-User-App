import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  Alert,
} from "react-native";
import React, { useCallback, useState } from "react";
import tw from "twrnc";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";

import SafeView from "@/components/SafeView";
import LoadingModal from "@/components/LoadingModal";
import Header from "@/components/Header";
import Title from "@/components/Title";
import { UserType, useUser } from "@/hooks/useUser";
import { branches } from "@/constants/branches";
import { years } from "@/constants/years";
import { editProfileValidator } from "@/validators/edit-profile-validator";

const EditProfile = () => {
  const { user, setUser } = useUser();

  const [name, setName] = useState(user?.name);
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber);
  const [image, setImage] = useState(user?.image);
  const [branch, setBranch] = useState(user?.branch);
  const [rollNo, setRollNo] = useState(user?.rollNo);
  const [year, setYear] = useState(user?.year);

  const handleChange = useCallback(
    (
      type: "name" | "phoneNumber" | "branch" | "rollNo" | "year",
      value: string
    ) => {
      if (type === "name") {
        setName(value);
      } else if (type === "phoneNumber") {
        setPhoneNumber(value);
      } else if (type === "branch") {
        setBranch(value);
      } else if (type === "rollNo") {
        setRollNo(value);
      } else if (type === "year") {
        setYear(value);
      }
    },
    []
  );

  const pickImage = useCallback(async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
    });

    if (res.canceled) {
      return;
    }
    const base64 = `data:image/png;base64,${res.assets?.[0].base64}`;
    setImage(base64);
  }, []);

  const { mutate: handleEditProfile, isPending } = useMutation({
    mutationKey: ["edit-profile"],
    mutationFn: async () => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        throw new Error("Authenication failed. Please login again!");
      }

      if (
        name === user?.name &&
        phoneNumber === user?.phoneNumber &&
        image === user?.image &&
        branch === user?.branch &&
        year === user?.year &&
        rollNo === user?.rollNo
      ) {
        return { user, isChanged: false } as {
          user: UserType;
          isChanged: boolean;
        };
      }

      const parsedData = await editProfileValidator.parseAsync({
        name,
        image,
        year,
        branch,
        rollNo,
        phoneNumber,
      });

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/edit-profile/user`,
        { token, ...parsedData }
      );

      return { user: data.user, isChanged: true } as {
        user: UserType;
        isChanged: boolean;
      };
    },
    onSuccess: (data) => {
      if (data.isChanged) {
        setUser(data.user);
      }
      Alert.alert("Success", "Profile edited successfully", [
        {
          text: "Ok",
          onPress: router.back,
        },
      ]);
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-4`}
        keyboardShouldPersistTaps="handled"
      >
        <Header showBackButton />

        <Title>Edit Profile</Title>

        <View style={tw`gap-y-7 mt-10 items-center`}>
          <View style={tw`items-center`}>
            <View>
              <Image
                source={{
                  uri: image,
                }}
                style={tw`w-32 h-32 rounded-full`}
              />
              <Pressable
                style={tw`absolute bottom-0 right-0`}
                onPress={pickImage}
              >
                <MaterialIcons name="change-circle" size={40} color="white" />
              </Pressable>
            </View>
          </View>

          <View style={tw`gap-y-3 w-[80%]`}>
            <Text style={tw`text-white font-medium text-base ml-1`}>Name</Text>
            <TextInput
              style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
              placeholder="Enter new name"
              placeholderTextColor={"#fff"}
              value={name}
              onChangeText={(text) => handleChange("name", text)}
            />
          </View>

          <View style={tw`gap-y-3 w-[80%]`}>
            <Text style={tw`text-white font-medium text-base ml-1`}>
              Phone Number
            </Text>
            <TextInput
              style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
              placeholder="Enter new phone number"
              placeholderTextColor={"#fff"}
              value={phoneNumber}
              onChangeText={(text) => handleChange("phoneNumber", text)}
            />
          </View>

          <View style={tw`gap-y-3 w-[80%]`}>
            <Text style={tw`text-white font-medium text-base ml-1`}>
              Branch
            </Text>
            <View style={tw`w-full border border-white rounded-lg`}>
              <Picker
                selectedValue={branch}
                style={tw`w-full px-4 py-2 text-white`}
                dropdownIconColor={"#fff"}
                onValueChange={(value) => handleChange("branch", value)}
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
                onValueChange={(value) => handleChange("year", value)}
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
            <Text style={tw`text-white font-medium text-base ml-1`}>
              Roll Number
            </Text>
            <TextInput
              style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
              placeholder="Enter new phone number"
              placeholderTextColor={"#fff"}
              value={rollNo}
              onChangeText={(text) => handleChange("rollNo", text)}
            />
          </View>

          <Pressable
            style={tw`bg-violet-600 w-[80%] items-center py-3 justify-center rounded-lg`}
            onPress={() => handleEditProfile()}
            disabled={isPending}
          >
            <Text style={tw`text-white text-base font-semibold`}>
              Edit Profile
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeView>
  );
};

export default EditProfile;
