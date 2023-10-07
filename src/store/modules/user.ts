// @ts-check
import Cookies from 'js-cookie';
import { defineStore, acceptHMRUpdate } from 'pinia';
import * as ApiLogin from '@/api/login';
import * as ApiChat from '@/api/chat';

type UserState = {
  token: string | null
  nickName: string | null
  userName: string | null
  userId: number | null
  roleId: string | null
  status: number | null
  firstLogin: string | null
  newMessageCut: number | null
}

const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: '', // token
    nickName: '', // 昵称
    userName: '', // 用户名
    userId: null, // 用户id
    roleId: null, // 角色id
    status: null, // 状态
    firstLogin: null, // 针对供应商是否初次登录，1是0否
    newMessageCut: null, // 针对供应商是否初次登录，1是0否
  }),
  getters: {
    getUserName(): string | null {
      return this.userName;
    },
    getRoleId(): string | null {
      return this.roleId;
    }
  },

  actions: {

    /**
     * 登录
     */
    async Login(data: any) {
      // await this.Logout();
      return new Promise((resolve, reject) => {
        ApiLogin.login(data).then((res: TypeResponse) => {
          this.token = res.token;
          Cookies.set('c_token', res.token);
          resolve(res || true);
        }).catch((error: any) => {
          console.log(error);
          reject(error);
        });
      });
    },

    /**
     * 获取登录用户信息
     * @param { Boolean } isUpdate 是否更新
     */
    GetInfo(isUpdate: boolean = false) {
      if (!this.userId || isUpdate) {
        return new Promise((resolve, reject) => {
          ApiLogin.getInfo().then((res: TypeResponse) => {
            this.nickName = res.user.nickName;
            this.userName = res.user.userName;
            this.userId = res.user.userId;
            this.roleId = res.rolesId;
            this.status = res.user.status;
            this.firstLogin = res.firstLogin;
            Cookies.set('c_userId', res.user.userId);
            Cookies.set('c_roleId', res.user.roleId);
            Cookies.set('c_userName', res.user.userName);
            resolve(res.user || true);
          }).catch((error: any) => {
            console.log(error);
            reject(error);
          });
        });
      }
      return false;
    },
    /**
     * 退出登录
     */
    Logout() {
      return new Promise((resolve) => {
        this.token = null;
        this.nickName = null;
        this.userName = null;
        this.userId = null;
        this.roleId = null;
        this.status = null;
        this.firstLogin = null;
        Cookies.remove('c_token');
        Cookies.remove('c_roleId');
        Cookies.remove('c_userName');
        resolve(true);
        window.location.reload();
      });
    },

  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}

export default useUserStore;
