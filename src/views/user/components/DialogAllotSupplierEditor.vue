<template>
  <div class="dialog-wrap">
    <el-dialog
      width="520px"
      v-model="dialogVisible"
      :title="dialogTitle"
      @close="closeEditor(formRef)"
    >
      <el-form :model="formData" :rules="rules" label-width="100px" ref="formRef">
        <el-form-item label="供应商" prop="supplierId">
          <el-select
            v-model="formData.supplierId"
            multiple
            filterable
            collapse-tags
            collapse-tags-tooltip
            placeholder="请选择供应商"
            style="width: 320px"
          >
            <el-option
              v-for="item in dataList"
              :label="item.nickName"
              :value="item.userId"
              :key="item.userId"
            />
          </el-select>
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

<script setup lang="ts" name="DialogAllotSupplierEditor">
import { ref, reactive, defineEmits, defineExpose } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import * as ApiUser from '@/api/user';

const emit = defineEmits(['onSuccess']); // emit
const dialogTitle = ref<string>('分配供应商'); // dialog Title
const formRef = ref<FormInstance>(); // formRef
const dialogVisible = ref<boolean>(false); // 是否弹窗可见
const dataList = reactive<any>([]); // 未分配供应商列表

// 表单数据
const formData = reactive<{
  accountingId: number | null;
  supplierId: any;
}>({
  accountingId: null,
  supplierId: [],
});

// 表单校验规则
const rules = reactive<FormRules>({
  supplierId: [{ required: true, message: '此项必填', trigger: 'change' }],
});

/**
 * 获取未分配供应商
 */
const getUnaSupplier = () => {
  ApiUser.getUnaSupplier().then((res: TypeResponse) => {
    dataList.splice(0, dataList.length);
    dataList.push(...res.data);
  });
};

/**
 * 显示编辑弹窗
 * @param { Number } accountingId 会计id
 */
const showEditor = (accountingId: number) => {
  dialogVisible.value = true;
  formData.accountingId = accountingId;
  getUnaSupplier();
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
      ApiUser.Allot(formData).then((res: TypeResponse) => {
        emit('onSuccess', res.data);
        ElMessage.success('分配成功');
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
