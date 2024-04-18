import { GroupInfoItem } from "@/api/types/group";
import { UserInfoItem } from "@/api/types/user";
import { ScrollView, Text } from "react-native"
import { scale } from "react-native-size-matters/extend";
import { Button, View } from "react-native-ui-lib"
import MemberItem from "./components/member-item";
import MenuItem from "./components/menu-item";
import QRcodeModal, { QRcodeModalRef } from "./components/qrcode-modal";
import ApplyListModal, { ApplyListModalRef } from "./components/apply-list-modal";
import ConfirmModal, { ConfirmModalType } from "@/components/confirm-modal";
import ApplyInfoModal, { ApplyInfoModalRef } from "./components/apply-info-modal";
import GoodCategory,{GroupCategoryModalRef} from "./components/group-category";
import GoodManager,{GroupManagerModalRef} from "./components/group-manager";
import { useCallback, useRef } from "react";
import SelectMemberModal, { SelectMemberModalType, SelectMemberOption } from "@/components/select-member-modal";
import groupService from "@/service/group.service";
import toast from "@/lib/toast";
import friendService from "@/service/friend.service";
import quickAes from "@/lib/quick-aes";
import { ethers } from "ethers";
import userService from "@/service/user.service";
import groupApi from "@/api/v2/group";

