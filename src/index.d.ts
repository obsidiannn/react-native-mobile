import { Wallet } from "ethers";
import { StyleProp, ViewStyle,TextStyle,TextInput, ReturnKeyTypeOptions } from "react-native";
import { UserInfoItem } from "./api/types/user";

//  扩展 globalthis 对象 为该对象添加属性 类型为wallet
declare global {
    var wallet: Wallet | null;
    // firebase 的 token
    var token: string| null;
    var currentUser: UserInfoItem| null
}




// 扩展 GiftedChatProps
declare module "react-native-gifted-chat" {
    interface GiftedChatProps {
        accessoryStyle?: StyleProp<ViewStyle>;
        textInputStyle?: StyleProp<TextStyle>;
        textInputProps?: TextInput;
    }
}

declare module "react-native" {
    interface TextInputProps {
        returnKeyType?: ReturnKeyTypeOptions | undefined | "newline";
    }
}
