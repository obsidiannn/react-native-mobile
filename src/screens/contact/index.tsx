import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/navbar";
import Tabbar from "./components/tabbar";
import { scale } from "react-native-size-matters/extend";
import PagerView from "react-native-pager-view";
import FriendList, { FriendListType } from "./components/friend-list/index";
import GroupList, { GroupListType } from "./components/group-list/index"
import { RootStackParamList } from "@/types";
type Props = StackScreenProps<RootStackParamList, 'Contact'>;


const ContactScreen = ({ navigation }: Props) => {
    const insets = useSafeAreaInsets();
    const [pageIndex, setPageIndex] = useState(0);
    const pagerViewRef = useRef<PagerView>(null);
    const friendListRef = useRef<FriendListType>(null);
    const groupListRef = useRef<GroupListType>(null);
    useEffect(() => {
        const focusListener = navigation.addListener('focus', () => {
            console.log('contact screen focus');
            friendListRef.current?.focus();
            groupListRef.current?.focus();
        });
        return focusListener;
    },[])
    return (
        <View style={{
            ...styles.container,
            paddingTop: insets.top,
        }}>
            <View>
                <Navbar title="通讯录" renderLeft={() => null} />
            </View>
            {/* <View style={{
                paddingHorizontal: scale(10),
                paddingVertical: scale(20),
                backgroundColor: '#F4F4F4'
            }}>
                <Tabbar index={pageIndex} onChange={(v) => {
                    setPageIndex(v)
                    pagerViewRef.current?.setPage(v);
                }} />
            </View> */}
            <PagerView ref={pagerViewRef} onPageSelected={(e) => {
                const index = e.nativeEvent.position;
                setPageIndex(index);
            }} style={{ flex: 1 }} initialPage={pageIndex} scrollEnabled={true}>
                <FriendList ref={friendListRef} key="0" />
                {/* <GroupList ref={groupListRef} key="1" /> */}
            </PagerView>
        </View>
    )
}
export default ContactScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    listContainer: {
        flex: 1,
    }
})