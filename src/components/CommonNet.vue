<template>
  <el-select
    v-model="form[formKey]"
    :placeholder="placeholder"
    :disabled="isDisabled"
    :multiple="isMultiple"
    clearable
    filterable
    collapse-tags
    :style="`width: ${inputWidth}`"
    @change="handleChange"
  >
    <el-option v-if="isShowAllOption" label="全部" :value="null" />
    <el-option
      v-for="item in supplierList"
      :label="item.nickName"
      :value="item[valueKey]"
      :key="item.userId"
    />
  </el-select>
</template>

<script setup lang="ts" name="CommonSelect">
import { ref, reactive, defineProps, defineEmits } from 'vue';
import useCommonStore from '@/store/modules/common';

const commonStore = useCommonStore(); // commonStore
const supplierList = reactive<any[]>(commonStore.supplierList); // 供应商列表

const props = defineProps({
  form: {
    required: true,
    type: Object,
  },
  formKey: {
    required: true,
    type: String,
  },
  valueKey: {
    type: String,
    default: 'userNameShort',
  },
  isShowAllOption: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  // 宽度
  inputWidth: {
    type: String,
    default: '220px',
  },
  // 是否支持多选
  isMultiple: {
    type: Boolean,
    default: false,
  },
  // placeholder
  placeholder: {
    type: String,
    default: '请选择供应商',
  },
});

const emit = defineEmits(['onChange']);
const selectIds = ref<any>(null); // 选中id

/**
 * emit
 */
const emitFn = () => {
  emit('onChange', selectIds.value);
};

/**
 * 切换
 */
const handleChange = (val: any) => {
  if (!val) {
    selectIds.value = null;
  } else {
    selectIds.value = val;
  }
  emitFn();
};
</script>
