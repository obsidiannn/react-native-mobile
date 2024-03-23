import { UserInfoItem } from "@/api/types/user";
import { Wallet } from "ethers";
import { atom } from "recoil";

export const NowAccount = atom<Wallet|null>({
    key: "NowAccount",
    default: null,
    effects_UNSTABLE: [
        ({onSet}) => {
            onSet((newValue) => {
                global.wallet = newValue;
            })
        }
    ]
});

export const atomCurrentUser = atom<UserInfoItem|null>({
    key: "atomCurrentUser",
    default: null,
    effects_UNSTABLE: [
        ({onSet}) => {
            onSet((newValue) => {
                global.currentUser = newValue;
            })
        }
    ]
})