import { StyleSheet, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Navbar from "@/components/navbar";
import CategoryItemContainer  from "./group-category-item";
import { forwardRef, useImperativeHandle, useState } from "react";
import groupApi from "@/api/v2/group"
import {GroupCategoryListParams,GroupCategoryListItem} from '@/api/types/group'
import { Modal } from "react-native-ui-lib"
import { scale } from "react-native-size-matters/extend";

//  羣分類
export interface GroupCategoryModalRef {
  open: (id: string) => void;
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: 'gray-100',
  },
  listContainer: {
    backgroundColor: 'write',
  }
})

export default forwardRef((props: {
  onCheck: () => void;
}, ref) => {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [groupId, setGroupId] = useState<string>('');
  const max = 3;
  const [choose,setChoose] = useState(0)
  const [categoryList,setCategoryList] = useState<GroupCategoryListItem[]>([
    {id: "1",name: "分類1",checked: false},
    {id: "2",name: "分類2",checked: false},
    {id: "3",name: "分類3",checked: false},
    {id: "4",name: "分類4",checked: false},
    {id: "5",name: "分類4",checked: false},
    {id: "6",name: "分類4",checked: false},
    {id: "7",name: "分類4",checked: false},
    {id: "8",name: "分類4",checked: false},
  ])

  useImperativeHandle(ref, () => ({
    open: (id: string) => {
        setGroupId(id);
        setVisible(true);
    }
}));

  return (
      <Modal style={{
        flex: 1,
    }} animationType="slide" visible={visible}  >
        <View style={
          {...styles.container,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,}
        }>
          <Navbar title="羣分類" backgroundColor="gray-100" onLeftPress={() => setVisible(false)}/>
          <View style={{flex:1,backgroundColor: "#f3f4f6",padding:scale(15)}}>
              <CategoryItemContainer  
                  groupId={groupId} 
                  categoryList={categoryList} 
                  choose={choose}
                  maxChoose={max}
                  onChange={(index: number,flag: boolean)=>{
                    let temp  = [...categoryList]
                    let isChecked = temp.filter((e,i)=>{
                      return e.checked && i === index;
                    }).length > 0
                    
                    if(flag && !isChecked && choose >= max){
                        return
                    }
                    temp[index].checked = flag
                    setChoose(temp.filter(i=>{return i.checked}).length)
                    setCategoryList(temp)
              }}
              />
          </View>
          </View>
      </Modal>
  );
});