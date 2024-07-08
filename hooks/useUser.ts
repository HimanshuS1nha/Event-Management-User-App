import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserType = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  rollNo: string;
  branch: string;
  year: string;
  image: string;
};

type UseUserType = {
  user: UserType | null;
  getUser: () => Promise<void>;
  setUser: (user: UserType | null) => void;
};

export const useUser = create<UseUserType>((set) => ({
  user: null,
  getUser: async () => {
    const image = await AsyncStorage.getItem("user-image");
    const storedUser = await SecureStore.getItemAsync("user");
    if (storedUser && image) {
      set({ user: { ...JSON.parse(storedUser as string), image } });
    } else {
      set({ user: {} as never });
    }
  },
  setUser: (user) => {
    set({ user });
  },
}));
