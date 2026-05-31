<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>用户管理</span>
          <el-button type="primary" @click="dialogVisible = true">新增用户</el-button>
        </div>
      </template>
      
      <el-table :data="userList" border stripe>
        <el-table-column prop="nickname" label="真实姓名" />
        <el-table-column prop="username" label="系统账号" />
        <el-table-column prop="sex" label="性别" />
        <el-table-column prop="phoneNumber" label="电话号码" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="roleName" label="角色" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" type="primary" @click="editUser(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteUser(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="新增用户" width="600px">
      <el-form :model="userForm" label-width="100px">
        <el-form-item label="真实姓名" prop="nickname">
          <el-input v-model="userForm.nickname" />
        </el-form-item>
        <el-form-item label="系统账号" prop="username">
          <el-input v-model="userForm.username" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="userForm.sex">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话号码" prop="phoneNumber">
          <el-input v-model="userForm.phoneNumber" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="userForm.roleId" placeholder="请选择角色">
            <el-option label="系统管理员" :value="1" />
            <el-option label="健康管家" :value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUser">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)

const userForm = reactive({
  nickname: '',
  username: '',
  sex: 1,
  phoneNumber: '',
  email: '',
  roleId: ''
})

// 模拟数据
const userList = ref([
  { id: 1, nickname: '系统管理员', username: 'admin', sex: '男', phoneNumber: '13800138000', email: 'admin@neusoft.com', roleName: '系统管理员' },
  { id: 2, nickname: '吴伟', username: 'wuwei', sex: '女', phoneNumber: '13517178987', email: 'wuwei@neusoft.com', roleName: '健康管家' },
  { id: 3, nickname: '陈小明', username: 'chenxiaoming', sex: '男', phoneNumber: '18767890987', email: 'chenxiaoming@neusoft.com', roleName: '健康管家' }
])

const editUser = (row) => {
  Object.assign(userForm, row)
  dialogVisible.value = true
}

const deleteUser = (row) => {
  ElMessage.confirm('确定要删除该用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const saveUser = () => {
  ElMessage.success('保存成功')
  dialogVisible.value = false
}
</script>