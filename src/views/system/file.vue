<template>
  <div class="main-box">
    <el-tabs v-model="curTab" type="border-card">
      <el-tab-pane label="系统" :name="0">
        <div class="file-list">
          <div class="file-item">
            <div class="file-item-icon">
              <el-icon size="60px" color="#ffffff"><Collection /></el-icon>
            </div>
            <div class="file-item-tag">
              <el-tag class="mrb-6">操作手册</el-tag>
              <el-tag type="success" class="mrb-6">PDF</el-tag>
            </div>
            <div class="file-item-info">操作手册</div>
            <div class="file-item-button">
              <span class="tip"></span>

              <div style="width: 120px; display: flex; justify-content: flex-end">
                <el-upload
                  class="avatar-uploader mr-6"
                  :headers="{
                    Authorization: token,
                  }"
                  :action="$baseUrl + '/system/file/userManual/upload'"
                  name="file"
                  accept=".pdf"
                  :show-file-list="false"
                  :limit="1"
                  :before-upload="handleBeforeUpload"
                  :on-success="handleUploadSuccess"
                  :on-error="handleUploadError"
                >
                  <el-button type="primary" size="small" plain>上传</el-button>
                </el-upload>

                <el-button type="primary" size="small" plain @click="downloadManual"
                  >下载</el-button
                >
              </div>
            </div>
          </div>

          <div class="file-item">
            <div class="file-item-icon">
              <el-icon size="60px" color="#ffffff"><Bell /></el-icon>
            </div>
            <div class="file-item-tag">
              <el-tag class="mrb-6">系统公告</el-tag>
              <el-tag type="success" class="mrb-6">JPEG</el-tag>
            </div>
            <div class="file-item-info">系统公告</div>
            <div class="file-item-button">
              <span class="tip">(上传后请刷新页面)</span>

              <div style="width: 120px; display: flex; justify-content: flex-end">
                <el-upload
                  class="avatar-uploader mr-6"
                  :headers="{
                    Authorization: token,
                  }"
                  :action="$baseUrl + '/system/file/notice/upload'"
                  name="file"
                  accept=".jpeg,.png,.jpg"
                  :show-file-list="false"
                  :limit="1"
                  :before-upload="handleBeforeUploadByImage"
                  :on-success="handleUploadSuccess"
                  :on-error="handleUploadError"
                >
                  <el-button type="primary" size="small" plain>上传</el-button>
                </el-upload>
                <el-button type="primary" size="small" plain>预览</el-button>
              </div>

              <el-image
                style="
                  position: absolute;
                  bottom: 10px;
                  right: 10px;
                  width: 48px;
                  height: 24px;
                  opacity: 0;
                "
                :src="$baseUrl + '/profile/notice/notice.png'"
                :preview-teleported="true"
                :preview-src-list="[$baseUrl + '/profile/notice/notice.png']"
                fit="cover"
              />
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts" name="StyleNumber">
import { ref } from 'vue';
import Cookies from 'js-cookie';
import { ElMessage } from 'element-plus';
import * as ApiCommon from '@/api/common';

const curTab = ref<any>(0); // 当前 TAB
const token = `Bearer ${Cookies.get('c_token')}`; // token

/**
 * 上传图片
 */
const handleUploadSuccess = (res: TypeResponse) => {
  ElMessage.success('上传成功！');
};

const handleUploadError = () => {
  ElMessage.error('上传失败！');
};
const handleBeforeUpload = (file, fileList) => {
  const { name, size } = file;
  const suffix = name.substring(name.lastIndexOf('.') + 1);
  const acceptType = ['pdf'];
  if (!acceptType.includes(suffix)) {
    ElMessage.error('只支持pdf格式');
    fileList.pop();
    return;
  }
  if (size > 1024 * 1024 * 5) {
    ElMessage.error('文件大小限制在1M内');
    fileList.pop();
    return;
  }
  return true;
};

const handleBeforeUploadByImage = (file, fileList) => {
  const { name, size } = file;
  const suffix = name.substring(name.lastIndexOf('.') + 1);
  const acceptType = ['png', 'jpeg', 'jpg', 'svg'];
  if (!acceptType.includes(suffix)) {
    ElMessage.error('只支持png，jpeg，jpg，的图片格式');
    fileList.pop();
    return;
  }
  if (size > 1024 * 1024 * 1) {
    ElMessage.error('图片大小限制在1M内');
    fileList.pop();
    return;
  }
  return true;
};

/**
 * 下载供应商对账系统操作指引
 */
const downloadManual = () => {
  ApiCommon.downloadManual('供应商对账系统操作指引.pdf');
};
</script>

<style lang="scss" scoped>
.file-list {
  display: flex;
  .file-item {
    width: 245px;
    margin: 10px;
    padding-bottom: 10px;
    position: relative;
    border-radius: var(--el-border-radius-base);
    background-color: var(--el-fill-color-extra-light);
    box-shadow: var(--el-box-shadow-light);

    &-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 164px;
      background-color: #409eff;
    }

    &-tag {
      padding: 10px 10px 0;
      height: 60px;
    }

    &-info {
      padding: 6px 10px;
      font-size: 14px;
    }

    &-button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
    }

    .mrb-6 {
      margin: 0 6px 6px 0;
    }

    .mr-6 {
      margin-right: 6px;
    }
    .tip {
      font-size: 12px;
      color: var(--el-text-color-placeholder);
    }
  }
}
</style>
