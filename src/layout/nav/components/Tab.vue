<template>
  <div class="tabs-warp">
    <div class="history-list">
      <el-tabs
        v-model="activeName"
        class="history-tabs"
        @tab-click="handleClickTab"
        @tab-remove="handleRemoveTab"
      >
        <el-tab-pane label="首页" name="Dashboard" />
        <el-tab-pane
          v-for="history in historyList"
          :label="history.title"
          :name="history.name"
          :key="history.name"
          closable
        />
      </el-tabs>
    </div>

    <div class="history-action">
      <el-dropdown @command="handleCommand">
        <el-button type="primary" size="small">
          更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="other">关闭其他</el-dropdown-item>
            <el-dropdown-item command="all">关闭全部</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts" name="HistoryTab">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { TabsPaneContext } from 'element-plus';
import usePageStore from '@/store/modules/page';

const $router = useRouter(); // Router
const pageStore = usePageStore(); // pageStore

// active Name
const activeName = ref(pageStore.getCurrent.name);

// history List
const historyList = computed(() => {
  return pageStore.getHistory;
});

/**
 * 点击路由
 * @param { TabsPaneContext } tab 目标路由信息
 */
const handleClickTab = (tab: TabsPaneContext) => {
  $router.push({ name: tab.props.name });
};

/**
 * 删除路由
 * @param { string } targetName 目标路由name
 */
const handleRemoveTab = (targetName: string) => {
  const isCurrent = activeName.value === targetName;
  pageStore.DeletePage({ name: targetName });
  if (isCurrent) {
    const targetRouteName = historyList.value.length ? historyList.value.at(-1).name : 'Dashboard';
    $router.push({ name: targetRouteName });
  }
};

/**
 * 点击更多
 */
const handleCommand = (command: string) => {
  switch (command) {
    case 'other':
      pageStore.DeleteOtherPage();
      break;
    case 'all':
      $router.push({ name: 'Dashboard' });
      pageStore.DeleteAllPage();
      break;
    default:
      break;
  }
};
</script>

<style lang="scss" scoped>
.tabs-warp {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #ffffff;

  .history-list {
    flex: 1;
    width: calc(100% - 86px);
  }

  .history-action {
    width: 86px;
    flex-shrink: 0;
    text-align: right;
  }
}

.history-tabs {
  :deep .el-tabs__nav-wrap::after {
    content: none;
  }
  :deep .el-tabs__active-bar {
    opacity: 0;
  }
  :deep .el-tabs__header {
    margin: 0;
  }
  :deep .el-tabs__item {
    padding: 0 20px !important;
    font-size: 13px;
    color: #ccc;
    border-bottom: 2px solid transparent;

    &.is-active {
      color: #409eff;
      border-bottom: 2px solid #409eff;
    }
  }
}
</style>
