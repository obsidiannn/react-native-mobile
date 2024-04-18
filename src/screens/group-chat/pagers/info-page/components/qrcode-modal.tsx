import { GroupInfoItem } from "@/api/types/group";
import { Image } from "@/components/image";
import Navbar from "@/components/navbar";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Modal, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale } from "react-native-size-matters/extend";
import { Button } from "react-native-ui-lib";
import QRCode from 'react-native-qrcode-svg';
import ViewShot, { captureRef } from "react-native-view-shot";
import toast from "@/lib/toast";
export interface QRcodeModalRef {
    open: (params: {
        group: GroupInfoItem;
    }) => void;
}
export default forwardRef((_, ref) => {
    const [visible, setVisible] = useState(false);
    const insets = useSafeAreaInsets();
    const [group, setGroup] = useState<GroupInfoItem>();
    const [data, setData] = useState<string>("xxxx");
    const viewRef = useRef<ViewShot>(null);
    useImperativeHandle(ref, () => ({
        open: (params: {
            group: GroupInfoItem;
        }) => {
            console.log(params);
            setGroup(params.group);
            setData('gid=' + params.group?.id);
            setVisible(true);
        }
    }));
    return <Modal animationType="slide" visible={visible} style={{
        flex: 1,
    }}>
        <View style={{
            flex: 1,
            backgroundColor: '#F3F4F6',
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        }}>
            <Navbar backgroundColor='#F3F4F6' title="羣二維碼" onLeftPress={() => setVisible(false)} />
            <View style={{
                flex: 1,
                paddingHorizontal: scale(15),
            }}>
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: scale(16),
                    padding: scale(30),
                    marginTop: scale(20),
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.30,
                    shadowRadius: 1,
                    elevation: 1
                }}>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Image source={group?.avatar} style={{
                            width: scale(50),
                            height: scale(50),
                            borderRadius: scale(10),
                            backgroundColor: '#F6F6F6',
                            borderWidth: 1,
                            borderColor: '#ECECEC',
                            marginRight: scale(10),
                        }} />
                        <Text style={{
                            flex: 1,
                            fontSize: scale(15),
                            color: '#333',
                            fontWeight: '400',
                        }}>{group?.name}<Text style={{ fontSize: scale(14), color: '#999', fontWeight: '400' }}>({group?.member_total ?? 0}人)</Text></Text>
                    </View>
                    <ViewShot ref={viewRef} style={{
                        width: scale(280),
                        height: scale(280),
                        borderRadius: scale(16),
                        marginTop: scale(40),
                        backgroundColor: 'white',
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 0.30,
                        shadowRadius: 1,
                        elevation: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {data ? <QRCode
                            size={260}
                            value={data}
                        /> : null}
                    </ViewShot>
                    <View>
                        <Button onPress={() => {
                            if (viewRef.current == null) {
                                return;
                            }
                            captureRef(viewRef.current, {
                                format: "jpg",
                                quality: 0.8,
                                handleGLSurfaceViewOnAndroid: true,
                            }).then(uri => {
                                console.log(uri);
                                toast('保存到相冊成功');
                            });
                        }} borderRadius={scale(21)} backgroundColor="#EFF0F2" label="保存爲圖片" style={{
                            height: scale(42),
                            marginTop: scale(40),
                        }} labelStyle={{
                            fontSize: scale(14),
                            fontWeight: '700',
                            color: '#333',
                        }} />
                    </View>
                </View>
            </View>
        </View>
    </Modal>;
});