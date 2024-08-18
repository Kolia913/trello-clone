import { View, Text, StyleSheet, Button } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Task, TaskList } from "@/types/enums";
import { DefaultTheme } from "@react-navigation/native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useSupabase } from "@/context/SupabaseContext";
import DraggableFlatList, {
  DragEndParams,
} from "react-native-draggable-flatlist";
import * as Haptics from "expo-haptics";
import ListItem from "./ListItem";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useAuth } from "@clerk/clerk-expo";

export interface ListViewProps {
  taskList: TaskList;
  onDeleteTaskList: (id: string) => void;
}

const ListView = ({ taskList, onDeleteTaskList }: ListViewProps) => {
  const [listName, setListName] = useState<string>(taskList.title);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["40%"], []);

  const {
    deleteBoardList,
    updateBoardList,
    getListCards,
    addListCard,
    updateCard,
    getRealtimeCardSubscription,
    uploadFile,
  } = useSupabase();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);

  const { userId } = useAuth();

  useEffect(() => {
    loadListTasks();

    const subscription = getRealtimeCardSubscription!(
      taskList.id,
      handleRealtimeChanges
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleRealtimeChanges = (
    update: RealtimePostgresChangesPayload<any>
  ) => {
    const record = update.new?.id ? update.new : update.old;
    const event = update.eventType;

    if (!record) return;

    if (event === "INSERT") {
      setTasks((prev) => {
        return [...prev, record];
      });
    } else if (event === "UPDATE") {
      setTasks((prev) => {
        return prev
          .map((task) => {
            if (task.id === record.id) {
              return record;
            }
            return task;
          })
          .filter((t) => !t.done)
          .sort((a, b) => a.position - b.position);
      });
    } else if (event === "DELETE") {
      setTasks((prev) => {
        return prev.filter((item) => item.id !== record.id);
      });
    } else {
      console.log("Unhandled event :(");
    }
  };

  const loadListTasks = async () => {
    const cards = await getListCards!(taskList.id);
    setTasks(cards);
  };

  const onAddCard = async () => {
    await addListCard!(taskList.id, taskList.board_id, newTask, tasks.length);
    setIsAdding(false);
    setNewTask("");
    // setTasks([...tasks, data]);
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        opacity={0.2}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
        onPress={() => bottomSheetModalRef.current?.close()}
      />
    ),
    []
  );

  const onUpdateTaskList = async () => {
    await updateBoardList!(taskList, listName);
  };
  const onDeleteList = async () => {
    await deleteBoardList!(taskList.id);
    onDeleteTaskList(taskList.id);
    bottomSheetModalRef.current?.close();
  };

  const onTaskDrop = async (params: DragEndParams<Task>) => {
    const newData = params.data.map((item, index) => {
      return { ...item, position: index };
    });
    setTasks(newData);

    const promises: Promise<any>[] = [];

    newData.forEach((item) => promises.push(updateCard!(item)));
    await Promise.all(promises);
  };

  const onSelectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const img = result.assets[0];
      const base64 = await FileSystem.readAsStringAsync(img.uri, {
        encoding: "base64",
      });
      const fileName = `${new Date().getTime()}-${userId}.${
        img.type === "image" ? "png" : "mp4"
      }`;
      const filePath = `${taskList.board_id}/${fileName}`;
      const contentType = img.type === "image" ? "image/png" : "video/mp4";
      const storagePath = await uploadFile!(filePath, base64, contentType);

      if (storagePath) {
        await addListCard!(
          taskList.id,
          taskList.board_id,
          fileName,
          tasks.length,
          storagePath
        );
      }
    }
  };

  return (
    <BottomSheetModalProvider>
      <View
        style={{
          paddingTop: 20,
          paddingHorizontal: 30,
        }}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.listTitle}>{listName}</Text>
            <TouchableOpacity
              onPress={() => bottomSheetModalRef.current?.present()}
            >
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={22}
                color={Colors.grey}
              />
            </TouchableOpacity>
          </View>
          <DraggableFlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={ListItem}
            contentContainerStyle={{
              gap: 4,
              paddingBottom: 4,
            }}
            onDragEnd={onTaskDrop}
            onDragBegin={() =>
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            }
            onPlaceholderIndexChange={() =>
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            }
          />

          {isAdding && (
            <TextInput
              style={styles.input}
              value={newTask}
              onChangeText={setNewTask}
              autoFocus
            />
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 8,
              marginVertical: 8,
            }}
          >
            {!isAdding && (
              <>
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center" }}
                  onPress={() => setIsAdding(true)}
                >
                  <Ionicons name="add" size={14} />
                  <Text
                    style={{
                      fontSize: 12,
                    }}
                  >
                    Add card
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onSelectImage}>
                  <Ionicons name="image-outline" size={18} />
                </TouchableOpacity>
              </>
            )}
            {isAdding && (
              <>
                <TouchableOpacity onPress={() => setIsAdding(false)}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: Colors.primary,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onAddCard}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: Colors.primary,
                      fontWeight: "bold",
                    }}
                  >
                    Add
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>

      <BottomSheetModal
        enablePanDownToClose
        enableOverDrag={false}
        keyboardBlurBehavior="restore"
        handleStyle={{
          backgroundColor: DefaultTheme.colors.background,
          borderRadius: 12,
        }}
        backdropComponent={renderBackdrop}
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
      >
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 10,
            }}
          >
            <Button
              title="Cancel"
              onPress={() => bottomSheetModalRef.current?.close()}
            />
          </View>
          <View
            style={{
              backgroundColor: "#fff",
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <Text style={{ color: Colors.grey, fontSize: 12, marginBottom: 5 }}>
              List name
            </Text>
            <BottomSheetTextInput
              style={{ fontSize: 16, color: Colors.fontDark }}
              returnKeyType="done"
              enterKeyHint="done"
              onEndEditing={onUpdateTaskList}
              onChangeText={(e) => setListName(e)}
              value={listName}
            />
          </View>

          <TouchableOpacity onPress={onDeleteList} style={styles.deleteBtn}>
            <Text style={{ color: "red" }}>Close List</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
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
