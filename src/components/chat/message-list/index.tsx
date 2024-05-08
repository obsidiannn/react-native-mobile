import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import { DataType, IMessage } from "../input-toolkit/types";
import ListItem from "./list-item";
import { ActivityIndicator, FlatListProps, ViewStyle } from "react-native";
import { FlatList, RefreshControl } from 'react-native-gesture-handler'
import Animated, { runOnJS, useAnimatedScrollHandler } from "react-native-reanimated";

export interface MessageListRefType {
    scrollToEnd: () => void;
}

const AnimatedFlatList = Animated.createAnimatedComponent<FlatListProps<IMessage<DataType>>>(FlatList)

export default forwardRef((props: {
    authUid: string;
    messages: IMessage<DataType>[];
    encKey: string;
    onPress?: (message: IMessage<DataType>) => void;
    onLongPress?: (message: IMessage<DataType>) => void;
    style?: ViewStyle;
    onEndReached?: () => Promise<void>
    onTopReached?: () => Promise<void>
}, ref: any) => {

    const [visible, setVisible] = useState<boolean>(false)
    const [loading, setLoading] = useState(false)
    const messageListRef = useRef<FlatList<IMessage<DataType>>>();
    const isIos = globalThis.isIos

    useImperativeHandle(ref, () => ({
        scrollToEnd: () => {
            messageListRef.current?.scrollToEnd()
        },
    }));


    const renderFooter = () => {
        if (loading) {
            return <ActivityIndicator />
        }
        return null
    }


    const renderItems = (params: any) => {
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
    }

    const onLoad = async () => {
        if (props.onTopReached) {
            if (loading) {
                return
            }
            setLoading(true)
            try{
                await props.onTopReached()
            }finally{
                setLoading(false)
            }
        }
    }

    return <>
        <AnimatedFlatList
            testID='message-list'
            // @ts-ignore
            ref={messageListRef}
            keyExtractor={(item) => item.mid}
            contentContainerStyle={props.style}
            inverted={true}
            removeClippedSubviews={isIos}
            initialNumToRender={7}
            windowSize={10}
            scrollEventThrottle={16}
            maxToRenderPerBatch={5}
            data={props.messages}
            renderItem={renderItems}
            ListFooterComponent={renderFooter}
            onEndReachedThreshold={0.3}
            onEndReached={onLoad}
        />
    </>
    // return <FlatList
    //     ref={r => messageListRef.current = r as FlatList<IMessage<DataType>>}
    //     data={props.messages}
    //     keyExtractor={(item) => item.mid}
    //     contentContainerStyle={props.style}
    //     windowSize={9}
    //     keyboardShouldPersistTaps='always'
    //     removeClippedSubviews={isIos}
    //     keyboardDismissMode={isIos ? 'on-drag' : 'none'}
    //     onEndReached={() => {
    //         console.log('load');
    //         if (props.onEndReached) {
    //             props.onEndReached()
    //         }
    //     }}
    //     onEndReachedThreshold={0.5}
    //     refreshControl={
    //         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    //     }
    //     renderItem={(params) => {
    //         const { item } = params;
    //         const isSelf = item.user?.id == props.authUid;
    //         return <ListItem
    //             onPress={() => {
    //                 props.onPress?.(item);
    //             }}
    //             onLongPress={() => {
    //                 props.onLongPress?.(item);
    //             }}
    //             item={item}
    //             isSelf={isSelf}
    //             encKey={props.encKey}
    //         />
    //     }}
    // />
})