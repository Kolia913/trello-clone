import { View, Text, StyleSheet, RefreshControl } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useSupabase } from "@/context/SupabaseContext";
import { Board } from "@/types/enums";
import { Link, useFocusEffect } from "expo-router";
import { FlatList } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";
import { TouchableOpacity } from "@gorhom/bottom-sheet";

const Page = () => {
  const { getBoards } = useSupabase();

  const [boards, setBoards] = useState<Board[]>([]);
  const [refreshing, _setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadBoards();
    }, [])
  );

  const loadBoards = async () => {
    const data = await getBoards!();
    setBoards(data);
  };

  const ListItem = ({ item }: { item: Board }) => (
    <Link
      // @ts-ignore
      href={`/(authenticated)/board/${item.id}?bg=${encodeURIComponent(
        item.background
      )}`}
      key={item.id}
      style={styles.listItem}
      asChild
    >
      <TouchableOpacity>
        <View
          style={[styles.colorBlock, { backgroundColor: item.background }]}
        />
        <Text style={{ fontSize: 16 }}>{item.title}</Text>
      </TouchableOpacity>
    </Link>
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={boards}
        contentContainerStyle={!!boards.length && styles.list}
        renderItem={ListItem}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.grey,
              marginStart: 50,
            }}
          ></View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadBoards} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
  },
  list: {
    borderColor: Colors.grey,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    gap: 10,
  },
  colorBlock: {
    width: 30,
    height: 30,
    borderRadius: 4,
  },
});

export default Page;
