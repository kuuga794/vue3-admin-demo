<template>
  <div class="content">
    <el-tabs type="border-card">
      <!-- S 过滤 -->
      <div class="content-control">
        <el-form :inline="true" label-width="100px">
          <el-form-item label="用户编码">
            <el-input
              v-model.trim="listQuery.userName"
              placeholder="请输入用户编码"
              clearable
              style="width: 220px"
            />
          </el-form-item>

          <el-form-item label="用户名称">
            <el-input
              v-model.trim="listQuery.nickName"
              placeholder="请输入用户名称"
              clearable
              style="width: 220px"
            />
          </el-form-item>

          <el-form-item label="状态">
            <el-select
              v-model="listQuery.status"
              clearable
              placeholder="请选择状态"
              style="width: 220px"
            >
              <el-option label="启用" :value="0" />
              <el-option label="禁用" :value="1" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="btn-line">
          <el-button type="primary" icon="Refresh" @click="onReset">重置</el-button>
          <el-button type="primary" icon="Search" @click="onSearch">搜索</el-button>
        </div>
      </div>
      <!-- E 过滤 -->

      <!-- S 按钮组 -->
      <div class="content-button">
        <el-button type="primary" icon="Plus" @click="handleEditorUser">添加账号</el-button>
        <el-button type="primary" icon="Plus" @click="handleEditorReimburser">填写报销人</el-button>
        <!-- <el-button type="primary" icon="Switch">分配供应商</el-button> -->
      </div>
      <!-- E 按钮组 -->

      <!-- S 表格 -->
      <div class="content-table">
        <el-table
          v-loading="loading"
          :data="dataList"
          @selection-change="handleSelectionChange"
          v-fixed-header
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="角色" align="center" prop="roleId">
            <template #default="scope">
              {{ roleMap[scope.row.roleId] }}
            </template>
          </el-table-column>
          <el-table-column label="用户编码" align="center" prop="userName" />
          <el-table-column label="用户名称" align="center" prop="nickName" />
          <el-table-column label="供应商简称" align="center" prop="userNameShort" />
          <el-table-column label="报销人" align="center" prop="reimburser" />
          <el-table-column label="创建时间" align="center" prop="createTime" />
          <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
              <span
                :class="{
                  'color-danger': scope.row.status == '1',
                  'color-success': scope.row.status == '0',
                }"
              >
                {{ ['启用', '禁用'][scope.row.status] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right">
            <template #default="scope">
              <el-button
                text
                type="primary"
                @click="handleEditorSupplier(scope.row.userName)"
                v-if="scope.row.roleId === 3"
                >编辑</el-button
              >
              <el-button text type="primary" @click="handleEditorUser(scope.row)" v-else
                >编辑</el-button
              >
              <el-button
                text
                type="primary"
                @click="handleSwitchUser(scope.row.userId, 1)"
                v-if="scope.row.status === '0'"
                >禁用</el-button
              >
              <el-button
                text
                type="primary"
                @click="handleSwitchUser(scope.row.userId, 0)"
                v-if="scope.row.status === '1'"
                >启用</el-button
              >
              <el-button
                text
                type="primary"
                @click="handleDeleteUser(scope.row.userId)"
                v-if="scope.row.status === '1'"
                >删除</el-button
              >
              <el-button text type="primary" @click="handleResetUser(scope.row.userId)"
                >重置密码</el-button
              >
              <!-- 供应商才有查看详情，点击展示该供应商 -->
              <!-- <el-button text type="primary" @click="handleResetUser(scope.row.userId)" v-if="scope.row.roleId === 3">查看详情</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- E 表格 -->

      <!-- S 分页 -->
      <div class="content-pagination">
        <Pagination
          :pageNum="listQuery.pageNum"
          :pageSize="listQuery.pageSize"
          :callback="getList"
          :total="totalCount"
        />
      </div>
      <!-- E 分页 -->
    </el-tabs>

    <!-- 编辑弹窗 --- 账号 --- 修改会计、主管、出纳 -->
    <DialogUserEditor ref="dialogUserEditorRef" @on-success="handleSuccess" />

    <!-- 填写报销人 -->
    <DialogReimburserEditor ref="dialogReimburserEditorRef" @on-success="handleSuccess" />

    <!-- 编辑弹窗 --- 修改供应商 -->
    <DialogSupplierEditor ref="dialogSupplierEditorRef" @on-success="handleSuccess" />
  </div>
</template>

<script setup lang="ts" name="UserList">
import { ref, reactive, onMounted, onActivated } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { listToObject } from '@/utils/index';
import * as ApiUser from '@/api/user';
import useCommonStore from '@/store/modules/common';
import Pagination from '@/components/Pagination.vue';
import DialogUserEditor from './components/DialogUserEditor.vue';
import DialogReimburserEditor from './components/DialogReimburserEditor.vue';
import DialogSupplierEditor from '@/components/DialogSupplierEditor.vue';

const dialogUserEditorRef = ref<any>(null); // 编辑弹窗 --- 账号
const dialogSupplierEditorRef = ref<any>(null); // 编辑弹窗 --- 供应商
const dialogReimburserEditorRef = ref<any>(null); // 编辑弹窗 --- 报销人
const multipleSelection = reactive<any[]>([]); // 选中数据
const commonStore = useCommonStore();

const roleList = reactive([
  {
    roleName: '超级管理员',
    roleId: 1,
  },
  ...commonStore.roleList,
]);

const roleMap = listToObject(roleList, 'roleId', 'roleName');

const loading = ref<boolean>(false); // loading
const dataList = reactive<any[]>([]); // 表格数据
const totalCount = ref<number>(0); // 列表长度

// 搜索条件
const listQuery = reactive<
  TypeListQuery & {
    userName: string | null;
    nickName: string | null;
    status: number | null;
  }
>({
  userName: null,
  nickName: null,
  status: null,
  pageNum: 1,
  pageSize: 50,
});

/**
 * 获取列表
 */
const getList = (pageData?: TypePageData) => {
  loading.value = true;
  if (pageData) {
    listQuery.pageNum = pageData.pageNum;
    listQuery.pageSize = pageData.pageSize;
  }
  ApiUser.getList(listQuery).then((res: TypeResponse) => {
    dataList.splice(0, dataList.length);
    dataList.push(...res.rows);
    totalCount.value = res.total || 0;
    loading.value = false;
  });
};

/**
 * 处理批量选中
 */
const handleSelectionChange = (val: any) => {
  multipleSelection.splice(0, multipleSelection.length);
  multipleSelection.push(...val);
};

/**
 * 编辑用户
 */
const handleEditorUser = (data?: any) => {
  dialogUserEditorRef.value.showEditor(data);
};

/**
 * 填写报销人
 */
const handleEditorReimburser = () => {
  if (multipleSelection.length === 0) {
    ElMessage.warning('请勾选用户');
  } else {
    dialogReimburserEditorRef.value.showEditor(multipleSelection);
  }
};

/**
 * 编辑供应商
 * @param { String } userName 供应商userName
 */
const handleEditorSupplier = (userName: string) => {
  dialogSupplierEditorRef.value.showEditor(userName);
};

/**
 * 删除用户
 */
const handleDeleteUser = (userId: number) => {
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'error',
  }).then(() => {
    const data = { userIds: [userId] };
    ApiUser.deleteUser(data).then(() => {
      ElMessage.success('删除成功');
      getList();
    });
  });
};

/**
 * 启用/禁用用户
 */
const handleSwitchUser = (userId: number, status: number) => {
  ElMessageBox.confirm(`确定要${['启用', '禁用'][status]}吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    ApiUser.switchUser({
      userId,
      status,
    }).then((res: TypeResponse) => {
      ElMessage.success(res.msg);
      getList();
    });
  });
};

/**
 * 重置密码
 */
const handleResetUser = (userId: number) => {
  ElMessageBox.confirm('确定要重置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    ApiUser.resetUser({ userId }).then(() => {
      ElMessage.success('重置成功');
    });
  });
};

/**
 * 搜索
 */
const onSearch = () => {
  listQuery.pageNum = 1;
  getList();
};

/**
 * 重置
 */
const onReset = () => {
  listQuery.userName = null;
  listQuery.nickName = null;
  listQuery.status = null;
  listQuery.pageNum = 1;
  getList();
};

/**
 * 处理编程成功
 */
const handleSuccess = () => {
  multipleSelection.splice(0, multipleSelection.length);
  getList();
};

/**
 * onMounted
 */
onMounted(() => {
  getList();
});

/**
 * onActivated
 */
onActivated(() => {
  getList();
});
</script>

<style lang="scss" scoped></style>
