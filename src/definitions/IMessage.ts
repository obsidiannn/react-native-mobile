import { DataType, IMessage } from "@/components/chat/input-toolkit/types";
import IMessageModel from "@/lib/database/model/Message";
import { Model } from "@nozbe/watermelondb";

export type TMessageModel = IMessageModel &
    Model & {
        asPlain: ()=> IMessage<DataType>
    }