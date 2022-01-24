<template>
  <div class="analysis-wrap">
    <!-- 筛选 -->
    <SearchSelect :recent="1" @search="searchFn" @export="exportFn" />

    <!-- 列表 -->
    <el-table :data="dataList">
      <el-table-column v-if="searchType === 0" label="区域类型" align="center">
        <template #default="scope">{{ ['直营', '加盟'][scope.row.storeType] || '-' }}</template>
      </el-table-column>

      <el-table-column
        :show-overflow-tooltip="true"
        :label="['区域', '省级', '市级'][searchType]"
        align="center"
        prop="regionName"
      >
        <template #default="scope">{{ scope.row.regionName }}</template>
      </el-table-column>

      <el-table-column label="门店总数" align="center" prop="storeNum" />

      <el-table-column label="导购总数" align="center" prop="guiderNum" />

      <el-table-column label="日活" align="center" prop="yesterdayTranferNum">
        <template #default="scope">
          {{ scope.row.yesterdayTranferNum }}
          <el-icon v-if="scope.row.dayActive >= 0" style="color: #F56C6C;">
            <top />
            {{ scope.row.dayActive }}
          </el-icon>
          <el-icon v-else style="color: #67C23A;">
            <bottom />
            {{ Math.abs(scope.row.dayActive) }}
          </el-icon>
        </template>
      </el-table-column>

      <el-table-column label="月活" align="center" prop="monthActive" />

      <el-table-column label="小程序使用率" align="center">
        <template #default="scope">{{ scope.row.minappUseRatio }}%</template>
      </el-table-column>

      <el-table-column label="增粉数" align="center" prop="fansSum" />

      <el-table-column label="日新增会员数" align="center" prop="yesterdayNewMemberNum">
        <template #default="scope">
          {{ scope.row.yesterdayNewMemberNum }}
          <el-icon v-if="scope.row.nmChai >= 0" style="color: #F56C6C;">
            <top />
            {{ scope.row.nmChai }}
          </el-icon>
          <el-icon v-else style="color: #67C23A;">
            <bottom />
            {{ Math.abs(scope.row.nmChai) }}
          </el-icon>
        </template>
      </el-table-column>

      <el-table-column label="月新增会员数" align="center" prop="monthNewMemberNum" />

      <el-table-column label="导购人均新增会员" align="center" prop="guiderAvgNewMember" />

      <el-table-column label="门店店均新增会员" align="center" prop="shopAvgNewMember" />

      <el-table-column label="会员转化率" align="center">
        <template #default="scope">{{ scope.row.memberConvertRatio || '0.00' }}%</template>
      </el-table-column>

      <el-table-column label="会员总数" align="center" prop="memberSum" />
    </el-table>

    <!-- 分页 -->
    <div class="pagination-wrap">
      <el-pagination
        v-model:currentPage="search.pageNum"
        :page-size="search.pageSize"
        :total="totalCount"
        :page-sizes="[10, 20, 50, 100]"
        layout="sizes, total, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts" name="RegionAnalysisList">
import { reactive, ref } from 'vue';
import SearchSelect from './SearchSelect.vue';
import * as ApiReport from '@/api/report';
import type { searchTypes } from '#/common';

const dataList = reactive<any[]>([]); // 表格数据
const totalCount = ref<number>(0); // 列表长度
const searchType = ref<number>(0); // 搜索类型 0区域 1省级 2市级

// 搜索条件
let search = reactive<searchTypes>({
  storeType: null,
  regionCode: null,
  provinceCode: null,
  startTime: null,
  endTime: null,
  pageNum: 1,
  pageSize: 10,
});

// 获取列表
const getList = (() => {
  ApiReport.regionAnalysisList(search).then(({ data }) => {
    const resData = data;
    dataList.splice(0, dataList.length);
    dataList.push(...resData.dataList);
    totalCount.value = resData.totalCount || 0;
  });
});

/**
 * 导出
 * @param { Object } data
 */
const exportFn = ((data: searchTypes) => {
  search = { ...search, ...data };
  ApiReport.regionAnalysisExport(search, '区域分析报表').then(() => {
    console.log('success');
  });
});

/**
 * 搜索
 * @param { Object } data
 */
const searchFn = ((data: searchTypes) => {
  search = { ...search, ...data };
  search.pageNum = 1;
  if (search.provinceCode) {
    searchType.value = 2;
  } else if (search.regionCode) {
    searchType.value = 1;
  } else {
    searchType.value = 0;
  }
  getList();
});

// 切换页长
const handleSizeChange = ((e: number) => {
  search.pageSize = e;
  getList();
});

// 切换页码
const handleCurrentChange = ((e: number) => {
  search.pageNum = e;
  getList();
});

</script>

<style lang="scss" scoped>
.pagination-wrap {
  margin-top: 20px;
  text-align: right;
}
</style>
