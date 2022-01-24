<template>
  <div class="main-box">
    <el-tabs type="border-card">
      <!-- 区域分析 -->
      <el-tab-pane label="区域分析" :lazy="true">
        <RegionAnalysisList />
      </el-tab-pane>
      <!-- 门店分析 -->
      <el-tab-pane label="门店分析" :lazy="true">
        <StoreAnalysisList />
      </el-tab-pane>
      <!-- 导购分析 -->
      <el-tab-pane label="导购分析" :lazy="true">
        <EmployeeAnalysisList />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts" name="useAnalysis">
import RegionAnalysisList from './components/RegionAnalysisList.vue';
import StoreAnalysisList from './components/StoreAnalysisList.vue';
import EmployeeAnalysisList from './components/EmployeeAnalysisList.vue';
</script>

<style lang="scss" scoped></style>
