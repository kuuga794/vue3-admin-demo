<template>
  <el-date-picker
    :style="`width: ${dateWidth}px`"
    v-model="dateRange"
    :range-separator="rangeSeparator"
    :start-placeholder="startPlaceholder"
    :end-placeholder="endPlaceholder"
    :disabled="isDisabled"
    :type="dateType"
    :format="labelFormat"
    :value-format="valueFormat"
    :shortcuts="CONFIG_SHORTCUTS"
    :default-time="CONFIG_DEFAULTTIME"
    :disabled-date="disabledDate"
    @change="onChangeDate"
  />
</template>

<script setup lang="ts" name="DateRangeSelect">
import { ref, defineProps, defineExpose } from 'vue';
import { CONFIG_SHORTCUTS, CONFIG_DEFAULTTIME } from '@/config/config';

const dateRange = ref<string[]>([]);

const props = defineProps({
  dateWidth: {
    type: Number,
    default: 360,
  },
  startPlaceholder: {
    type: String,
    default: '开始时间',
  },
  endPlaceholder: {
    type: String,
    default: '结束时间',
  },
  rangeSeparator: {
    type: String,
    default: '至',
  },
  form: {
    required: true,
    type: Object,
  },
  startDateKey: {
    required: true,
    type: String,
  },
  endDateKey: {
    required: true,
    type: String,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  dateType: {
    type: String,
    default: 'datetimerange',
    validator(val: string) {
      return ['daterange', 'datetimerange'].indexOf(val) !== -1;
    },
  },
  labelFormat: {
    type: String,
    default: 'YYYY-MM-DD HH:mm:ss',
    validator(val: string) {
      return ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss'].indexOf(val) !== -1;
    },
  },
  valueFormat: {
    type: String,
    default: 'YYYY-MM-DD HH:mm:ss',
    validator(val: string) {
      return ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss'].indexOf(val) !== -1;
    },
  },
  disabledDate: {
    type: Function,
    default: (time: Date) => time.getTime() > Date.now(),
  },
});

/**
 * init
 */
const initDate = () => {
  if (props.form[props.startDateKey] && props.form[props.endDateKey]) {
    return [props.form[props.startDateKey], props.form[props.endDateKey]];
  }
  return [];
};
dateRange.value = initDate();

/**
 * change select
 */
const onChangeDate = (val) => {
  if (val) {
    props.form[props.startDateKey] = val[0];
    props.form[props.endDateKey] = val[1];
  } else {
    dateRange.value = [];
    props.form[props.startDateKey] = null;
    props.form[props.endDateKey] = null;
  }
};

/**
 * reset
 */
const reset = (startDate = null, endDate = null) => {
  props.form[props.startDateKey] = startDate;
  props.form[props.endDateKey] = endDate;
  if (startDate && endDate) {
    dateRange.value = [startDate, endDate];
  } else {
    dateRange.value = [];
  }
};

// 将子组件的方法和属性暴露出去
defineExpose({
  reset,
});
</script>
