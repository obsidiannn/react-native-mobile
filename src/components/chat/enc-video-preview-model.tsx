import fileService from "@/service/file.service";
import { Dimensions } from 'react-native'
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import { Modal, Pressable, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from "react-native";
import Navbar from "@/components/navbar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native-ui-lib";
import { scale } from "react-native-size-matters/extend";
import Video, { VideoRef } from 'react-native-video'
import toast from "@/lib/toast";
import { IMessageVideo } from "./input-toolkit/types";
import { TouchableWithoutFeedback } from "react-native";
import quickAes from "@/lib/quick-aes";
import video from "../common/video";

export interface EncVideoPreviewVideo {
    thumbnail: string;
    original: string;
    w: number;
    h: number;
    original_status?: boolean;
    t_md5?: string;
    o_md5?: string;
}
export interface IEncVideoPreviewRef {
    open: (params: {
        encKey: string;
        video: EncVideoPreviewVideo;
    }) => void;
}
export default forwardRef((_, ref) => {
    const insets = useSafeAreaInsets();
    const [visible, setVisible] = useState(false);
    const [encKey, setEncKey] = useState("");
    const videoRef = useRef<VideoRef>(null);
    const [data, setData] = useState<string>();
    const [loading, setLoading] = useState(true);

    const [paused,setPaused] = useState(false)
    const [duration,setDuration] = useState(0)
    const [videoProgress,setVideoProgress] = useState<{progress:number,current: number}>({
        progress: 0,current: 0
    })

    /**
     * 0x04caa74a442d0f1f867c0e91dcaa01b2729ec4267ebc7105637846770e9527005079db00f5c952c34ba03f134e8aa79747294bcb581c407f7a32e69ffbebf0b58e
     * 0x04caa74a442d0f1f867c0e91dcaa01b2729ec4267ebc7105637846770e9527005079db00f5c952c34ba03f134e8aa79747294bcb581c407f7a32e69ffbebf0b58e
     */
    
    const loadVideo = async (video: IMessageVideo) => {
        const path = video.path??video.original
        if(path === '')        {
            toast('数据异常')
            return
        }
        if(path.startsWith('file://')){
            if(await fileService.checkExist(path)){
                console.log('使用原始文件');
                setData(path)
                return 
            }   
        }
        setDuration(video.duration)
        const decodePath = await fileService.getEnVideoContent(path, encKey) ?? null;
        if (decodePath === null) {
            toast('下载失败');
            return;
        }
        console.log('file is',decodePath);
        setData(decodePath)
        
        // const path = 'file:///data/user/0/com.tdchat/cache/f3267f76798cd116ce6f0569_trans.mp4'
        // const encodePath = await fileService.encryptFile(path,encKey)
        // const decodePath = await fileService.getEnVideoContent(encodePath.path, encKey) ?? null;

        // setData(decodePath??'')
        // setData('file:///data/user/0/com.tdchat/cache//fcd55628809e6f42f39fbd9e2868754ace246a69d453da55c2a04df284135029_decode.mp4')
        // const mimeType = mime.getType(path);
        // setData(`data:${mimeType};base64,${base64}`);
    }

     //自定义进度条
     const onProgress = (data:any)=>{
        if(paused){
            return 
        }
        let currentTime=data.currentTime;
        let percent=0;

        if(duration!==0)
        {
            percent=Number((currentTime/duration).toFixed(2));
        }else{
            percent=0
        }
        
        setVideoProgress({
            progress: percent,
            current: currentTime
        })
    }

    //视频结束显示重新播放按钮
    const onEnd=()=> {
        setVideoProgress({
            progress: 1,
            current: 1
        })
        setPaused(true)
    }
    //点击按钮重新播放
    const _replay = ()=>{
        if(videoProgress.progress==1)
        {
            videoRef.current.seek(0)
        }
        setPaused(false)
    }
    const onError = (e) =>{
        console.log(e);
    }
    useImperativeHandle(ref, () => ({
        open: (params: {
            encKey: string;
            video: IMessageVideo;
            initialIndex?: number;
        }) => {
            console.log('open::',params.video.path);
            
            (async () => {
                setVisible(true);
                setEncKey(params.encKey);
                try{
                    await loadVideo(params.video)
                    setLoading(false)
                }finally{
                    setLoading(false)
                }
            })()
        }
    }));
    return <Modal visible={visible} animationType="slide" style={{
        flex: 1,
        backgroundColor: 'black',
    }}>
        <View style={{
            flex: 1,
            backgroundColor: 'black',
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        }}>
            <Navbar theme="dark" title="视频预览" onLeftPress={() => setVisible(false)} />
            <TouchableWithoutFeedback
                    onPress={()=>{
                        setPaused(!paused)
                    }}>
                <Video 
                    style={styles.videoStyle}
                    source={{uri: data,type: 'mp4'}}
                    ref={videoRef}
                    resizeMode='contain'
                    paused={paused}
                    onProgress={onProgress}
                    onEnd={onEnd}
                    onError={onError}
                />
            </TouchableWithoutFeedback>
             {/* 进度条 */}
             <View style={styles.progressBox}>
                <View style={[styles.progress,{width:Dimensions.get('window').width*videoProgress.progress}]}></View>
            </View>
            
            {loading ? (
                <View style={styles.wrap2}> 
                <Text style={styles.loadingStyle}>
                    <ActivityIndicator  size={30} color="white" />
                </Text>
                 </View>
            ):null}

            {
                paused? 
                <TouchableOpacity style={styles.wrap2}
                    onPress={_replay}
                >
                   
                    <View style={styles.play}>
                        <Text style={{color:'#ccc',fontSize:30,lineHeight:50,marginLeft:5,marginBottom:5}} >▶</Text>
                    </View>
                </TouchableOpacity>
                :<View></View>
            }
        </View>

    </Modal>
});

var styles = StyleSheet.create({
    loadingStyle: {
        fontSize: scale(30),
        textAlign: 'center',
        verticalAlign: 'middle'
    },
    videoStyle:{
        // flex: 1,
        // position: 'absolute',
        backgroundColor: 'blue',
        top:0,
        left: 0,
        bottom: 0,
        right: 0,
        width: 200,
        height: 200
    },
    progressBox:{
        width:'100%',
        height:scale(3),
        backgroundColor:'#ccc'
    },
    progress:{
        width:scale(1),
        height:scale(2),
        backgroundColor:'green'
    },
    wrap2:{
        position:'absolute',
        height: '100%',
        width: '100%',
        justifyContent:'center',
        alignItems:'center',
    },
    play:{
        height:scale(50),
        width:scale(50),
        resizeMode:'contain',
        borderWidth:1,
        borderColor:'#ccc',
        borderRadius:50,
        justifyContent:'center',
        alignItems:'center',
    }
  });