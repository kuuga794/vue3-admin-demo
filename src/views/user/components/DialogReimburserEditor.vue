<template>
  <div class="dialog-wrap">
    <el-dialog
      width="520px"
      v-model="dialogVisible"
      :title="dialogTitle"
      @close="closeEditor(formRef)"
    >
      <el-form :model="formData" :rules="rules" label-width="100px" ref="formRef">
        <el-form-item label="报销人" prop="reimburser">
          <el-input
            v-model.trim="formData.reimburser"
            maxlength="20"
            placeholder="请输入报销人"
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

const emit = defineEmits(['onSuccess']); // emit
const dialogTitle = ref<string>('填写报销人'); // dialog Title
const formRef = ref<FormInstance>(); // formRef
const dialogVisible = ref<boolean>(false); // 是否弹窗可见

// 表单数据
const formData = reactive<{
  userId: any | null;
  reimburser: string | null;
}>({
  userId: [],
  reimburser: null,
});

// 表单校验规则
const rules = reactive<FormRules>({
  reimburser: [{ required: true, message: '此项必填', trigger: 'change' }],
});

/**
 * 显示编辑弹窗
 * @param { any } data 用户信息
 */
const showEditor = (data?: any) => {
  data?.forEach((element?: any) => {
    formData.userId.push(element.userId);
  });
  dialogVisible.value = true;
};

/**
 * 关闭编辑弹窗
 */
const closeEditor = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  dialogVisible.value = false;
  formData.userId = [];
  formData.reimburser = null;
};

/**
 * 提交
 */
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      ApiUser.updateReimburser(formData).then((res: TypeResponse) => {
        emit('onSuccess', res.data);
        ElMessage.success('修改成功');
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
