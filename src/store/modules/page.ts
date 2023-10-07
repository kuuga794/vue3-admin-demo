// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia';
import { getStorage, setStorage } from '../../utils/storage';

type TypePage = {
  name: string;
  title: string;
  fullPath: string;
};

type PageState = {
  current: TypePage;
  history: TypePage[];
};

const defaultPage = {
  name: 'Dashboard',
  title: '首页',
  fullPath: '/',
};

const usePageStore = defineStore({
  id: 'page',
  state: (): PageState => ({
    current: getStorage({ name: 'page-current', type: 'session' }) || defaultPage, // page current
    history: getStorage({ name: 'page-history', type: 'session' }) || [], // page history
  }),
  getters: {
    getCurrent(): TypePage {
      return this.current;
    },
    getHistory(): TypePage[] {
      return this.history;
    },
  },
  actions: {
    /**
     * ADD
     */
    AddPage(data: TypePage) {
      // 设置当前页
      this.current = data;
      setStorage({
        name: 'page-current',
        content: this.current,
        type: 'session',
      });
      // 不存在则添加
      const idx = this.history.findIndex((item) => item.name === data.name);
      if (idx === -1) {
        this.history.push(data);
        setStorage({
          name: 'page-history',
          content: this.history,
          type: 'session',
        });
      }
    },

    /**
     * DELETE
     */
    DeletePage(data: TypePage) {
      // 先删除
      this.history = this.history.filter((item) => item.name !== data.name);
      setStorage({
        name: 'page-history',
        content: this.history,
        type: 'session',
      });
      // 如果删除的刚好是当前page，则当前改为this.history最后一个或者默认
      if (this.current.name === data.name) {
        this.current = this.history.at(-1) || defaultPage;
        setStorage({
          name: 'page-current',
          content: this.current,
          type: 'session',
        });
      }
    },

    /**
     * DELETE OTHER
     */
    DeleteOtherPage() {
      this.history = [this.current];
      setStorage({
        name: 'page-history',
        content: this.history,
        type: 'session',
      });
    },

    /**
     * DELETE ALL
     */
    DeleteAllPage() {
      setStorage({
        name: 'page-current',
        content: defaultPage,
        type: 'session',
      });
      setStorage({
        name: 'page-history',
        content: [],
        type: 'session',
      });
      this.current = defaultPage;
      this.history = [];
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePageStore, import.meta.hot));
}

export default usePageStore;
