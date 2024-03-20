import fileService from "@/service/file.service";
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import { Modal, Pressable, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from "react-native";
import Navbar from "@/components/navbar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native-ui-lib";
import { scale } from "react-native-size-matters/extend";
import Video, { VideoRef } from 'react-native-video'
import toast from "@/lib/toast";
import mime from 'mime/dist/src/index_lite';
const getFullUrl = (url: any) => {
    return typeof url === 'string' && url.startsWith('upload') ? fileService.getFullUrl(url) : url;
}

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
    const [video, setVideo] = useState<EncVideoPreviewVideo>();
    const [data, setData] = useState<string>();
    const [loading, setLoading] = useState(false);
    const loadVideo = useCallback(async (video: EncVideoPreviewVideo) => {
        const path = video.original_status ? video.original : video.thumbnail;
        if (typeof path == 'string') {
            if (path.startsWith('http')) {
                setData(path);
                return;
            }
            if (path.startsWith('file://')) {
                setData(path);
                return;
            }
        }
        const base64 = await fileService.getEnVideoContent(path, encKey) ?? undefined;
        if (!base64) {
            toast('下载失败');
            return;
        }
        const mimeType = mime.getType(path);
        setData(`data:${mimeType};base64,${base64}`);
    }, [])
    useImperativeHandle(ref, () => ({
        open: (params: {
            encKey: string;
            video: EncVideoPreviewVideo;
            initialIndex?: number;
        }) => {
            (async () => {
                setEncKey(params.encKey);
                const result = await fileService.checkDownloadFileExists(getFullUrl(params.video.original));
                params.video.original_status = result
                loadVideo(params.video)
                setVisible(true);
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

            <Video 
                source={data}
                ref={videoRef}
                style={styles.backgroundVideo}
            />
        </View>

    </Modal>
});

var styles = StyleSheet.create({
    backgroundVideo: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
  });