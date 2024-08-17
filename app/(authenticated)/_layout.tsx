import React from "react";
import { Slot, Stack } from "expo-router";

const Layout = () => {
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
        }}
      />
    </Stack>
  );
};

export default Layout;
