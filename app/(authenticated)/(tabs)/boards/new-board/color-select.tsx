import { Colors } from "@/constants/Colors";
import { COLORS, DEFAULT_COLOR } from "@/types/enums";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, TouchableOpacity } from "react-native";

const Page = () => {
  const [selected, setSelected] = useState<string>(DEFAULT_COLOR);
  const router = useRouter();

  const onColorSelect = (color: string) => {
    setSelected(color);
    router.back();
    router.setParams({ bg: color });
  };

  return (
    <View
      style={{
        flexDirection: "row",
        flexGrow: 1,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {COLORS.map((color) => (
        <TouchableOpacity
          key={color}
          style={{
            backgroundColor: color,
            height: 100,
            width: 100,
            margin: 5,
            borderRadius: 4,
            borderWidth: selected === color ? 2 : 0,
            borderColor: Colors.fontDark,
          }}
          onPress={() => {
            onColorSelect(color);
          }}
        />
      ))}
    </View>
  );
};
export default Page;
