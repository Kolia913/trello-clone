import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { TaskList } from "@/types/enums";
import { DefaultTheme } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

export interface ListViewProps {
  taskList: TaskList;
}

const ListView = ({ taskList }: ListViewProps) => {
  const [listName, setListName] = useState<string>(taskList.title);
  return (
    <View
      style={{
        paddingTop: 20,
        paddingHorizontal: 30,
      }}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.listTitle}>{listName}</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={22}
              color={Colors.grey}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F3EFFC",
    borderRadius: 4,
    padding: 6,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    alignItems: "center",
  },
  input: {
    padding: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.2,
    borderRadius: 4,
  },
  listTitle: {
    paddingVertical: 8,
    fontWeight: "500",
  },
  deleteBtn: {
    backgroundColor: "#fff",
    padding: 8,
    marginHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  container: {
    backgroundColor: DefaultTheme.colors.background,
    flex: 1,
    gap: 16,
  },
});
export default ListView;
