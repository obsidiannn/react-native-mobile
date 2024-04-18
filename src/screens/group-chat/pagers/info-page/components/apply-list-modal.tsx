import { GroupApplyItem } from "@/api/types/group";
import Navbar from "@/components/navbar";
import groupService from "@/service/group.service";
import { forwardRef, useImperativeHandle, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Modal } from "react-native-ui-lib"
import ApplyListItemComponent from "./apply-list-item";
export interface ApplyListModalRef {
    open: (id: string) => void;
}
export default forwardRef((props: {
    onCheck: (item: GroupApplyItem) => void;
}, ref) => {
    const [visible, setVisible] = useState(false);

    const insets = useSafeAreaInsets();
    const [gid, setGid] = useState<string>('');
    const [items, setItems] = useState<GroupApplyItem[]>([]);
    useImperativeHandle(ref, () => ({
        open: (id: string) => {
            setGid(id);
            groupService.applyList([id]).then(res => {
                console.log('applyList',res);
                //props
                setItems(res.items);
            });
            setVisible(true);
        }
    }));
    return <Modal animationType="slide" visible={visible} style={{
        flex: 1,
    }}>
        <View style={{
            flex: 1,
            backgroundColor: 'white',
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        }}>
            <Navbar backgroundColor='white' title="申請列表" onLeftPress={() => setVisible(false)} />
            <View>
                {items.map(item => {
                    const isLast = items.indexOf(item) === items.length - 1;
                    return <ApplyListItemComponent onCheck={() => {
                        props.onCheck(item);
                        setVisible(false);
                    }} item={item} isLast={isLast}/>
                })}
            </View>
        </View>
    </Modal>
});
