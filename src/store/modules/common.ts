// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia';
import * as ApiCommon from '@/api/common';
import * as ApiUser from '@/api/user';

type CommonState = {
  supplierList: Array<any>,
  roleList: TypeOptions,
}

const useCommonStore = defineStore({
  id: 'common',
  state: (): CommonState => ({
    supplierList: [],
    roleList: []
  }),
  getters: {
  },

  actions: {
    /**
     * 获取所有供应商
     * @param { Boolean } isUpdate 是否更新
     */
     GetRoleList(isUpdate: boolean = false) {
      // 已有数据就不在请求接口
      if (this.roleList.length && !isUpdate) return false;
      return new Promise((resolve, reject) => {
        ApiCommon.getRoleList().then((res: TypeResponse) => {
          this.roleList.splice(0, this.roleList.length);
          this.roleList.push(...res.data);
          resolve(res);
        }).catch((error: any) => {
          console.log(error);
          reject(error);
        });
      });
    },

  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCommonStore, import.meta.hot));
}

export default useCommonStore;
