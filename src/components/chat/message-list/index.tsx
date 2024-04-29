import { FlashList } from "@shopify/flash-list";
import { useRef } from "react";
import { DataType, IMessage } from "../input-toolkit/types";
import ListItem from "./list-item";
import { ViewStyle } from "react-native";
export default (props: {
    authUid: string;
    messages: IMessage<DataType>[];
    encKey: string;
    onPress?: (message: IMessage<DataType>) => void;
    onLongPress?: (message: IMessage<DataType>) => void;
    style?: ViewStyle;
    onEndReached?: () => void
    onTopReached?: () => void
}) => {
    const listRef = useRef<FlashList<IMessage<DataType>>>();
    return <FlashList
        contentContainerStyle={props.style}
        onEndReachedThreshold={0.5}
        onScrollToTop={() => {
            if (props.onTopReached) {
                props.onTopReached()
            }
        }}
        onEndReached={() => {
            if(props.onEndReached){
                props.onEndReached()
            }
        }}
        data={props.messages}
        ref={r => listRef.current = r as FlashList<IMessage<DataType>>}
        estimatedItemSize={50}
        renderItem={(params) => {
            const { item } = params;
            console.log('m==================');
            console.log(item);

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
        inverted={true}
    />
}