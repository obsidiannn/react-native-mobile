import { StyleSheet, View } from "react-native"
import { scale, verticalScale } from "react-native-size-matters/extend"
import ListItem from "./list-item"
import { FlashList } from "@shopify/flash-list"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { FriendInfoItem } from "@/api/types/friend";
import AlphabetIndex from "./alphabet-index";
import Navbar from "@/components/navbar";
import groupApi from "@/api/v2/group"
import { RootStackParamList } from "@/types"
import { StackScreenProps } from "@react-navigation/stack"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { GroupInfoDto, GroupInfoItem } from "@/api/types/group"
type Props = StackScreenProps<RootStackParamList, 'GroupList'>;
export interface GroupListType {
    focus: () => void;
}

const GroupListScreen = ({ navigation, route }: Props) => {
    const insets = useSafeAreaInsets();
    const [contactAlphabetIndex, setContactAlphabetIndex] = useState<{ [key: string]: number }>({});
    const listRef = useRef<FlashList<any>>(null);
    const [aplphabet, setAplphabet] = useState<string[]>([]);
    const [groupList, setGroupList] = useState<(GroupInfoDto)[]>([]);
    
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            groupApi.mineGroupList({}).then(res =>{
                const gids = res.gids??[]
                if(gids.length > 0){
                    groupApi.groupInfoList(res).then(resp=>{
                        setGroupList(resp.items)
                    })
                }
            })
        });
        return unsubscribe;
    }, [navigation])
              
    // createRecordInTransaction("posts",(e)=>{
    //     e.title = "title"
    //     e.body= "body"
    //     e.subtitle ="sub",
    //     e.isPinned = false
    // }).then(r=>{
    // console.log("插入数据库");
    // console.log(r)
    // })
   
    return <View style={{
        ...styles.container,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
    }}>
        
        <View style={{
            flex: 1,
        }}>
          <Navbar title="群聊" backgroundColor="white" />
            <View style={{
                flex: 1,
                flexDirection: 'row',
            }}>
                <FlashList
                    ref={listRef}
                    data={groupList}
                    renderItem={({ item, index }) => {
                        return <ListItem item={item} isLast={index === groupList.length - 1} />;
                    }}
                    estimatedItemSize={scale(60)}
                />
            </View>
        </View>
        <View style={{
            width: scale(32)
        }}>
            <AlphabetIndex alphabet={aplphabet} contactAlphabetIndex={contactAlphabetIndex} onScrollToIndex={(v) => {
                listRef.current?.scrollToIndex({
                    index: v,
                    animated: true,
                });
            }} />
        </View>

    </View>
}


export default GroupListScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        backgroundColor: 'white',
    },
});