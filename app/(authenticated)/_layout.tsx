import React from "react";
import { Slot, Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DefaultTheme } from "@react-navigation/native";
import { usePush } from "@/hooks/usePush";

const Layout = () => {
  usePush();
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="board/[id]" />
      <Stack.Screen
        name="board/settings"
        options={{
          presentation: "modal",
          title: "Board menu",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={18} color={"#716E75"} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="board/invite"
        options={{
          presentation: "modal",
          title: "Manage board members",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: "#E3DFE9",
                borderRadius: 16,
                padding: 6,
              }}
            >
              <Ionicons name="close" size={18} color={"#716E75"} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="board/card/[id]"
        options={{
          presentation: "containedModal",
          title: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: DefaultTheme.colors.background,
          },
        }}
      />
    </Stack>
  );
};

export default Layout;
