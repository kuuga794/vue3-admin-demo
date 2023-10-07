<template>
  <!-- 分页 -->
  <el-pagination
    :current-page="current"
    :page-size="size"
    :total="total"
    :page-sizes="[10, 20, 50, 100]"
    :layout="layout"
    @size-change="handleSizeChange"
    @current-change="handlePageNumChange"
  ></el-pagination>
</template>

<script setup lang="ts">
import { ref, nextTick, defineProps, watch } from 'vue';

const props = defineProps({
  callback: {
    type: Function,
    default: () => () => {},
  },

  // 页码
  pageNum: {
    type: Number,
    default: 1,
  },

  // 页长
  pageSize: {
    type: Number,
    default: 10,
  },

  // 每页显示个数选择器的选项设置
  sizes: {
    type: Array,
    default: () => [10, 20, 50, 100],
  },

  layout: {
    type: String,
    default: 'sizes, total, prev, pager, next, jumper',
  },

  // 总条目数
  total: {
    type: Number,
    default: 0,
  },
});

const current = ref<number>(props.pageNum);
const size = ref<number>(props.pageSize);

/**
 * 切换页码
 */
const handlePageNumChange = (e: number) => {
  current.value = e;
  const pageData = {
    pageNum: current.value,
    pageSize: size.value,
  };
  props.callback(pageData);
};

/**
 * 切换页长
 */
const handleSizeChange = (e: number) => {
  size.value = e;
  const pageData = {
    pageNum: current.value,
    pageSize: size.value,
  };
  props.callback(pageData);
};

/**
 * watch
 */
watch(
  () => [props.pageNum, props.pageSize],
  ([pageNumNewVal, pageSizeNewVal]) => {
    current.value = pageNumNewVal;
    size.value = pageSizeNewVal;
  },
  {
    immediate: true,
  }
);
</script>
