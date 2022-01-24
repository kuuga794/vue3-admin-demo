<template>
  <div class="analysis-wrap">
    <!-- 筛选 -->
    <SearchSelect :type="1" :recent="1" @search="searchFn" @export="exportFn" />

    <!-- 列表 -->
    <el-table :data="dataList">
      <el-table-column label="门店" align="center" prop="storeName" />

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

      <el-table-column label="小程序使用率" align="center" prop="minappUseRatio">
        <template #default="scope">{{ scope.row.minappUseRatio }}%</template>
      </el-table-column>

      <el-table-column label="多次访问率" align="center" prop="moreTimeComeRatio">
        <template #default="scope">{{ scope.row.moreTimeComeRatio }}%</template>
      </el-table-column>

      <!-- <el-table-column
        label="深入访问人数"
        align="center"
      prop="deepComePeopleNum" />-->

      <el-table-column label="人均访问时间" align="center" prop="peopleAveComeTime" />

      <el-table-column label="增粉数" align="center" prop="fansSum" />

      <el-table-column label="日新增会员数" align="center" prop="yesterdayNewMemberNum">
        <template #default="scope">
          {{ scope.row.yesterdayNewMemberNum }}
          <el-icon v-if="scope.row.dayNewMemberDiff >= 0" style="color: #F56C6C;">
            <top />
            {{ scope.row.dayNewMemberDiff }}
          </el-icon>
          <el-icon v-else style="color: #67C23A;">
            <bottom />
            {{ Math.abs(scope.row.dayNewMemberDiff) }}
          </el-icon>
        </template>
      </el-table-column>

      <el-table-column label="月新增会员数" align="center" prop="monthNewMemberNum" />

      <el-table-column label="导购人均新增会员" align="center" prop="avgGuiderAddMemberRatio" />

      <el-table-column label="会员转化率" align="center" prop="memberConvertRatio">
        <template #default="scope">{{ scope.row.memberConvertRatio }}%</template>
      </el-table-column>

      <el-table-column label="会员总数" align="center" prop="totalMember" />
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

<script setup lang="ts" name="StoreAnalysisList">
import { reactive, ref } from 'vue';
import SearchSelect from './SearchSelect.vue';
import * as ApiReport from '@/api/report';
import type { searchTypes } from '#/common';

const dataList = reactive<any[]>([]); // 表格数据
const totalCount = ref<number>(0); // 列表长度

// 搜索条件
let search = reactive<searchTypes>({
  storeType: null,
  regionCode: null,
  provinceCode: null,
  cityCode: null,
  startTime: null,
  endTime: null,
  pageNum: 1,
  pageSize: 10,
});

const getList = (() => {
  ApiReport.storeAnalysisList(search).then(({ data }) => {
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
});

/**
 * 搜索
 * @param { Object } data
 */
const searchFn = ((data: searchTypes) => {
  search = { ...search, ...data };
  search.pageNum = 1;
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
