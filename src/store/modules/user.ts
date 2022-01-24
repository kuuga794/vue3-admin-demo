// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia';
import Cookies from 'js-cookie';
import * as ApiLogin from '@/api/login';

interface UserState {
  name: string,
  token: string,
  avatar: string,
  mobile: string,
  permCodes: string[],
  companyInfo: Boolean,
  userInfo: object
}

const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    name: '',
    token: Cookies.get('token') || '',
    avatar: '',
    mobile: '',
    permCodes: [],
    companyInfo: false,
    userInfo: {},
  }),
  getters: {
    getName(): string {
      return this.name;
    },
    getToken(): string {
      return this.token;
    },
    getPermCodes(): string[] {
      return this.permCodes;
    },
  },

  actions: {

    // 登录
    Login(params: object) {
      return new Promise((resolve, reject) => {
        ApiLogin.login(params).then(({ data }) => {
          Cookies.set('token', data.token);
          this.name = data.name;
          this.token = data.token;
          this.avatar = data.avatar;
          this.mobile = data.mobile;
          this.permCodes = data.permCodes;
          this.userInfo = data;
          resolve(data);
        }).catch((error: any) => {
          console.log(error);
          reject(error);
        });
      });
    },

    // 获取用户信息
    GetUserInfo() {
      const token = Cookies.get('token');
      return new Promise((resolve, reject) => {
        ApiLogin.getUserInfo({ token }).then(({ data }) => {
          this.name = data.name;
          this.avatar = data.avatar;
          this.mobile = data.mobile;
          this.permCodes = data.permCodes;
          this.userInfo = data;
          resolve(data);
        }).catch((error: any) => {
          console.log(error);
          reject(error);
        });
      });
    },

    // 退出登录
    LogOut() {
      return new Promise<void>((resolve) => {
        Cookies.remove('token');
        this.name = '';
        this.token = '';
        this.avatar = '';
        this.mobile = '';
        this.permCodes = [];
        this.userInfo = {};
        resolve();
      });
    },

  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}

export default useUserStore;
