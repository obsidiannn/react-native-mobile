import fileService from "@/service/file.service";
import { useCallback, useEffect, useRef, useState } from "react";
import mime from 'mime/dist/src/index_lite';
import Video, { VideoRef } from 'react-native-video'
import { IMessageVideo } from "../chat/input-toolkit/types";
import util from '@/lib/utils'
export interface EncVideoProps  {
    encKey: string;
    video: IMessageVideo
}
export default (props: EncVideoProps) => {
    const [data, setData] = useState<string>();
    const videoRef = useRef<VideoRef>(null);
    const onBuffer = useState(true)
    const loadSource = useCallback(async (_video: IMessageVideo) => {
        const url = _video.original ? _video.original: _video.thumbnail

        // if(await fileService.checkDownloadFileExists(_video.path??'')){
        //     return fileService.urlToPath(url)
        // }
        
        // if (source.startsWith('http')) {
        //     return source;
        // }
        // if (source.startsWith('https')) {
        //     return source;
        // }
        // if (source.startsWith('file://')) {
        //     return source;
        // }
        console.log('to download',_video.path);
        
        const path = await fileService.getEnVideoContent(_video.path??'', props.encKey);
        if(path !== null){
            return path
        }
        
    }, []);
    useEffect(() => {
        loadSource(props.video).then((_data) => {
            console.log('video path',_data);
            
            setData(_data);
        });
    }, [props.video]);
    // return  <ExpoImage {...props} source={data} cachePolicy="memory-disk" /> 
    return  ((data && data !== null)? <Video source={data} ref={videoRef}/> :null )
}