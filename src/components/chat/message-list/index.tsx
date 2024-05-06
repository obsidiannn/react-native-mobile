import { ForwardedRef, forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import { DataType, IMessage } from "../input-toolkit/types";
import ListItem from "./list-item";
import { FlatList, ViewStyle } from "react-native";



export default forwardRef((props: {
    authUid: string;
    messages: IMessage<DataType>[];
    encKey: string;
    onPress?: (message: IMessage<DataType>) => void;
    onLongPress?: (message: IMessage<DataType>) => void;
    style?: ViewStyle;
    onEndReached?: () => void
    onTopReached?: () => void
}, messageListRef: any) => {
    const [onMove, setOnMove] = useState(true)
    const [enableJump,setEnableJump] = useState<boolean>(true)
    // const ref = useRef<FlatList<IMessage<DataType>>>();
    const [content, setContent] = useState<{
        y: number,
        h: number
    }>({
        y: -1,
        h: -1
    })
 
    const handleContentsizeChange = (w, h) => {
        if(enableJump){
            const _offset = content.y + (h - content.h)
            console.log('new offset',_offset,h);
            setContent({y: _offset,h: h})
        }
    }

    const handleContent = (e:any) =>{
        setContent({
            y: e.nativeEvent.contentOffset.y,
            h: e.nativeEvent.contentSize.height
        })    
        setOnMove(false)
    }

    return <FlatList
   
        contentContainerStyle={props.style}
        onContentSizeChange={handleContentsizeChange}
        // onScroll={(e: any) => {
        //     setContent({
        //         y: e.nativeEvent.contentOffset.y,
        //         h: e.nativeEvent.contentSize.height
        //     })
        // }}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        scrollToOverflowEnabled
        onStartReachedThreshold={0.1}
        onStartReached={() => {
            if (props.onTopReached && !onMove) {
                setOnMove(true)
                props.onTopReached()
            }
        }}
        onEndReached={() => {
            console.log('load');
            if (props.onEndReached && !onMove) {
                setOnMove(true)
                props.onEndReached()
            }
        }}
        onEndReachedThreshold={0.1}
        onMomentumScrollEnd={(e:any) => { 
            handleContent(e)
         }}
        contentOffset={{x: 0,y: content.y}}
        data={props.messages}
        ref={r => messageListRef = r as FlatList<IMessage<DataType>>}
        renderItem={(params) => {
            const { item } = params;
            const isSelf = item.user?.id == props.authUid;
            return <ListItem
                onPress={() => {
                    props.onPress?.(item);
                }}
                onLongPress={() => {
                    props.onLongPress?.(item);
                }}
                item={item}
                isSelf={isSelf}
                encKey={props.encKey}
            />
        }}
        keyExtractor={(item) => item.mid}
    />
})