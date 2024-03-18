import { StyleSheet, View } from "react-native";
import { scale } from "react-native-size-matters/extend";
import TextItem from "./modules/text-item"
import FileItem from "./modules/file-item";
import ImageItem from "./modules/image-item";
import VideoItem from './modules/video-item'
import Avatar from "./modules/avatar";
import React from "react";
import MessageContainer from "./modules/message-container";
import Info from "./modules/info";
import { DataType, IMessage, IMessageFile, IMessageImage, IMessageVideo } from "../input-toolkit/types";
export default (props: {
    isSelf: boolean;
    item: IMessage<DataType>;
    encKey: string;
    onLongPress?: (message: IMessage<DataType>) => void;
    onPress?: (message: IMessage<DataType>) => void;
    itemOnPress?: () => void;
}) => {
    const { item } = props;
    let message: React.ReactNode;
    switch (item.type) {
        case "text":
            const text = item.data as string;
            message = <TextItem text={text} isSelf={props.isSelf} />;
            break;
        case "image":
            const image = item.data as IMessageImage
            if (!image || !image.h) {
                message = <TextItem text="[图片不存在]" isSelf={props.isSelf} />
            } else {
                const w = scale(image.w) > scale(180) ? scale(180) : scale(image.w);
                const h = scale(Math.floor(image.h * (w / image.w)));
                message = <ImageItem
                    image={image}
                    encKey={props.encKey} />;
            }
            break;
        case "video":
            const video = item.data as IMessageVideo
            if (!video || !video.h) {
                message = <TextItem text="[视频不存在]" isSelf={props.isSelf} />
            } else {
                const w = scale(video.w) > scale(180) ? scale(180) : scale(video.w);
                const h = scale(Math.floor(video.h * (w / video.w)));
                message = <VideoItem
                    video={video}
                    encKey={props.encKey} />;
            }
            break;
        case "file":
            const file = item.data as IMessageFile;
            if (!file) {
                message = <TextItem text="[文件不存在]" isSelf={props.isSelf} />
            }else{
                message = <FileItem name={file.name}  isSelf={props.isSelf} />
            }
            break;
        default:
            message = <TextItem text="[未知消息]" isSelf={props.isSelf} />
            break;
    }
    const content = <View style={{
        flex: 1,
        display: 'flex',
    }}>
        <Info isSelf={props.isSelf} name={item.user?.name} time={item.time.fromNow()} />
        <MessageContainer onLongPress={props.onLongPress} onPress={props.onPress} message={item} isSelf={props.isSelf}>
            {message}
        </MessageContainer>
    </View>;
    const avatar = <Avatar uid={item.user?.id} uri={item.user?.avatar} isSelf={props.isSelf} />;
    return <View style={[
        styles.container,
        props.isSelf ? styles.selfContainer : styles.userContainer,
    ]}>
        {props.isSelf ? content : avatar}
        {props.isSelf ? avatar : content}
    </View>
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scale(10),
        paddingHorizontal: scale(10),
    },
    userContainer: {
        justifyContent: 'flex-end',
    },
    selfContainer: {
        justifyContent: 'flex-start',
    },
});