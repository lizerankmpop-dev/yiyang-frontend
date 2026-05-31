<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>管理员管理</span>
          <el-button type="primary" @click="handleAdd">新增管理员</el-button>
        </div>
      </template>

      <el-form :model="queryForm" inline style="margin-bottom: 20px;">
        <el-form-item label="用户名">
          <el-input v-model="queryForm.keyword" placeholder="请输入关键词" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchList">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border stripe>
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button size="small" :type="scope.row.status === 1 ? 'warning' : 'success'" @click="handleToggleStatus(scope.row)">
              {{ scope.row.status === 1 ? '停用' : '启用' }}
            </el-button>
            <el-button size="small" type="primary" @click="handleResetPassword(scope.row)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="margin-top: 20px; text-align: right;"
        :current-page="queryForm.page"
        :page-size="queryForm.size"
        :total="total"
        layout="total, prev, pager, next, jumper"
        @current-change="handlePageChange"
      />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" v-if="!form.id">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAdminList, toggleStatus, resetPassword, register } from '@/api/admin'

const dialogVisible = ref(false)
const dialogTitle = ref('新增')
const tableData = ref([])
const total = ref(0)

const queryForm = reactive({ keyword: '', page: 1, size: 10 })
const form = reactive({
  id: null,
  username: '',
  password: '',
  nickname: ''
})

const fetchList = async () => {
  try {
    const res = await getAdminList(queryForm)
    tableData.value = res.records || res || []
    total.value = res.total || 0
  } catch (e) { console.error(e) }
}

const resetQuery = () => {
  queryForm.keyword = ''
  queryForm.page = 1
  fetchList()
}

const handlePageChange = (page) => {
  queryForm.page = page
  fetchList()
}

const handleAdd = () => {
  dialogTitle.value = '新增'
  Object.keys(form).forEach(k => form[k] = null)
  dialogVisible.value = true
}

const handleToggleStatus = (row) => {
  const action = row.status === 1 ? '停用' : '启用'
  ElMessageBox.confirm(`确定要${action}该管理员吗？`, '提示', { type: 'warning' })
    .then(async () => {
      await toggleStatus(row.id)
      ElMessage.success(`${action}成功`)
      fetchList()
    }).catch(() => {})
}

const handleResetPassword = (row) => {
  ElMessageBox.confirm('确定要重置该管理员的密码吗？重置后密码为：123456', '提示', { type: 'warning' })
    .then(async () => {
      await resetPassword(row.id, '123456')
      ElMessage.success('密码重置成功，新密码为：123456')
    }).catch(() => {})
}

const handleSave = async () => {
  try {
    if (form.id) {
      ElMessage.info('管理员信息编辑功能暂未开放')
    } else {
      await register({ username: form.username, password: form.password, nickname: form.nickname })
      ElMessage.success('保存成功')
    }
    dialogVisible.value = false
    fetchList()
  } catch (e) { console.error(e) }
}

onMounted(() => fetchList())
</script>
