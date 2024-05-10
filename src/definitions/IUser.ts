import UserModel from "@/lib/database/model/User";
import { Model } from "@nozbe/watermelondb";

export type TUserModel = UserModel &
    Model 