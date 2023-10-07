import { Directive } from 'vue';
import Cookies from 'js-cookie';
import { getDistanceFromTop } from '../utils/index';

Cookies.set('c_isFixed', '1');

const fixedHeaderDirective: Directive ={
  mounted(el, binding) {
    let isFixed = Cookies.get('c_isFixed') || 0;
    const scrollDom = el.querySelector('.el-scrollbar__wrap')
    const headerDom = el.querySelector('.el-table__header-wrapper');
    const newElement = document.createElement("div");
    newElement.style.cssText = `
    position: absolute;
    top: 16px;
    right: 6px;
    width: 14px;
    height: 8px;
    border-top: 2px solid #909399;
    border-bottom: 2px solid #909399;
    border-color: ${+isFixed ? '#409EFF' : '#909399'};
    z-index: 9;
    cursor: pointer;
  `;
    headerDom.appendChild(newElement)

    // 开关绑定事件
    newElement.addEventListener('click', () => {
      isFixed = +isFixed ? '0' : '1'
      Cookies.set('c_isFixed', isFixed);
      handleResize()
      newElement.style.borderColor = +isFixed ? '#409EFF' : '#909399';
    })

    // 处理resize 设置高度
    const handleResize = () => {
      if (+isFixed) {
        const setHeight = window.innerHeight - getDistanceFromTop(el);
        const headerHeight = headerDom.offsetHeight;
        scrollDom.style.maxHeight = `${setHeight - headerHeight - 70 }px`;
      } else {
        scrollDom.style.maxHeight = 'initial';
      }
    };

    // 初始化时设置高度
    setTimeout(() => {
      handleResize();
    }, 200);

    // 监听窗口大小变化事件
    window.addEventListener('resize', handleResize);

    // 组件销毁时移除事件监听
    el._onResize = handleResize; // 将事件处理函数保存到元素属性中
  },
  beforeUnmount(el) {
    window.removeEventListener('resize', el._onResize);
    delete el._onResize;
  },

}

export default fixedHeaderDirective;