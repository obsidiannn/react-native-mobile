import {useState,useEffect} from 'react'
import { StyleSheet, View,TouchableOpacity } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Navbar from "@/components/navbar";
import group,{GroupCategoryListParams,GroupCategoryListItem} from "@/api/group"
import {Chip, Text} from 'react-native-ui-lib'
import { scale } from 'react-native-size-matters/extend';
import toast from '@/lib/toast';
const CategoryItemContainer = () => {
  const insets = useSafeAreaInsets();
  const maxChoose = 3;
  const [choose, setChoose] = useState<GroupCategoryListItem[]>([]);
  const [categoryList,setCategoryList] = useState<GroupCategoryListItem[]>([
    {id: "1",name: "分类1"},
    {id: "2",name: "分类2"},
    {id: "3",name: "分类3"},
    {id: "4",name: "分类4"},
    {id: "5",name: "分类4"},
    {id: "6",name: "分类4"},
    {id: "7",name: "分类4"},
    {id: "8",name: "分类4"},
  ])

  useEffect(() => {
    return () => {};
  }, [choose]); 

  const itemOnCheck = ((item:GroupCategoryListItem)=>{
    let index = choose.findIndex((i)=>{
      return i.id === item.id
    })
    
    if(index <= -1){
      if(choose.length >= maxChoose){
        toast("超过最大长度")
        return
      }
      setChoose([...choose,item])
    }else{
      choose.splice(index,1)
      setChoose([...choose])
    }
  })
  return (
      <View style={[
        styles.container,
          {paddingTop: insets.top},
          {paddingBottom: insets.bottom},
      ]}>
          <View style={styles.textArea}>
            <Text style={styles.textA}>设置分类，精准定位</Text>
            <Text style={styles.textB}>已选 {choose.length}/{maxChoose}</Text>
          </View>
          <View style={styles.listContainer}>
         {
          categoryList.map((item,index)=>{
            let checked = choose.findIndex(i=>{return i.id === item.id}) > -1
              return <Chip 
              containerStyle={[styles.item,checked?styles.itemChecked:styles.itemUnCheck]}
              label={item.name} 
              borderRadius={scale(24)}
              onPress={()=>{itemOnCheck(item)}}
              resetSpacings={true}
              />
          })
         }
          </View>
          {/* <View style={styles.bottom}>

          </View> */}
      </View>
  );
};


const styles = StyleSheet.create({
  container:{
    justifyContent:"center",
    alignItems: "center"
  },
  textArea: {
    width: '90%',
    marginTop: scale(50),
    marginLeft: scale(20),
    marginBottom: scale(20),
    flexDirection: "row",
    alignItems: "baseline",
  },
  textA:{
    fontSize: scale(16),    
    color: '#4b5563',
  },
  textB:{
    color: '#6b7280',
    fontSize: scale(10),   
    marginLeft: scale(10)
  },
  listContainer:{
    width: '90%',
    height: '80%',
    backgroundColor: "white",
    justifyContent:"center",
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: scale(24)
  },
  item:{
    margin: scale(10),
    width: scale(60),
    height: scale(40),
    borderWidth: scale(1),
    textAlign:"center",
    borderColor: '#f3f4f6',
  },

  itemUnCheck:{
    backgroundColor: "white",
    color: "blue"
  },
  itemChecked:{
    backgroundColor: '#374151',
    color: "white"
  },

  bottom:{
    flex: 1,
    width: '90%',
    height: "10%",
    backgroundColor:"blue",
    marginBottom: scale(20),
    flexDirection: "row",
    alignItems: "baseline",
  }

})

export default CategoryItemContainer
