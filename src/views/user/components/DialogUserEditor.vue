<template>
  <div class="dialog-wrap">
    <el-dialog
      width="520px"
      v-model="dialogVisible"
      :title="dialogTitle"
      @close="closeEditor(formRef)"
    >
      <el-form :model="formData" :rules="rules" label-width="100px" ref="formRef">
        <el-form-item label="角色" prop="roleId">
          <el-select
            v-model.number="formData.roleId"
            :disabled="!!formData.userId"
            placeholder="请选择用户类型"
            style="width: 320px"
          >
            <el-option
              v-for="item in roleList"
              :label="item.roleName"
              :value="item.roleId"
              :key="item.roleId"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="用户编码" prop="userName">
          <el-input
            v-model.trim="formData.userName"
            :disabled="!!formData.userId"
            placeholder="请输入用户编码"
            clearable
            style="width: 320px"
          />
        </el-form-item>

        <el-form-item label="用户名称" prop="nickName">
          <el-input
            v-model.trim="formData.nickName"
            placeholder="请输入用户名称"
            clearable
            style="width: 320px"
          />
        </el-form-item>

        <el-form-item label="供应商简称" prop="userNameShort" v-if="formData.roleId === 3">
          <el-input
            v-model.trim="formData.userNameShort"
            placeholder="请输入用户名称"
            clearable
            style="width: 320px"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeEditor(formRef)">取消</el-button>
          <el-button type="primary" @click="submitForm(formRef)">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="DialogUserEditor">
import { ref, reactive, defineEmits, defineExpose } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import * as ApiUser from '@/api/user';
import useCommonStore from '@/store/modules/common';

const emit = defineEmits(['onSuccess']); // emit
const formRef = ref<FormInstance>(); // formRef
const dialogTitle = ref<string>('添加用户'); // dialog Title
const dialogVisible = ref<boolean>(false); // 是否弹窗可见
const commonStore = useCommonStore();

// 表单数据
const formData = reactive<{
  userId: number | null;
  userName: string | null;
  nickName: string | null;
  roleId: number | null;
  userNameShort: string | null;
}>({
  userId: null,
  userName: null,
  nickName: null,
  roleId: 3,
  userNameShort: null,
});

const roleList = reactive([
  { roleId: 1, roleName: '超级管理员', disabled: true },
  { roleId: 2, roleName: '普通用户', disabled: true },
  ...commonStore.roleList.filter((item) => item.roleId !== 2),
]);

// 表单校验规则
const rules = reactive<FormRules>({
  userName: [
    { required: true, message: '此项必填', trigger: 'change' },
    {
      pattern: /^[A-Za-z0-9][A-Za-z0-9]{5,14}$/,
      message: '请输入6到15位数字或字母',
      trigger: 'change',
    },
  ],
  nickName: [{ required: true, message: '此项必填', trigger: 'change' }],
  roleId: [{ required: true, message: '此项必填', trigger: 'change' }],
  userNameShort: [{ required: true, message: '此项必填', trigger: 'change' }],
});

/**
 * 显示编辑弹窗
 * @param { any } data 用户信息
 */
const showEditor = (data?: any) => {
  dialogVisible.value = true;
  if (data) {
    dialogTitle.value = '编辑账号';
    formData.userId = data.userId;
    formData.userName = data.userName;
    formData.nickName = data.nickName;
    formData.roleId = data.roleId;
    formData.userNameShort = data.userNameShort;
  }
  dialogVisible.value = true;
};

/**
 * 关闭编辑弹窗
 */
const closeEditor = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  dialogVisible.value = false;
  formData.userId = null;
  formData.userName = null;
  formData.nickName = null;
  formData.roleId = 3;
  formData.userNameShort = null;
  dialogTitle.value = '添加账号';
};

/**
 * 提交
 */
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      ApiUser[formData.userId ? 'updateUser' : 'createUser'](formData).then((res: TypeResponse) => {
        emit('onSuccess', res.data);
        ElMessage.success(`${formData.userId ? '修改' : '添加'}成功`);
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
