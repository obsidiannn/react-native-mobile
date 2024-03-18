import EncImage from "@/components/common/enc-image";
import { scale } from "react-native-size-matters/extend";
import { IMessageImage } from "../../input-toolkit/types";
import { useEffect, useState } from "react";

export default (
    props: {
        image: IMessageImage;
        encKey: string;
    }
) => {
    // 计算图片的宽高 宽不超过180 高等比缩放
    const [size, setSize] = useState([0,0]);
    const getWH = (w: number, h: number) => {
        w = scale(props.image.w) > scale(180) ? scale(180) : scale(props.image.w);
        h = scale(Math.floor(props.image.h * (w / props.image.w)));
        return { w, h };
    }
    useEffect(() => {
        const { w, h } = getWH(props.image.w, props.image.h);
        setSize([w, h]);
    }, [props.image.w, props.image.h]); 
    return <EncImage
        source={props.image.thumbnail}
        encKey={props.encKey}
        style={{
            width: size[0],
            height: size[1],
            marginTop: scale(10),
        }} />
}