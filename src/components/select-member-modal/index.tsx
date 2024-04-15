import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import { Modal, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Navbar from "@/components/navbar";
import { scale } from "react-native-size-matters/extend";
import BottomBar from "./bottom-bar";
import AplphabetIndex from "./alphabet-index";
import { FlashList } from "@shopify/flash-list";
import ListItemComponent from "./list-item";

export interface SelectMemberOption {
    id: string;
    icon: string;
    title: string;
    name: string;
    name_index: string;
    status: boolean;
    disabled: boolean;
}
export interface SelectMemberModalType {
    open: (params:{
        title: string;
        options: SelectMemberOption[],
        callback: (options: SelectMemberOption[]) => void
    }) => void;
}
export interface SelectMemberModalProps {
    disabledUids?: string[];
}

export default forwardRef((props: SelectMemberModalProps, ref) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [checkedAll, setCheckedAll] = useState<boolean>(false);
    const [contactAlphabetIndex, setContactAlphabetIndex] = useState<{ [key: string]: number }>({});
    const [aplphabet, setAplphabet] = useState<string[]>([]);
    const insets = useSafeAreaInsets();
    // users 为列表数据 可以为 string 或者 Item
    const [options, setOptions] = useState<SelectMemberOption[]>([]);
    const flashListRef = useRef<FlashList<(SelectMemberOption)>>(null);
    const callbackRef = useRef<(options: SelectMemberOption[]) => void>();
    const [title,setTitle] = useState('')
    // const init = useCallback(async () => {
    //     const list =await friendService.getList();
    //     setContactAlphabetIndex(list.alphabetIndex);
    //     setAplphabet(list.alphabet);
    //     setUsers(list.items.map((item) => {
    //         const disabled = props.disabledUids?.includes((item.uid).toString()) ?? false;
    //         return {
    //             ...item,
    //             status: false,
    //             disabled,
    //         };
    //     }));
    // },[]);
    useImperativeHandle(ref, () => ({
        open: (parmas:{
            title: string;
            options: SelectMemberOption[],
            callback: (users: SelectMemberOption[]) => void
        }) => {
            setTitle(title);
            callbackRef.current = parmas.callback;
            setOptions(parmas.options)
            setVisible(true);
        }
    }));
    return <Modal animationType="slide" transparent={true} visible={visible} style={{
        flex: 1,
    }}>
        <View style={{
            flex: 1,
            backgroundColor: 'white',
            paddingBottom: insets.bottom,
            paddingTop: insets.top,
        }}>
            <Navbar title={title} onLeftPress={() => {
                setCheckedAll(false)
                setVisible(false);
            }} />
            <View style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                backgroundColor: '#F4F4F4',
            }}>
                <View style={{
                    flex: 1,
                }}>
                    <FlashList
                        // style={{
                        //     flex: 1,
                        // }}
                    //    contentContainerStyle={{backgroundColor: 'blue'}}
                        data={options}
                        keyExtractor={(item) => item.id}
                        ref={flashListRef}
                        estimatedItemSize={scale(60)}
                        renderItem={({ item, index }) => {
                            let isLast = index === options.length - 1;
                            return <ListItemComponent item={item} index={index} isLast={isLast} onChange={(value) => {
                                const tmp = [...options];
                                (tmp[index] as SelectMemberOption).status = value;
                                setOptions(tmp);
                            }} />
                        }}
                    />
                </View>
                <View style={{
                    width: scale(24),
                }}>
                    <AplphabetIndex contactAlphabetIndex={contactAlphabetIndex} onScrollToIndex={(v) => {
                        flashListRef.current?.scrollToIndex({
                            index: v,
                            animated: true,
                        });
                    }} alphabet={aplphabet} />
                </View>
            </View>
            <BottomBar onCheckedAllChange={(v) => {
                if (v) {
                    const tmp = [...options];
                    tmp.forEach((item) => {
                        if (typeof item == 'string') {
                            return;
                        }
                        item.status = true;
                    });
                    setOptions(tmp);
                } else {
                    const tmp = [...options];
                    tmp.forEach((item) => {
                        if (typeof item == 'string') {
                            return;
                        }
                        item.status = false;
                    });
                    setOptions(tmp);
                }
                setCheckedAll(v);
            }} checkedAll={checkedAll} onConfirm={() => {
                const tmps: SelectMemberOption[] = [];
                options.forEach((item) => {
                    if (typeof item == 'string') {
                        return;
                    }
                    if (item.status) {
                        tmps.push(item);
                    }
                });
                callbackRef.current?.(tmps);
                setVisible(false);
            }} />
        </View>
    </Modal>
});