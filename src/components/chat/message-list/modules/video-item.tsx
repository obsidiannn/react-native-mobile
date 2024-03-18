import EncImage from "@/components/common/enc-image";
import { scale } from "react-native-size-matters/extend";
import { IMessageVideo } from "../../input-toolkit/types";
import { useEffect, useState } from "react";
import { Text, View } from "react-native-ui-lib";
import { StyleSheet } from "react-native";

export default (
    props: {
        video: IMessageVideo;
        encKey: string;
    }
) => {
    // 计算图片的宽高 宽不超过180 高等比缩放
    const [size, setSize] = useState([0,0]);
    const getWH = (w: number, h: number) => {
        w = scale(props.video.w) > scale(180) ? scale(180) : scale(props.video.w);
        h = scale(Math.floor(props.video.h * (w / props.video.w)));
        return { w, h };
    }
    useEffect(() => {
        const { w, h } = getWH(props.video.w, props.video.h);
        setSize([w, h]);
    }, [props.video.w, props.video.h]); 
    return <View style={[
        styles.container,styles.userContainer,
    ]}>
        <Text numberOfLines={2} style={styles.text}>播放视频
        </Text>
    </View>
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: scale(15),
        paddingRight: scale(20),
        paddingTop: scale(15),
        paddingBottom: scale(13),
        borderRadius: scale(15),
        backgroundColor: '#ffffff',
    },
    selfContainer: {
        borderTopRightRadius: scale(0),
    },
    userContainer: {
        borderTopLeftRadius: scale(0),
    },
    text: {
        fontSize: scale(15),
        fontWeight: '400',
        lineHeight: 21,
        color: '#666',
    },
});