export default (props: {
    group?: GroupInfoItem;
    authUser?: UserInfoItem;
    members?: UserInfoItem[];
    onChangeMemberList?: () => void;
}) => {
    const qrcodeModalRef = useRef<QRcodeModalRef>(null);
    const applyListModalRef = useRef<ApplyListModalRef>(null);
    const confirmModalRef = useRef<ConfirmModalType>(null);
    const applyInfoModalRef = useRef<ApplyInfoModalRef>(null);
    const selectMemberModalRef = useRef<SelectMemberModalType>(null)
    const groupCategoryModalRef = useRef<GroupCategoryModalRef>(null)
    const groupManagerModalRef = useRef<GroupManagerModalRef>(null)

    const batchInviteJoin = useCallback(async (gid: string, uids: string[]) => {
        const encInfo = await groupService.encInfo(gid);
        const group = await groupService.getInfo(gid);
        if (!group) {
            throw new Error('羣不存在')
        }
        if (!globalThis.wallet) {
            throw new Error('羣公鑰不存在')
        }
        // const sharedSecret = globalThis.wallet.signingKey.computeSharedSecret(Buffer.from(group.pub.substring(2), 'hex')).substring(4);
        const sharedSecret = globalThis.wallet.signingKey.computeSharedSecret(group.pubKey);
        const groupPri = quickAes.De(encInfo.enc_pri, sharedSecret)
        const groupKey = quickAes.De(encInfo.enc_key, sharedSecret);
        const groupWallet = new ethers.Wallet(groupPri);
        const users = await userService.getBatchInfo(uids);
        const items: {
            uid: string;
            enc_key: string;
        }[] = [];
        for (let index = 0; index < users.length; index++) {
            const user = users[index];
            const userSharedSecret = groupWallet.signingKey.computeSharedSecret(Buffer.from(user.pubKey.substring(2), 'hex')).substring(4);
            const userGroupEncKey = quickAes.En(groupKey, userSharedSecret)
            items.push({
                uid: user.id,
                enc_key: userGroupEncKey
            })
        }
        if (items.length > 0) {
            await groupApi.inviteJoin({
                id: group.id,
                items,
            })
            toast('發起邀請成功');
        }
        console.log(items);
        // 獲取加密信息
        // 解密key
        // 構建羣錢包對象
        // 獲取 uids
        // 分別解密enc_key
        // 發送
    }, []);
    return <ScrollView style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: scale(25),
    }}>
        <View style={{
            borderRadius: scale(16),
            borderWidth: 1,
            borderColor: '#F4F4F4',
            backgroundColor: '#F8F8F8',
            padding: scale(15),
            paddingRight: scale(0),
            paddingTop: scale(5),
            marginTop: scale(20),
        }}>
            <View style={{
                flexDirection: 'row',
                display: 'flex',
                flexWrap: 'wrap',
            }}>
                {props.members?.map((member, i) => {
                    return <MemberItem key={member.id} avatar={member.avatar} text={member.name} onPress={() => {
                        console.log('點擊用戶', member);
                    }} />
                })}
                <MemberItem avatar={require('@/assets/icons/circle-plus-big-white.svg')} onPress={async () => {
                    const data = await friendService.getList();
                    const existIds = props.members?.map(item => item.id) ?? [];
                    const options: SelectMemberOption[] = data.items.map((item) => {
                        const disabled = existIds.includes(item.uid);
                        console.log(item);
                        return {
                            id: item.uid,
                            icon: item.avatar,
                            status: false,
                            name: item.name,
                            title: item.name,
                            name_index: item.nameIndex,
                            disabled,
                        } as SelectMemberOption;
                    })
                    if (options.length > 0) {
                        console.log('options',options);
                        selectMemberModalRef.current?.open({
                            title: '添加成員',
                            options,
                            callback: async (ops: SelectMemberOption[]) => {
                                const uids = ops.filter((item) => item.status).map(item => item.id);
                                if (uids.length > 0) {
                                    await batchInviteJoin(props.group?.id ?? '', uids)
                                }
                            },
                        })
                    }

                }} />
                <MemberItem avatar={require('@/assets/icons/circle-sub-big-white.svg')} onPress={() => {
                    console.log('踢出用戶');
                    if (props.members) {
                        const authId = globalThis.wallet?.address.toLowerCase();
                        const options: SelectMemberOption[] = props.members.map((item) => {
                            const disabled = authId == item.id;
                            return {
                                id: item.id,
                                icon: item.avatar,
                                status: false,
                                title: item.name,
                                name_index: item.nameIndex,
                                disabled,
                            } as SelectMemberOption;
                        })

                        selectMemberModalRef.current?.open({
                            title: '踢出成員',
                            options,
                            callback: (ops: SelectMemberOption[]) => {
                                console.log(ops);
                                const uids = ops.filter((item) => item.status).map(item => item.id);
                                if (uids.length > 0) {
                                    groupService.kickOut({
                                        id: props.group?.id ?? '',
                                        uids,
                                    }).then(() => {
                                        toast('刪除成功')
                                    }).catch((e) => {
                                        console.log(e);
                                        toast('刪除失敗')
                                    })
                                }
                            },
                        })
                    }
                }} />
            </View>
        </View>
        <MenuItem onPress={() => {
            if (!props.group) {
                return;
            }
            qrcodeModalRef.current?.open({
                group: props.group,
            })
        }} icon={require('@/assets/icons/qrcode.svg')} label="羣二維碼" />
        <MenuItem label="羣容量" rightComponent={<Text style={{
            fontSize: scale(14),
            fontWeight: '400',
            color: '#ABABB2',
        }}>100人</Text>} />

        <MenuItem onPress={() => {
            if (!props.group) {
                return;
            }
            groupCategoryModalRef.current?.open(props.group?.id);
        }} icon={require('@/assets/icons/arrow-right-gray.svg')} label="羣分類" />

       <MenuItem onPress={() => {
            if (!props.group) {
                return;
            }
            console.log("管理進入" );
            groupManagerModalRef.current?.open(props.group?.id);
        }} icon={require('@/assets/icons/arrow-right-gray.svg')} label="管理員" />

        <MenuItem onPress={() => {
            if (!props.group) {
                return;
            }
            applyListModalRef.current?.open(props.group?.id);
        }} icon={require('@/assets/icons/arrow-right-gray.svg')} label="申請列表" />
        <MenuItem onPress={() => {
            confirmModalRef.current?.open({
                title: '清空羣消息',
                desc: '清空後，將無法恢復',
                onSubmit: () => {
                    console.log('清空羣消息');
                }
            });
        }} icon={require('@/assets/icons/arrow-right-gray.svg')} label="清空羣消息" />
        <MenuItem onPress={() => {
            confirmModalRef.current?.open({
                title: '清空我的消息',
                desc: '清空後，將無法恢復',
                onSubmit: () => {
                    console.log('清空我的消息');
                }
            });
        }} labelColor="#FB3737" icon={require('@/assets/icons/arrow-right-gray.svg')} label="清空我的消息" />
        <Button onPress={() => {
            confirmModalRef.current?.open({
                title: '解散羣聊',
                desc: '解散後，將無法恢復',
                onSubmit: () => {
                    console.log('解散羣聊');
                }
            });
        }} style={{
            height: scale(50),
            marginTop: scale(40),
        }} borderRadius={scale(12)} color="#FB3737" backgroundColor="white" outlineColor="#FB3737" label="解散羣聊" />
        <QRcodeModal ref={qrcodeModalRef} />
        <ApplyListModal onCheck={(item) => {
            console.log('查看用戶', item);
            applyInfoModalRef.current?.open(item);
        }} ref={applyListModalRef} />
        <ConfirmModal ref={confirmModalRef} />
        <GoodCategory ref={groupCategoryModalRef} onCheck={()=>{
          console.log("打開羣分類");
          
        }} />

        <GoodManager ref={groupManagerModalRef} onCheck={()=>{
          console.log("打開羣管理");
        }} />

        <ApplyInfoModal onCheck={() => {
            console.log('查看用戶');
            props.onChangeMemberList?.();
        }} onReject={() => {
            console.log('拒絕');
            props.onChangeMemberList?.();
        }} ref={applyInfoModalRef} />
        <SelectMemberModal ref={selectMemberModalRef} />
    </ScrollView>
}