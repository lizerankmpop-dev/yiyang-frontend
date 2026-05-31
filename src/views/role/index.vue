<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>角色管理</span>
          <el-button type="primary" @click="handleAdd">新增角色</el-button>
        </div>
      </template>

      <el-form :model="queryForm" inline style="margin-bottom: 20px;">
        <el-form-item label="角色名称">
          <el-input v-model="queryForm.keyword" placeholder="请输入关键词" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchList">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border stripe>
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="roleKey" label="角色编码" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="success" @click="handleAssignMenu(scope.row)">分配权限</el-button>
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="form.roleKey" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" placeholder="请输入描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>

    <!-- 分配权限弹窗 -->
    <el-dialog v-model="menuDialogVisible" title="分配权限" width="400px">
      <el-tree
        ref="menuTreeRef"
        :data="menuList"
        show-checkbox
        node-key="id"
        :props="{ label: 'menuName', children: 'children' }"
        :default-checked-keys="checkedMenuIds"
      />
      <template #footer>
        <el-button @click="menuDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveMenuAssign">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getRoleList, addRole, updateRole, deleteRole, getRoleMenus, assignMenus, getMenuList } from '@/api/role'

const dialogVisible = ref(false)
const dialogTitle = ref('新增')
const menuDialogVisible = ref(false)
const menuTreeRef = ref(null)
const tableData = ref([])
const total = ref(0)
const menuList = ref([])
const checkedMenuIds = ref([])
const currentRoleId = ref(null)

const queryForm = reactive({ keyword: '', page: 1, size: 10 })
const form = reactive({
  id: null,
  roleName: '',
  roleKey: '',
  description: ''
})

const fetchList = async () => {
  try {
    const res = await getRoleList(queryForm)
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

const handleEdit = (row) => {
  dialogTitle.value = '编辑'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该角色吗？', '提示', { type: 'warning' })
    .then(async () => {
      await deleteRole(row.id)
      ElMessage.success('删除成功')
      fetchList()
    }).catch(() => {})
}

const handleAssignMenu = async (row) => {
  currentRoleId.value = row.id
  try {
    const [menus, roleMenus] = await Promise.all([
      getMenuList(),
      getRoleMenus(row.id)
    ])
    // 将扁平菜单列表转换为树形结构
    const flatMenus = menus || []
    menuList.value = buildMenuTree(flatMenus)
    checkedMenuIds.value = (roleMenus || []).map(m => m.id)
    menuDialogVisible.value = true
  } catch (e) { console.error(e) }
}

// 将扁平菜单列表转换为树形结构
const buildMenuTree = (menus) => {
  const menuMap = {}
  const tree = []
  menus.forEach(menu => {
    menu.children = []
    menuMap[menu.id] = menu
  })
  menus.forEach(menu => {
    if (menu.parentId && menu.parentId !== 0 && menuMap[menu.parentId]) {
      menuMap[menu.parentId].children.push(menu)
    } else {
      tree.push(menu)
    }
  })
  return tree
}

const saveMenuAssign = async () => {
  const checkedKeys = menuTreeRef.value.getCheckedKeys()
  const halfCheckedKeys = menuTreeRef.value.getHalfCheckedKeys()
  await assignMenus(currentRoleId.value, [...checkedKeys, ...halfCheckedKeys])
  ElMessage.success('权限分配成功')
  menuDialogVisible.value = false
}

const handleSave = async () => {
  try {
    if (form.id) {
      await updateRole(form)
      ElMessage.success('更新成功')
    } else {
      await addRole(form)
      ElMessage.success('保存成功')
    }
    dialogVisible.value = false
    fetchList()
  } catch (e) { console.error(e) }
}

onMounted(() => fetchList())
</script>
