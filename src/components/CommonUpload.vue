<template>
  <el-upload
    :class="{
      ml10: !dropdownItem,
    }"
    :headers="{
      Authorization: token,
    }"
    :on-success="handleUploadSuccess"
    :on-error="handleUploadError"
    :before-upload="handleBeforeUpload"
    :show-file-list="false"
    :action="$baseUrl + uploadUrl"
    :disabled="isDisabled"
    :name="name"
    :data="customerData"
    accept=".xlsx"
  >
    <el-dropdown-item v-if="dropdownItem">{{ buttonText }}</el-dropdown-item>
    <el-button v-else :loading="uploading" type="primary" icon="upload">{{ buttonText }}</el-button>
  </el-upload>
</template>

<script setup lang="ts" name="CommonUpload">
import Cookies from 'js-cookie';
import { ref, defineProps, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';
import { CONFIG_UPLOAD_MAX_SIZE } from '@/config/config';

const uploading = ref<boolean>(false); // 上传loading
const emit = defineEmits(['onSuccess', 'onError']); // emit
const token = `Bearer ${Cookies.get('c_token')}`; // token
const props = defineProps({
  // 请求地址
  uploadUrl: {
    required: true,
    type: String,
  },
  // 上传时附带的额外参数
  customerData: {
    type: Object,
    default: () => {},
  },
  // 上传的文件字段名
  name: {
    type: String,
    default: 'file',
  },
  // 是否禁用
  isDisabled: {
    type: Boolean,
    default: false,
  },
  // 按钮文案
  buttonText: {
    type: String,
    default: '导入模板',
  },
  // 是否禁用
  dropdownItem: {
    type: Boolean,
    default: false,
  },
});

/**
 * emit --- success
 */
const handleUploadSuccess = (res) => {
  uploading.value = false;
  emit('onSuccess', res);
};

/**
 * emit --- error
 */
const handleUploadError = (err) => {
  uploading.value = false;
  emit('onError', err);
};

/**
 * 限制导入类型 --- 上传前
 * @param { Object } file 目标文件
 */
const handleBeforeUpload = (file: any) => {
  const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1);
  const whiteList = ['xlsx'];
  if (whiteList.indexOf(fileSuffix) === -1) {
    ElMessage.error('上传文件只能是xlsx格式');
    return false;
  }
  const fileSize = file.size / 1024 / 1024;
  if (fileSize > CONFIG_UPLOAD_MAX_SIZE) {
    ElMessage.error(`上传文件大小不能超过 ${CONFIG_UPLOAD_MAX_SIZE}MB`);
    return false;
  }
  uploading.value = true;
  return true;
};
</script>

<style scoped>
.ml10 {
  margin-left: 10px;
}
</style>
