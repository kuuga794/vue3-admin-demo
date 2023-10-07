<template>
  <div class="dialog-wrap">
    <el-dialog
      width="1000px"
      v-model="dialogVisible"
      :close-on-click-modal="!isRequired"
      :close-on-press-escape="!isRequired"
      :show-close="!isRequired"
      @close="closeEditor(formRef)"
    >
      <el-form :model="formData" :rules="rules" :show-message="false" ref="formRef">
        <div class="my-descriptions-title">
          <span>销货方开票信息</span>
          <span>销货方银行信息</span>
        </div>
        <el-descriptions :column="2" border>
          <el-descriptions-item
            align="left"
            label-align="center"
            label="供应商账号"
            label-class-name="my-descriptions-label"
            class-name="my-descriptions-content"
          >
            {{ formData.supplierAccount }}
          </el-descriptions-item>

          <el-descriptions-item
            align="left"
            label-align="center"
            label="销货方银行账号"
            label-class-name="my-descriptions-label"
            class-name="my-descriptions-content"
          >
            <el-form-item prop="sellerBankAccount">
              <el-input
                v-model.trim="formData.sellerBankAccount"
                maxlength="100"
                autocomplete="off"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item
            align="left"
            label-align="center"
            label="供应商名称"
            class-name="my-descriptions-content"
          >
            {{ formData.supplierName }}
          </el-descriptions-item>

          <el-descriptions-item
            align="left"
            label-align="center"
            label="销货方开户银行"
            class-name="my-descriptions-content"
          >
            <el-form-item prop="sellerOpenBank">
              <el-input v-model.trim="formData.sellerOpenBank" maxlength="100" autocomplete="off" />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item
            align="left"
            label-align="center"
            label="纳税登记号"
            class-name="my-descriptions-content"
          >
            <el-form-item prop="taxRegistraNo">
              <el-input
                v-model.trim="formData.taxRegistraNo"
                maxlength="20"
                show-word-limit
                autocomplete="off"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item
            align="left"
            label-align="center"
            label="开户省份"
            class-name="my-descriptions-content"
          >
            <el-form-item prop="openProvince">
              <el-input v-model.trim="formData.openProvince" maxlength="100" autocomplete="off" />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item
            align="left"
            label-align="center"
            label="地址和电话"
            class-name="my-descriptions-content"
          >
            <el-form-item prop="addressPhone">
              <el-input v-model.trim="formData.addressPhone" maxlength="100" autocomplete="off" />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item
            align="left"
            label-align="center"
            label="开户城市"
            class-name="my-descriptions-content"
          >
            <el-form-item prop="openCity">
              <el-input v-model.trim="formData.openCity" maxlength="100" autocomplete="off" />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item
            align="left"
            label-align="center"
            label="银行及账号"
            class-name="my-descriptions-content"
          >
            <el-form-item prop="bankAccount">
              <el-input v-model.trim="formData.bankAccount" maxlength="100" autocomplete="off" />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item
            align="left"
            label-align="center"
            label="开户支行"
            class-name="my-descriptions-content"
          >
            <el-form-item prop="openBranch">
              <el-input v-model.trim="formData.openBranch" maxlength="100" autocomplete="off" />
            </el-form-item>
          </el-descriptions-item>
        </el-descriptions>

        <p class="p-tips">Tips: 请谨慎填写，如信息错误或信息更改，请联系周六福对账会计变更信息</p>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button v-if="!isRequired" @click="closeEditor(formRef)">取消</el-button>
          <el-button type="primary" @click="submitForm(formRef)">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineEmits, defineExpose } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import * as ApiUser from '@/api/user';

const emit = defineEmits(['onSuccess']); // emit
const formRef = ref<FormInstance>(); // formRef
const dialogVisible = ref<boolean>(false); // 是否弹窗可见
const isRequired = ref<boolean>(false);

// 表单数据
const formData = reactive<any>({
  id: null, // id
  userName: null, // username
  supplierAccount: null, // 供应商账号
  supplierName: null, // 供应商名称
  sellerBankAccount: null, // 销货方银行账号
  sellerOpenBank: null, // 销货方开户银行
  taxRegistraNo: null, // 纳税登记号
  openProvince: null, // 开户省份
  openCity: null, // 开户城市
  addressPhone: null, // 地址和电话
  bankAccount: null, // 银行和账号
  openBranch: null, // 开户支行
});

// 表单校验规则
const rules = reactive<FormRules>({
  sellerBankAccount: [{ required: true, message: '此项必填', trigger: 'change' }],
  sellerOpenBank: [{ required: true, message: '此项必填', trigger: 'change' }],
  taxRegistraNo: [{ required: true, message: '此项必填', trigger: 'change' }],
  openProvince: [{ required: true, message: '此项必填', trigger: 'change' }],
  openCity: [{ required: true, message: '此项必填', trigger: 'change' }],
  addressPhone: [{ required: true, message: '此项必填', trigger: 'change' }],
  bankAccount: [{ required: true, message: '此项必填', trigger: 'change' }],
  openBranch: [{ required: true, message: '此项必填', trigger: 'change' }],
});

/**
 * 根据供应商账号userName查询销货方的开票和银行信息
 */
const getSupplierSellerInfo = () => {
  ApiUser.getSupplierSellerInfo({ userName: formData.userName }).then(({ data }) => {
    formData.id = data.id;
    formData.userName = data.supplierAccount;
    formData.supplierAccount = data.supplierAccount;
    formData.supplierName = data.supplierName;
    formData.sellerBankAccount = data.sellerBankAccount;
    formData.sellerOpenBank = data.sellerOpenBank;
    formData.taxRegistraNo = data.taxRegistraNo;
    formData.openProvince = data.openProvince;
    formData.openCity = data.openCity;
    formData.addressPhone = data.addressPhone;
    formData.bankAccount = data.bankAccount;
    formData.openBranch = data.openBranch;
  });
};

/**
 * 显示编辑弹窗
 * @param {String} userName 供应商id
 */
const showEditor = (userName: string, required: boolean = false) => {
  dialogVisible.value = true;
  formData.userName = userName;
  isRequired.value = required;
  getSupplierSellerInfo();
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
      ApiUser.updateSupplierSellerInfo(formData).then((res: TypeResponse) => {
        emit('onSuccess', res.data);
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

<style lang="scss" scoped>
.p-tips {
  margin-top: 12px;
}
</style>
