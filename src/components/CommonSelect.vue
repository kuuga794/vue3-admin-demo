<template>
  <el-select
    v-model="form[formKey]"
    :placeholder="placeholder"
    :disabled="isDisabled"
    :multiple="isMultiple"
    :clearable="canClear"
    filterable
    collapse-tags
    :style="`width: ${inputWidth}`"
    @change="handleChange"
    class="reset-element-select"
    :class="{
      blue: isBlue,
    }"
  >
    <el-option v-if="isShowAllOption" label="全部" :value="null" />
    <el-option
      v-for="item in selectList"
      :label="item[labelProp]"
      :value="item[valueProp]"
      :key="item[valueProp]"
    />
  </el-select>
</template>

<script setup lang="ts" name="CommonSelect">
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  selectList: {
    type: Array,
    default: () => [],
  },
  // 默认选中
  form: {
    required: true,
    type: Object,
  },
  formKey: {
    required: true,
    type: String,
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
  // labelProp
  labelProp: {
    type: String,
    default: 'label',
  },
  // valueProp
  valueProp: {
    type: String,
    default: 'value',
  },
  // placeholder
  placeholder: {
    type: String,
    default: '请选择',
  },
  // canClear
  canClear: {
    type: Boolean,
    default: true,
  },
  // isBlue
  isBlue: {
    type: Boolean,
    default: false,
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

/**
 * 清除
 */
const handleClear = () => {
  selectIds.value = null;
};
</script>

<style lang="scss">
.reset-element-select .el-input {
  width: 100% !important;
}

.reset-element-select.blue .el-input__wrapper {
  background: #f5f7fc;
}
</style>
