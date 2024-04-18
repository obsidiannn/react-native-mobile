import { scale } from "react-native-size-matters/extend";
import { IMessageVideo } from "../../input-toolkit/types";
import { useEffect, useState } from "react";
import { Text, View } from "react-native-ui-lib";
import { StyleSheet } from "react-native";
import CustomVideo from '@/components/common/video'
export default (
    props: {
        video: IMessageVideo;
        encKey: string;
    }
) => {
    // 計算圖片的寬高 寬不超過180 高等比縮放
    const [size, setSize] = useState([0,0]);
    const [thumbnail,setThumbnail] = useState('')
    const getWH = (w: number, h: number) => {
        w = scale(props.video.w) > scale(180) ? scale(180) : scale(props.video.w);
        h = scale(Math.floor(props.video.h * (w / props.video.w)));
        
        return { w, h };
    }
    useEffect(() => {
        const { w, h } = getWH(props.video.w, props.video.h);
        setSize([w, h]);
        setThumbnail(props.video.thumbnail)
        console.log('加載視頻',props.video.path);
    }, [props.video.w, props.video.h,props.video.thumbnail]); 

    return <View style={[
        styles.container,styles.userContainer,
    ]}> 
        
        <CustomVideo
         encKey={props.encKey}
         source={thumbnail}
         style={{
            width: size[0],
            height: size[1],
            margin: scale(0),
            padding: scale(0)
        }} 
        ></CustomVideo>
    </View>
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: scale(10),
        paddingRight: scale(10),
        paddingTop: scale(10),
        paddingBottom: scale(10),
        borderRadius: scale(10),
        backgroundColor: '#ffffff',
    },
    selfContainer: {
        // borderTopRightRadius: scale(0),
    },
    userContainer: {
        // borderTopLeftRadius: scale(0),
    },
    text: {
        fontSize: scale(15),
        fontWeight: '400',
        lineHeight: 21,
        color: '#666',
    },
});