import { Image } from "expo-image";
import { useRef, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { scale } from "react-native-size-matters/extend";
import colors from "@/config/colors";
import BottomOptionModal, { BottomOptionModalType } from "@/components/bottom-option-modal";
import { chooseImage } from "@/service/file.service";

export default (props: {
    onChange: (v: string) => void
}) => {
    const [avatar, setAvatar] = useState<string>('');
    const bottomOptionModalRef = useRef<BottomOptionModalType>();
    
    const options = [
        {
            title: '拍照',
            onPress: () => {
                chooseImage(true, {
                    aspect: [1, 1],
                    quality: 0.5,
                }).then((uri) => {
                    if (!uri) {
                        return;

                    }
                    setAvatar(uri);
                    props.onChange(uri);
                });
            }
        },
        {
            title: '從相冊選擇',
            onPress: () => {
                chooseImage(false, {
                    aspect: [1, 1],
                    quality: 0.5,
                }).then((uri) => {
                    if (!uri) {
                        return;
                    }
                    setAvatar(uri);
                    props.onChange(uri);
                });
            }
        },
    ];
    return <>
        <TouchableOpacity style={styles.container} onPress={() => {
            bottomOptionModalRef.current?.open();
        }}>
            {avatar ? <Image source={avatar} style={styles.avatar} /> : null}
            <Image source={require('@/assets/icons/circle-plus-primary.svg')} style={styles.icon} />
        </TouchableOpacity>
        <BottomOptionModal ref={bottomOptionModalRef} items={options} />
    </>
}
const styles = StyleSheet.create({
    container: {
        width: scale(64),
        height: scale(64),
        borderRadius: scale(32),
        backgroundColor: colors.primary,
    },
    avatar: {
        width: scale(64),
        height: scale(64),
        borderRadius: scale(32),
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    icon: {
        position: 'absolute',
        bottom: scale(0),
        right: scale(0),
        width: scale(22),
        height: scale(22),
        borderRadius: scale(11),
    }
});