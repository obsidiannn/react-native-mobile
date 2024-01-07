import { StyleSheet, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Navbar from "@/components/navbar";
import CategoryItemContainer  from "./components/category-items";

//  群分类
type Props = StackScreenProps<RootStackParamList, 'GroupCategory'>;

const GroupCategoryListScreen = ({navigation }: Props) => {
  const insets = useSafeAreaInsets();
  return (
      <View style={{
          ...styles.container,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
      }}>
          <View>
              <Navbar title="群分类" backgroundColor="gray-100"/>
          </View>
          <View style={styles.listContainer}>
              <CategoryItemContainer/>
          </View>
      </View>
  );
};


const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: 'gray-100',
  },
  listContainer: {
    backgroundColor: 'write',
  }
})

export default GroupCategoryListScreen