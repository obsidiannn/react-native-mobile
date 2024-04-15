import { FriendInfoItem } from "./api/types/friend";

type RootStackParamList = {
    Entry: undefined;
    Login: undefined;
    LoginSetPassword: undefined;
    Register: undefined;
    Web: {
        url: string;
        title?: string;
    };
    Unlock: undefined;
    Tab: undefined;
    Home: undefined;
    AuthStackNav: undefined;
    UserCenter: undefined;
    AddFriend: undefined;
    Contact: undefined;
    UserInfo: {
        uid?: string;
    };
    InviteFriend: {
        uid: string;
    };
    UserCard: undefined;
    UserChat: {
        chatId?: string;
        uid?: string;
    };
    GroupChat: {
        chatId?: string;
        groupId: string
    },
    NewFriend: undefined;
    InviteInfo: {
        id: string;
        obj_uid: string;
        uid: string;
        name: string;
        avatar: string;
        status: number;
        remark: string;
    },
    Security: undefined;
    Setting: undefined;
    UserProfile: undefined;
    UpdateUsername: undefined;
    BackupMnemonic: {
        mnemonic: string;
    };
    GroupApplyList: undefined;
    GroupList: undefined;
    UserSetting: undefined;
    UserChatInfo: {
        uid: string;
        chatId: string;
        avatar: string;
        name: string;
        disturb: boolean;
        top: boolean;
    };
    GroupInfo: {
        gid?: string;
    };
    GroupCreate: {
        selected: SelectMemberOption[]
    }
};


interface Member {
    id: string;
    name: string;
    avatar: string;
    pub_key: string;
    gender: number;
}

interface ContactMember extends Member {
    chat_id: string;
    remark: string;
}
interface FriendRelation extends Member {
    // 0-互为陌生人 1-互为好友 2-对方是我的好友/我是对方的陌生人 3-对方是我的陌生人/我是对方的好友
    is_friend: number;
}

interface MemberOption extends FriendInfoItem {
    status: boolean;
    disabled: boolean;
}
interface Group {

}