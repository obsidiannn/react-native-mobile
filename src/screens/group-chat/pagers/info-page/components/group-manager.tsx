import { StyleSheet, View,Text,ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Navbar from "@/components/navbar";
import { forwardRef, useImperativeHandle, useState } from "react";
import {GroupInfoItem, GroupMemberItem} from "@/api/types/group"
import { Modal,Button } from "react-native-ui-lib"
import { scale } from 'react-native-size-matters/extend';
import { Image } from "@/components/image";
import RemixIcon from "@/components/common/remix-icon"
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
//  羣分類
export interface GroupManagerModalRef {
  open: (id: string) => void;
}

export default forwardRef((props: {
  onCheck: () => void;
}, ref) => {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [groupId, setGroupId] = useState<string>('');
  const maxManager = 5;
  const [managerDescribe,setManagerDescribe] = useState([
    "1.修改羣聊名稱","2.發表羣公告","3.設置退羣方式，並可確認退羣申請","4.移除成員"
  ]);
  const [managers,setManagers] = useState<GroupMemberItem[]>([
    {
      id: "1",
      name: "name1",
      avatar: "https://avatars.githubusercontent.com/u/122279700?v=4",
      notice: "null",
      desc: "",
      member_total: 1,
      member_limit: 1,
      owner: "",
      notice_md5: "",
      pub: "",
  },
   {
    id: "2",
    name: "name2",
    avatar: "https://avatars.githubusercontent.com/u/122279700?v=4",
    notice: "null",
    desc: "",
    member_total: 1,
    member_limit: 1,
    owner: "",
    notice_md5: "",
    pub: "",
}, {
  id: "3",
  name: "name3",
  avatar: "https://avatars.githubusercontent.com/u/122279700?v=4",
  notice: "null",
  desc: "",
  member_total: 1,
  member_limit: 1,
  owner: "",
  notice_md5: "",
  pub: "",
},
{
  id: "4",
  name: "name3",
  avatar: "https://avatars.githubusercontent.com/u/122279700?v=4",
  notice: "null",
  desc: "",
  member_total: 1,
  member_limit: 1,
  owner: "",
  notice_md5: "",
  pub: "",
}, {
  id: "5",
  name: "name3",
  avatar: "https://avatars.githubusercontent.com/u/122279700?v=4",
  notice: "null",
  desc: "",
  member_total: 1,
  member_limit: 1,
  owner: "",
  notice_md5: "",
  pub: "",
}
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
          <Navbar title="管理員" backgroundColor="white" onLeftPress={() => setVisible(false)}/>
          <ScrollView style={styles.mainContainer}>
            <View style={{marginTop:"5%"}}>
              <Text style={styles.titleStyle}>羣管理員可以擁有以下權利</Text>
              <View style={styles.groupDescribe}>
                {
                  managerDescribe.map(
                    (e,i)=>{
                      return <Text style={{color: "#6b7280",marginTop: scale(5),marginBottom: scale(5)}} key={i}> {e} </Text>
                    }
                  )
                }
              </View>
            </View>

            <View>
              <Text style={styles.titleStyle}>現羣管理員</Text>
              <View style={styles.managerList}>
                {
                  managers.map((e,i)=>{
                    return <View style={styles.managerItem} key={e.id + "member"}>
                      <View style={{flexDirection:"row",alignItems:"center"}}>
                      <Image source={e.avatar} style={styles.avatar}/>
                      <Text style={{color: "#4b5563",marginLeft:scale(10),fontSize:scale(18)}}>{e.name}</Text> 
                      </View>
                      
                      <Icon key={e.id + "icon"} name='delete-outline' size={scale(24)} color="#9ca3af" style={{alignSelf:"center"}}/>
                    </View>
                  }) 
                }


              </View>
              
            </View>
            <Button style={[styles.button,{backgroundColor: "#5B6979"}]} label='確定' labelStyle={[styles.buttonFont]} size='small' >
            </Button>
            
          </ScrollView>
          </View>
      </Modal>
  );
});



const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  mainContainer: {flex: 1,
    padding: "5%"
  },

  titleStyle:{
    color:"black",
    marginLeft: scale(30),
    marginTop:"5%",
    marginBottom: "5%",
    fontWeight: "bold",
  },
  groupDescribe:{
    backgroundColor:"#f3f4f6",
    padding: scale(20),
    borderRadius: scale(15),

  },
  managerList:{
    // backgroundColor:"yellow",
  },
  managerItem:{
    marginTop:"5%",
    padding:scale(10),
    paddingLeft: scale(20),
    paddingRight: scale(20),
    backgroundColor:"#f3f4f6",
    flexDirection:"row",
    justifyContent: 'space-between',
    borderRadius: scale(15),
  },
  avatar: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    borderWidth: 1,
    borderColor: '#F0F0F0',
},


button: {
  marginTop: scale(40),
  marginBottom: scale(40),
  borderRadius: scale(15),
  paddingVertical:scale(15),
  justifyContent: 'center',
},
buttonFont:{
  fontSize: scale(14),
  textAlign: "center"
}


})
