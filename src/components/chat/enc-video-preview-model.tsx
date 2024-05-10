import fileService from "@/service/file.service";
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Modal, StyleSheet } from "react-native";
import Navbar from "@/components/navbar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native-ui-lib";
import { scale } from "react-native-size-matters/extend";
import toast from "@/lib/toast";
import { IMessageVideo } from "./input-toolkit/types";

import { Video } from 'expo-av'

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
    const [data, setData] = useState<string>();
    const [loading, setLoading] = useState(true);
    const videoRef = useRef(null)

    const loadVideo = useCallback(async (video: IMessageVideo, sharedKey: string) => {
        const path = video.path ?? (video.trans ?? video.original)
        if (!path || path === '') {
            toast('數據異常')
            return
        }

        if (path.startsWith('file://')) {
            if (await fileService.checkExist(path)) {
                console.log('使用原始文件');
                setData(path)
                return
            } else {
                toast('數據異常')
                return
            }
        }
        console.log('視頻預覽', path);

        const decodePath = await fileService.decodeVideo(path, sharedKey) ?? null;
        if (decodePath === null) {
            toast('下載失敗');
            return;
        }
        console.log('[video] key=', sharedKey);

        console.log('file is', decodePath);
        console.log('original md5:', video.o_md5);
        console.log('target md5', (await fileService.getFileInfo(decodePath)).md5);

        setData(decodePath)
    }, [])

    const handlePlayStatusUpdate = playStatus => {
        if (playStatus.didJustFinish) {
            videoRef.current?.setPositionAsync(0)
            videoRef.current?.pauseAsync()
        }
    }

    useImperativeHandle(ref, () => ({
        open: (params: {
            encKey: string;
            video: IMessageVideo;
            initialIndex?: number;
        }) => {
            console.log('open::', params.video.path);

            (async () => {
                setVisible(true);
                setEncKey(params.encKey);
                try {
                    await loadVideo(params.video, params.encKey)
                    setLoading(false)
                } finally {
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
            <Navbar theme="dark" title="視頻預覽" onLeftPress={() => setVisible(false)} />
            <Video
                ref={videoRef}
                style={styles.videoStyle}
                source={{ uri: data ?? '', type: 'mp4' }}
                useNativeControls
                shouldPlay
                onPlaybackStatusUpdate={handlePlayStatusUpdate}
                volume={1.0}
                rate={1.0}
            />
        </View>
    </Modal>
});

var styles = StyleSheet.create({
    loadingStyle: {
        fontSize: scale(30),
        textAlign: 'center',
        verticalAlign: 'middle'
    },
    videoStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'

    },
    progressBox: {
        width: '100%',
        height: scale(3),
        backgroundColor: '#ccc'
    },
    progress: {
        width: scale(1),
        height: scale(2),
        backgroundColor: 'green'
    },
    wrap2: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    play: {
        height: scale(50),
        width: scale(50),
        resizeMode: 'contain',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    }
});