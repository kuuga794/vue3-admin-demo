<template>
  <div class="search-header-block">
    <el-form :inline="true" :model="search" :class="props.theme" class="demo-form-inline">
      <el-form-item label="类型">
        <el-select
          v-model="search.storeType"
          filterable
          clearable
          placeholder="请选择门店类型"
          @change="changeStoreType"
        >
          <el-option
            v-for="item in storeTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="区域">
        <el-select
          v-model="search.regionCode"
          select-status
          :disabled="selectStatus < 1"
          filterable
          clearable
          placeholder="请选择区域"
          @change="changeRegion"
        >
          <el-option
            v-for="item in regionTree"
            :key="item.id"
            :disabled="item.isDisabled"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="省级">
        <el-select
          v-model="search.provinceCode"
          :disabled="selectStatus < 2"
          filterable
          clearable
          placeholder="请选择省级"
          @change="changeProvince"
        >
          <el-option
            v-for="item in provinceList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>

      <el-form-item v-if="props.type >= 1" label="市级">
        <el-select
          v-model="search.cityCode"
          :disabled="selectStatus < 3"
          filterable
          clearable
          placeholder="请选择市级"
          @change="changeCity"
        >
          <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="props.type >= 2" label="门店">
        <el-select
          v-model="search.storeName"
          :disabled="selectStatus < 4"
          filterable
          clearable
          placeholder="请选择门店"
        >
          <el-option
            v-for="item in storeList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>

      <el-form-item v-if="type >= 3" label="姓名">
        <el-input v-model="search.guiderName" placeholder="请输入导购姓名" clearable />
      </el-form-item>

      <el-form-item label="时间">
        <el-date-picker
          v-model="time"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          @change="changeTime"
        />
      </el-form-item>
    </el-form>

    <el-button class="btn-search" icon="Search" type="primary" @click="searchFn">搜索</el-button>
    <el-button
      class="btn-export"
      icon="Download"
      type="primary"
      :loading="downloadLoading"
      @click="exportList"
    >导出</el-button>
  </div>
</template>

<script setup lang="ts" name="SearchSelect">
import {
  reactive, ref, computed, defineEmits, defineProps, onMounted,
} from 'vue';
import * as ApiStores from '@/api/stores';
import dateFormat from '@/utils/index';
import type { searchTypes } from '#/common';

const emit = defineEmits(['search', 'export']); // emit
const props = defineProps({
  // 0 时间 类型 区域 省级
  // 1 时间 类型 区域 省级 市级
  // 2 时间 类型 区域 省级 市级 门店
  // 3 时间 类型 区域 省级 市级 门店 姓名
  type: {
    type: Number,
    default: 0,
  },
  // 主题
  theme: {
    type: String,
    default: 'dark',
  },
  // 时间区间
  recent: {
    type: Number,
    default: 0,
  },
});

let time = ref<string[]>([]); // 时间区间
let storeList: any = reactive([]); // 门店列表
const regionTree: any = reactive([]); // 区域树 --- 区域、省级、地级配置
const downloadLoading = ref(false); // 导出CD
// 搜索条件
const search = reactive<searchTypes>({
  storeType: null,
  regionCode: null,
  provinceCode: null,
  cityCode: null,
  storeName: null,
  guiderName: null,
  startTime: null,
  endTime: null,
});
// 门店类型
const storeTypeList = reactive([
  { value: 0, label: '直营店' },
  { value: 1, label: '加盟店' },
]);

// 选择状态
const selectStatus = computed(() => {
  let status = 0;
  if (search.storeName) {
    status = 5;
  } else if (search.cityCode) {
    status = 4;
  } else if (search.provinceCode) {
    status = 3;
  } else if (search.regionCode) {
    status = 2;
  } else if (typeof search.storeType === 'number') {
    status = 1;
  }
  return status;
});

// 省级列表
const provinceList = computed(() => {
  let list = [];
  list = regionTree.find((item: { code: string | null; }) => item.code === search.regionCode)?.subList;
  return list;
});

// 市级列表
const cityList = computed(() => {
  let list = [];
  list = regionTree.find((item: { code: string | null; }) => item.code === search.provinceCode)?.subList;
  return list;
});

/**
 * 最近 X 天
 * @param { Number } num 最近 X 天
 */
const recentDate = (num: number) => {
  const end = new Date();
  end.setHours(23);
  end.setSeconds(59);
  end.setMinutes(59);
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * (num - 1));
  start.setHours(0);
  start.setSeconds(0);
  start.setMinutes(0);
  return [dateFormat(start, '{y}-{m}-{d}'), dateFormat(end, '{y}-{m}-{d}')];
};

// 获取区域树
const getRegionTree = () => {
  ApiStores.getRegionTree().then((data: []) => {
    regionTree.push(...data);
  });
};

// 获取门店
const getStoreByRegion = () => {
  ApiStores.getStoreByRegion({
    regionCode: search.regionCode,
    provinceCode: search.provinceCode,
    cityCode: search.cityCode,
  }).then((data: []) => {
    storeList = data || [];
  });
};

/**
 * 门店类型
 * @param { Number } data 目标数据
 */
const changeStoreType = (data: number) => {
  search.regionCode = null;
  search.provinceCode = null;
  search.cityCode = null;
  search.storeName = null;
  regionTree.forEach((item: { isDisabled: boolean; name: string | string[]; }) => {
    item.isDisabled = data === 0;
    if (item.name.indexOf('直营') > -1) {
      item.isDisabled = data !== 0;
    }
  });
};

/**
 * 切换区域
 */
const changeRegion = () => {
  search.provinceCode = null;
  search.cityCode = null;
  search.storeName = null;
};

/**
 * 切换省级
 */
const changeProvince = () => {
  search.cityCode = null;
  search.storeName = null;
};

/**
 * 切换市级
 * @param { Object } data 目标数据
 */
const changeCity = (data: object) => {
  search.storeName = null;
  if (data) {
    getStoreByRegion();
  }
};

/**
 * 切换时间
 * @  ram { Array } time 目标时间
  */
const changeTime = (time) => {
  search.startTime = time[0] || null;
  search.endTime = time[1] || null;
};

// 搜索
const searchFn = () => {
  emit('search', search);
};

// 导出列表
const exportList = () => {
  emit('export', search);
};

onMounted(() => {
  getRegionTree();
  if (props.recent) {
    time = recentDate(props.recent);
    search.startTime = time[0] || null;
    search.endTime = time[1] || null;
    emit('search', search);
  }
});

</script>

<style lang="scss" scoped>
.search-header-block {
  position: relative;
  padding: 10px;
  padding-right: 180px;
  &.dark {
    background: #f5f7fc;
  }

  .btn-search {
    position: absolute;
    top: 10px;
    right: 0;
  }

  .btn-export {
    position: absolute;
    top: 10px;
    right: 90px;
  }
}
</style>
