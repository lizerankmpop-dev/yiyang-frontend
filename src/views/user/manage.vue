<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>用户管理</span>
          <el-button type="primary" @click="handleAdd">新增用户</el-button>
        </div>
      </template>

      <el-form :model="queryForm" inline style="margin-bottom: 20px;">
        <el-form-item label="用户名">
          <el-input v-model="queryForm.keyword" placeholder="请输入关键词" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="queryForm.role" placeholder="请选择角色" clearable>
            <el-option label="管理员" value="admin" />
            <el-option label="护士" value="nurse" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchList">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border stripe>
        <el-table-column prop="nickname" label="真实姓名" />
        <el-table-column prop="username" label="系统账号" />
        <el-table-column prop="role" label="角色">
          <template #default="scope">
            {{ scope.row.role === 'admin' ? '管理员' : '护士' }}
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别">
          <template #default="scope">
            {{ formatSex(scope.row.sex) }}
          </template>
        </el-table-column>
        <el-table-column prop="phoneNumber" label="电话号码" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="真实姓名" prop="nickname">
          <el-input v-model="form.nickname" />
        </el-form-item>
        <el-form-item label="系统账号" prop="username">
          <el-input v-model="form.username" :disabled="form.id !== null" />
        </el-form-item>
        <el-form-item label="密码" v-if="!form.id" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role">
            <el-option label="管理员" value="admin" />
            <el-option label="护士" value="nurse" />
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话号码" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
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
import { getUserList, userRegister, updateUser, deleteUser } from '@/api/user'

const dialogVisible = ref(false)
const dialogTitle = ref('新增')
const tableData = ref([])
const total = ref(0)

const queryForm = reactive({ keyword: '', role: '', page: 1, size: 10 })
const form = reactive({
  id: null,
  nickname: '',
  username: '',
  password: '',
  sex: '男',
  phoneNumber: '',
  email: '',
  role: 'admin'
})

const fetchList = async () => {
  try {
    const res = await getUserList(queryForm)
    tableData.value = res.records || res || []
    total.value = res.total || 0
  } catch (e) { 
    console.error(e) 
  }
}

const resetQuery = () => {
  queryForm.keyword = ''
  queryForm.role = ''
  queryForm.page = 1
  fetchList()
}

const handlePageChange = (page) => {
  queryForm.page = page
  fetchList()
}

const handleAdd = () => {
  dialogTitle.value = '新增'
  Object.keys(form).forEach(k => {
    if (k === 'sex') form[k] = '男'
    else if (k === 'role') form[k] = 'admin'
    else form[k] = null
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑'
  Object.assign(form, row)
  // 后端返回sex是1/2，前端表单需要男/女
  if (row.sex === 1) form.sex = '男'
  else if (row.sex === 2) form.sex = '女'
  else form.sex = row.sex || '男'
  form.password = '' // 编辑时密码清空
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  // 判断是否是超级管理员（role=admin 且 id=1）
  if (row.role === 'admin' && row.id === 1) {
    ElMessage.error('不能删除超级管理员')
    return
  }
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '提示', { type: 'warning' })
    await deleteUser(row.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch (e) {
    // 如果是用户取消，不提示错误
    if (e !== 'cancel' && e?.message) {
      ElMessage.error(e.message || '删除失败')
    }
  }
}

const handleSave = async () => {
  try {
    // 提交前将sex转换为后端需要的格式
    const submitData = { ...form }
    if (submitData.sex === '男') submitData.sex = 1
    else if (submitData.sex === '女') submitData.sex = 2
    // 角色使用表单选择的值，不硬编码

    if (form.id) {
      await updateUser(submitData)
      ElMessage.success('修改成功')
    } else {
      await userRegister(submitData)
      ElMessage.success('新增用户成功')
    }
    dialogVisible.value = false
    fetchList()
  } catch (e) { 
    console.error(e) 
  }
}

// 格式化性别显示
const formatSex = (sex) => {
  if (sex === 1 || sex === '1') return '男'
  if (sex === 2 || sex === '2') return '女'
  return sex || '-'
}

onMounted(() => fetchList())
</script>
