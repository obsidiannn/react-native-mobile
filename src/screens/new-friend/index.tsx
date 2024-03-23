import { StyleSheet, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import Navbar from "@/components/navbar";
import NavbarRight from "./components/navbar-right";
import { scale } from "react-native-size-matters/extend";
import InviteItem from "./components/invite-item";
type Props = StackScreenProps<RootStackParamList, 'NewFriend'>;
import friendApi from "@/api/v2/friend";
import { FriendInviteApplyItem } from '@/api/types/friend'
import { RootStackParamList } from "@/types";
import userService from "@/service/user.service";

const NewFriendScreen = ({navigation }: Props) => {
    const insets = useSafeAreaInsets();
    const [items, setItems] = useState<FriendInviteApplyItem[]>([]);
    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', async () => {
            const res = await friendApi.getInviteList()
                
                if(res.items.length > 0){
                const uids = res.items.map(i=>i.objUid)
                const userHash = await userService.getUserHash(uids)
                let change = false
                res.items.forEach(ri=>{
                    const user = userHash.get(ri.objUid)
                    if(user){
                        change = true
                        ri.avatar = user.avatar
                        ri.name = user.name
                    }
                })
                    setItems(res.items);
                }
        });
        return unsubscribe;
    },[navigation])
    return (
        <View style={{
            ...styles.container,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        }}>
            <View>
                <Navbar renderRight={() => <NavbarRight/>} title="新的好友" />
            </View>
            <View style={styles.listContainer}>
                <FlashList
                    data={items}
                    renderItem={({ item, index }) => <InviteItem item={item} isLast={index === items.length - 1} />}
                    estimatedItemSize={scale(76)}
                >
                </FlashList>
            </View>
        </View>
    );
};

export default NewFriendScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
            backgroundColor: 'white',
    },
    listContainer: {
        flex: 1,
        width: '100%' 
    }
})