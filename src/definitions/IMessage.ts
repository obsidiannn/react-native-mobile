import { DataType, IMessage } from "@/components/chat/input-toolkit/types";
import { Model } from "@nozbe/watermelondb";

export type TMessageModel = IMessage<DataType> &
    Model & {
        asPlain: ()=> IMessage<DataType>
    }