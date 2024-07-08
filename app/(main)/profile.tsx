import { View, Text, Alert, Image, Pressable, ScrollView } from "react-native";
import React, { useCallback } from "react";
import tw from "twrnc";
import * as SecureStore from "expo-secure-store";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import SafeView from "@/components/SafeView";
import { useUser } from "@/hooks/useUser";
import Header from "@/components/Header";

const Profile = () => {
  const { user, setUser } = useUser();

  const handleLogout = useCallback(() => {
    Alert.alert("Warning", "Do you want to logout", [
      {
        text: "No",
      },
      {
        text: "Yes",
        onPress: async () => {
          await SecureStore.deleteItemAsync("user");
          await SecureStore.deleteItemAsync("token");
          await AsyncStorage.removeItem("user-image");
          setUser(null);
          router.replace("/login");
        },
      },
    ]);
  }, []);

  return (
    <SafeView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />

        <View style={tw`items-center flex-row mt-5 px-6 gap-x-6`}>
          <Image
            source={{
              uri: user?.image,
            }}
            style={tw`w-20 h-20 rounded-full`}
          />

          <View>
            <Text style={tw`text-lg text-sky-400 font-bold`}>{user?.name}</Text>
            <Text style={tw`text-white`}>
              {user?.branch} {user?.year} year
            </Text>
          </View>
        </View>

        <View style={tw`mt-12 px-8 gap-y-5`}>
          <View style={tw`flex-row gap-x-6 items-center`}>
            <FontAwesome name="phone" size={24} color="white" />
            <Text style={tw`text-white text-base`}>{user?.phoneNumber}</Text>
          </View>
          <View style={tw`flex-row gap-x-5 items-center`}>
            <MaterialCommunityIcons name="gmail" size={24} color="white" />
            <Text style={tw`text-white text-base`}>{user?.email}</Text>
          </View>
        </View>

        <View style={tw`mt-7 bg-gray-500 h-[0.5px]`} />

        <View style={tw`gap-y-8 px-8 mt-7`}>
          <Pressable
            style={tw`flex-row gap-x-5 items-center`}
            onPress={() => router.navigate("/qr")}
          >
            <AntDesign name="qrcode" size={28} color="white" />
            <Text style={tw`text-white text-base`}>My QR Code</Text>
          </Pressable>
          <Pressable
            style={tw`flex-row gap-x-5 items-center`}
            onPress={() => router.navigate("/edit-profile")}
          >
            <Entypo name="edit" size={28} color="white" />
            <Text style={tw`text-white text-base`}>Edit Profile</Text>
          </Pressable>
          <Pressable
            style={tw`flex-row gap-x-5 items-center`}
            onPress={() => router.navigate("/change-password")}
          >
            <Entypo name="lock" size={28} color="white" />
            <Text style={tw`text-white text-base`}>Change Password</Text>
          </Pressable>
          <Pressable
            style={tw`flex-row gap-x-5 items-center`}
            onPress={handleLogout}
          >
            <MaterialCommunityIcons name="logout" size={28} color="red" />
            <Text style={tw`text-rose-500 text-base`}>Logout</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeView>
  );
};

export default Profile;
