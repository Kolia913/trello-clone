import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as DropdownMenu from "zeego/dropdown-menu";

const DropdownPlus = () => {
  const router = useRouter();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <TouchableOpacity>
          <Ionicons name="add" size={32} color={"white"} />
        </TouchableOpacity>
      </DropdownMenu.Trigger>
      {/* @ts-ignore */}
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Item
            key="board"
            onSelect={() =>
              router.push("/(authenticated)/(tabs)/boards/new-board")
            }
          >
            <DropdownMenu.ItemTitle>Create a board</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon
              ios={{
                name: "square.split.2x1",
                pointSize: 24,
              }}
            ></DropdownMenu.ItemIcon>
          </DropdownMenu.Item>
          <DropdownMenu.Item key="card">
            <DropdownMenu.ItemTitle>Create a card</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon
              ios={{
                name: "square.topthird.inset.filled",
                pointSize: 24,
              }}
            ></DropdownMenu.ItemIcon>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Item
          key="templates"
          onSelect={() =>
            router.push("/(authenticated)/(tabs)/boards/templates")
          }
        >
          <DropdownMenu.ItemTitle>Browse templates</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default DropdownPlus;
