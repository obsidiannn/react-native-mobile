import {useState,useEffect} from 'react'
import { StyleSheet, View,TouchableOpacity,Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import group,{GroupCategoryListParams,GroupCategoryListItem} from "@/api/group"
import {Chip,Button} from 'react-native-ui-lib'
import { scale } from 'react-native-size-matters/extend';
import toast from '@/lib/toast';
const CategoryItemContainer = (
  props: {
    groupId: string;
    categoryList: GroupCategoryListItem[];
    choose: number;
    maxChoose: number;
    onChange: (index: number,flag: boolean)=>void; 
  }
) => {
  const insets = useSafeAreaInsets();
  return (
      <View style={[
        styles.container,
          {paddingTop: insets.top},
          {paddingBottom: insets.bottom},
      ]}>
          <View style={styles.textArea}>
            <Text style={styles.textA}>设置分类，精准定位</Text>
            <Text style={styles.textB}>已选 {props.choose}/{props.maxChoose}</Text>
          </View>
          <View style={styles.listContainer}>
            <View style={styles.itemContainer}>
                {
              props.categoryList.map((item,index)=>{
                return <Chip key={item.id}
                  containerStyle={[styles.item,item.checked?styles.itemChecked:styles.itemUnCheck]}
                  labelStyle={item.checked?{color:"white"}:{color:"black"}}
                  label={item.name} 
                  borderRadius={scale(24)}
                  onPress={()=>{props.onChange(index,!item.checked)}
                } 
              />
              })
            }
            </View>

            <View style={styles.bottomArea}>
              <Button style={[styles.button,{backgroundColor: "#EFF0F2"}]} label='重置' labelStyle={[styles.buttonFont,{color: "#333333"}]} size='small' >
              </Button>
              <Button style={[styles.button,{backgroundColor: "#5B6979"}]} label='确定' labelStyle={[styles.buttonFont]} size='small' >
              </Button>
            </View>
          </View> 
      </View>
  );
};


const styles = StyleSheet.create({
  container:{
    backgroundColor:"#f3f4f6",
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
    borderRadius: scale(24),
    padding: '5%',
    justifyContent: 'space-between',
  },
  itemContainer:{
    alignItems: "center",
    justifyContent:"flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  item:{
    marginBottom: scale(20),
    marginRight: scale(10),
    height: scale(40),
    borderWidth: scale(1),
    textAlign:"center",
    borderColor: '#f3f4f6',
  },

  itemUnCheck:{
    backgroundColor: "white",
  },
  itemChecked:{
    backgroundColor: '#374151',
  },

  bottomArea:{
    flexDirection: "row",
    justifyContent: 'space-between', 
    paddingLeft: "5%",
    paddingRight: "5%",
    marginBottom: "5%"
    
  },

  button: {
    width: scale(122),
    height: scale(42),
    borderRadius: scale(30),
    paddingHorizontal: scale(11),
    justifyContent: 'center',
  },
  buttonFont:{
    fontSize: scale(14),
    textAlign: "center"
// align-items: center;
// text-align: center;
  }


})

export default CategoryItemContainer
