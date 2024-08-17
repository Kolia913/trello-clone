import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import DropdownPlus from "@/components/DropdownPlus";
import { Ionicons } from "@expo/vector-icons";

const Layout = () => {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTitle: () => (
            <Image
              source={require("@/assets/images/trello-logo-gradient-white.png")}
              style={{ width: 120, height: 50, resizeMode: "contain" }}
            />
          ),
          headerRight: () => <DropdownPlus />,
        }}
      />
      <Stack.Screen
        name="new-board"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="templates"
        options={{
          title: "Start with a template",
          presentation: "fullScreenModal",
          headerRight: () => (
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
    </Stack>
  );
};

export default Layout;
