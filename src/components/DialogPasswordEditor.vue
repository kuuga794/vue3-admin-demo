<template>
  <div class="dialog-wrap">
    <el-dialog width="520px" v-model="dialogVisible" title="修改密码" @close="closeEditor(formRef)">
      <el-form :model="formData" :rules="rules" ref="formRef">
        <el-form-item label="请输入原密码" prop="oldPassword">
          <el-input
            v-model="formData.oldPassword"
            type="password"
            autocomplete="off"
            maxlength="16"
            placeholder="请输入原密码"
            show-password
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="请输入新密码" prop="newPassword">
          <el-input
            v-model="formData.newPassword"
            type="password"
            autocomplete="off"
            maxlength="16"
            placeholder="请输入新密码"
            show-password
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="请确认新密码" prop="checkPassword">
          <el-input
            v-model="formData.checkPassword"
            type="password"
            autocomplete="off"
            maxlength="16"
            placeholder="请确认新密码"
            show-password
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeEditor(formRef)">取消</el-button>
          <el-button type="primary" @click="submitForm(formRef)">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineExpose } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import * as ApiLogin from '@/api/login';

const formRef = ref<FormInstance>(); // formRef
const dialogVisible = ref<boolean>(false); // 是否弹窗可见

// 表单数据
const formData = reactive<any>({
  oldPassword: null,
  newPassword: null,
  checkPassword: null,
});

// 校验新密码
const validatePass = (rule: any, value: any, callback: any) => {
  if (!value || value.length < 8) {
    callback(new Error('包括数字和字母、长度8到16位的密码组合'));
  } else if (value === formData.oldPassword) {
    callback(new Error('新密码不能与旧密码相同'));
  } else {
    if (formData.checkPassword !== '') {
      if (!formRef.value) return;
      formRef.value.validateField('checkPassword', () => null);
    }
    callback();
  }
};

// 校验确认密码
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (!value || value.length < 8) {
    callback(new Error('包括数字和字母、长度8到16位的密码组合'));
  } else if (value !== formData.newPassword) {
    callback(new Error('两次输入密码不一致!'));
  } else {
    callback();
  }
};

// 表单校验规则
const rules = reactive<FormRules>({
  oldPassword: [
    { required: true, message: '包括数字和字母、长度8到16位的密码组合', trigger: 'change' },
  ],
  newPassword: [
    {
      pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{8,16}$/,
      message: '包括数字和字母、长度8到16位的密码组合',
      trigger: 'change',
    },
    { required: true, validator: validatePass, trigger: 'change' },
  ],
  checkPassword: [{ required: true, validator: validatePass2, trigger: 'change' }],
});

/**
 * 显示编辑弹窗
 * @param {string} id 任务ID
 */
const showEditor = () => {
  dialogVisible.value = true;
};

/**
 * 关闭编辑弹窗
 */
const closeEditor = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  dialogVisible.value = false;
};

/**
 * 提交
 */
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      ApiLogin.updatePassword(formData).then((res: TypeResponse) => {
        ElMessage.success(res.msg);
        closeEditor(formRef.value);
      });
    }
  });
};

// 将子组件的方法和属性暴露出去
defineExpose({
  showEditor,
});
</script>
