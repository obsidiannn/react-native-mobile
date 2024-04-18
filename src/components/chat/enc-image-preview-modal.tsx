import fileService from "@/service/file.service";
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import { Modal, Pressable, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import PagerView from "react-native-pager-view";
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import Navbar from "@/components/navbar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native-ui-lib";
import { scale } from "react-native-size-matters/extend";
import { Image } from "@/components/image";
import toast from "@/lib/toast";
import mime from 'mime/dist/src/index_lite';
const getFullUrl = (url: any) => {
    return typeof url === 'string' && url.startsWith('upload') ? fileService.getFullUrl(url) : url;
}

export interface EncImagePreviewImage {
    thumbnail: string;
    original: string;
    w: number;
    h: number;
    original_status?: boolean;
    t_md5?: string;
    o_md5?: string;
}
export interface IEncImagePreviewRef {
    open: (params: {
        encKey: string;
        images: EncImagePreviewImage[];
        initialIndex?: number;
    }) => void;
}
export default forwardRef((_, ref) => {
    const insets = useSafeAreaInsets();
    const [visible, setVisible] = useState(false);
    const [encKey, setEncKey] = useState("");
    const [images, setImages] = useState<EncImagePreviewImage[]>([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [data, setData] = useState<string>();
    const [loading, setLoading] = useState(false);
    const pagerViewRef = useRef<PagerView>(null);
    const loadImage = useCallback(async (img: EncImagePreviewImage) => {
        const path = img.original_status ? img.original : img.thumbnail;
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
        const base64 = await fileService.getEnFileContent(path, encKey) ?? undefined;
        if (!base64) {
            toast('下載失敗');
            return;
        }
        const mimeType = mime.getType(path);
        setData(`data:${mimeType};base64,${base64}`);
    }, [])
    useImperativeHandle(ref, () => ({
        open: (params: {
            encKey: string;
            images: EncImagePreviewImage[];
            initialIndex?: number;
        }) => {
            (async () => {
                setEncKey(params.encKey);
                const tmps: EncImagePreviewImage[] = [];
                for (let index = 0; index < params.images.length; index++) {
                    const element = params.images[index];
                    const result = await fileService.checkDownloadFileExists(getFullUrl(element.original));
                    tmps.push({
                        ...element,
                        original_status: result,
                    })
                }
                setImages(tmps);
                setPageIndex(params?.initialIndex ?? 0);
                loadImage(tmps[params?.initialIndex ?? 0]);
                setVisible(true);
                console.log(params?.initialIndex);
                pagerViewRef.current?.setPage(params?.initialIndex ?? 0);
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
            <Navbar theme="dark" title="圖片預覽" onLeftPress={() => setVisible(false)} />
            <PagerView style={{
                flex: 1,
            }} onPageSelected={(e) => {
                loadImage(images[e.nativeEvent.position]);
                setPageIndex(e.nativeEvent.position);
            }} initialPage={pageIndex}>
                {images.map((_, index) => {
                    return <Pressable onPress={() => {
                        //setVisible(false);
                    }} key={index} style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'black',
                        width: '100%',
                    }}>
                        <ImageZoom
                            uri={data}
                            style={{
                                width: '100%',
                            }}
                            minScale={0.5}
                            maxScale={3}
                            onInteractionStart={() => console.log('Interaction started')}
                            onInteractionEnd={() => console.log('Interaction ended')}
                            onPinchStart={() => console.log('Pinch gesture started')}
                            onPinchEnd={() => console.log('Pinch gesture ended')}
                            onPanStart={() => console.log('Pan gesture started')}
                            onPanEnd={() => console.log('Pan gesture ended')}
                        />
                    </Pressable>
                })}
            </PagerView>
            <View>
                <View style={{
                    paddingHorizontal: scale(20),
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: scale(30),
                }}>
                    <View>
                        {!images[pageIndex]?.original_status ? <TouchableOpacity onPress={async () => {
                            try {
                                setLoading(true);
                                const result = await fileService.getEnFileContent(images[pageIndex].original, encKey);
                                if (result) {
                                    const mimeType = mime.getType(images[pageIndex].original);
                                    setData(`data:${mimeType};base64,${result}`);
                                }
                                setImages((prev) => {
                                    const tmps = [...prev];
                                    tmps[pageIndex].original_status = true;
                                    return tmps;
                                });
                            } catch (error) {
                                console.log(error);
                            } finally {
                                setLoading(false);
                            }
                        }} style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',

                            borderRadius: scale(5),
                            borderColor: 'white',
                            borderWidth: 1,
                            padding: scale(5),
                        }}>
                            {loading ? <ActivityIndicator color="white" /> : null}
                            <Text style={{
                                color: 'white',
                                textAlign: 'center',
                            }}>查看原圖</Text>
                        </TouchableOpacity> : null}
                    </View>
                    <View>
                        <TouchableOpacity onPress={async () => {
                            // 將圖片保存到相冊
                            if (data) {
                                await fileService.saveToAlbum(data);
                                toast('保存成功')
                            }
                        }}>
                            <Image source={require('@/assets/icons/download.webp')} style={{
                                width: scale(50),
                                height: scale(50),
                            }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={{
                    color: 'white',
                    textAlign: 'center',
                }}>{pageIndex + 1}/{images.length}</Text>
            </View>
        </View>

    </Modal>
});