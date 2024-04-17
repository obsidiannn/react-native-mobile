import fileService from "@/service/file.service";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { ActivityIndicator, Modal, Platform, StatusBar, Text } from "react-native";

import Navbar from "@/components/navbar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, View } from "react-native-ui-lib";
import { Image } from "@/components/image";
import { s, scale } from "react-native-size-matters/extend";
import utils from "@/lib/utils";
import colors from "@/config/colors";
import toast from "@/lib/toast";
import mime from 'mime/dist/src/index_lite';
import * as Sharing from 'expo-sharing';
import crypto from "react-native-quick-crypto";
export interface IEncFilePreviewFile {
    mime: string;
    name: string;
    size: number;
    path: string;
    md5: string;
    enc_md5: string;
}
export interface IEncFilePreviewRef {
    open: (params: {
        encKey: string;
        file: IEncFilePreviewFile;
    }) => void;
}
export default forwardRef((_, ref) => {
    const insets = useSafeAreaInsets();
    const [visible, setVisible] = useState(false);
    const [encKey, setEncKey] = useState("");
    const [file, setFile] = useState<IEncFilePreviewFile>();
    const [loading, setLoading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const downloadFile = useCallback(async (f: IEncFilePreviewFile) => {
        await fileService.downloadFile(fileService.getFullUrl(f.path));
        toast('下載成功');
        setDownloaded(true);
    }, []);
    const saveFile = useCallback(async (f: IEncFilePreviewFile) => {
        if (typeof f.path == 'string') {
            if (f.path.startsWith('http')) {
                return;
            }
            if (f.path.startsWith('file://')) {
                return;
            }
        }
        const data = await fileService.getEnFileContent(f.path, encKey) ?? undefined;
        if (!data) {
            toast('下載失败3');
            return;
        }
        const path = await fileService.saveFile(data, f.name);
        if (!path) {
            toast('保存失败1');
            return;
        }
        if (Platform.OS == 'ios') {
            Sharing.shareAsync(path, {
                mimeType: mime.getType(path) ?? 'application/octet-stream',
            });
            return;
        } else {
            toast('已保存到：' + path);
        }
    }, [])
    useImperativeHandle(ref, () => ({
        open: (params: {
            encKey: string;
            file: IEncFilePreviewFile;
        }) => {
            (async () => {
                setDownloaded(await fileService.checkDownloadFileExists(fileService.getFullUrl(params.file.path)))
                setEncKey(params.encKey);
                setFile(params.file);
                setVisible(true);
            })()
        }
    }));
    return <Modal visible={visible} animationType="slide" style={{
        flex: 1,
        backgroundColor: 'white',
    }}>
        <View style={{
            flex: 1,
            backgroundColor: 'white',
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        }}>
            <Navbar title="文件詳情" onLeftPress={() => setVisible(false)} />
            <View style={{
                flex: 1,
                alignItems: 'center',
                paddingHorizontal: scale(25),
            }}>
                <Image source={require('@/assets/icons/file-unknown.svg')} style={{
                    width: scale(60),
                    height: scale(60),
                    marginTop: scale(72),
                }} />
                <Text style={{
                    fontSize: scale(16),
                    color: '#333',
                    fontWeight: '600',
                    marginTop: scale(8),
                }}>{file?.name}</Text>
                <Text style={{
                    fontSize: scale(14),
                    color: '#999',
                    fontWeight: '400',
                    marginTop: scale(10),
                }}>文件大小：{utils.bytesToSize(file?.size ?? 0)}</Text>
                <Button disabled={loading} onPress={() => {
                    if (loading) {
                        return;
                    }
                    if (!file) {
                        return;
                    }
                    setLoading(true);
                    if (downloaded) {
                        saveFile(file).finally(() => {
                            setLoading(false);
                        });
                    } else {
                        downloadFile(file).finally(() => {
                            setLoading(false);
                        });
                    }

                }} backgroundColor={colors.primary} style={{
                    marginTop: scale(239),
                    height: scale(50),
                    borderRadius: scale(16),
                    display: 'flex',
                    width: '100%',
                }} size="large" label={
                    downloaded ? (loading ? '解密中' : '保存到本地') : (loading ? '下載中' : '保存到本地')
                }>
                    {loading ? <ActivityIndicator color="white" style={{
                        marginRight: scale(5),
                    }} animating={loading} /> : null}
                </Button>
            </View>
        </View>
    </Modal>
});