import { Image as ExpoImage, ImageProps } from "expo-image"
import fileService from "@/service/file.service";
import { useCallback, useEffect, useState } from "react";
import mime from 'mime/dist/src/index_lite';
export interface EncImageProps extends ImageProps {
    encKey: string;
}
export default (props: EncImageProps) => {
    const [data, setData] = useState<any>();
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
        console.log('encKey:',props.encKey);
        console.log('uri:',source);
        
        
        const base64 = await fileService.getEnFileContent(source, props.encKey);
        const mimeType = mime.getType(source);
        return `data:${mimeType};base64,${base64}`;
    }, []);
    useEffect(() => {
        getSource(props.source).then((_data) => {
            setData(_data);
        });
    }, [props.source]);
    // return  <ExpoImage {...props} source={data} cachePolicy="memory-disk" /> 
    return (data ? <ExpoImage {...props} source={data} cachePolicy="memory-disk" /> : null)
}