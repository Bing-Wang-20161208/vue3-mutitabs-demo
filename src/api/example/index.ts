import { get } from "@/utils/axios";
import type { UserInfo } from "./type";

/** 获取用户信息 */
export const getUserInfo = () => get<UserInfo>('/user/info')