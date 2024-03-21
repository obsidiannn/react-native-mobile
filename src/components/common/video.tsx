import fileService from "@/service/file.service";
import { useCallback, useEffect, useRef, useState } from "react";
import mime from 'mime/dist/src/index_lite';
import { Image as ExpoImage, ImageBackground, ImageProps } from "expo-image"
import { EncImageProps } from "./enc-image";
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet } from "react-native";
import { scale } from "react-native-size-matters/extend";

export interface VideoPreviewProps extends EncImageProps {
    encKey: string;
}
export default (props: VideoPreviewProps) => {
    const [data, setData] = useState<string>();
    const getSource = useCallback(async (source: any) => {
        if (typeof source != 'string') {
            return source;
        }
        if (source.startsWith('http')) {
            return source;
        }
        if (source.startsWith('https')) {
            return source;
        }
        if (source.startsWith('file://')) {
            return source;
        }
        
        const base64 = await fileService.getEnFileContent(source, props.encKey);
        const mimeType = mime.getType(source);
        return `data:${mimeType};base64,${base64}`;
    }, []);
    useEffect(() => {
        getSource(props.source).then((_data) => {
            setData(_data);
        });
    }, [props.source]);
    // return <ExpoImage {...props} source={data} cachePolicy="memory-disk" />
    return (data ? 
        (<ImageBackground  {...props} source={data}> 
            <Ionicons style={styles.icon} name="play-outline"></Ionicons>
         </ImageBackground>
         ): null)
}

const styles = StyleSheet.create({
    icon: {
        flex: 1,
        fontSize: scale(30),
        color: 'white',
        textAlign: 'center',
        verticalAlign: 'middle'
    }
})

// Later on in your styles..
