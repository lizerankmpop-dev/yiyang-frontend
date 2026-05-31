<template>
  <div class="page-container">
    <div class="page-header">
      <h3>客户护理设置</h3>
      <el-button type="primary" @click="handleAdd">新增</el-button>
    </div>

    <el-table :data="tableData" border stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="客户姓名">
        <template #default="scope">
          {{ scope.row.customerName || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="护理级别">
        <template #default="scope">
          {{ scope.row.levelName || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="startDate" label="开始日期" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="客户">
          <el-select v-model="form.customerId" placeholder="请选择客户" style="width: 100%">
            <el-option v-for="c in customerList" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="护理级别">
          <el-select v-model="form.levelId" placeholder="请选择护理级别" style="width: 100%">
            <el-option v-for="l in levelList" :key="l.id" :label="l.levelName" :value="l.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker v-model="form.startDate" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/api/request'
import { getCustomerList } from '@/api/customer'
import { getNursingLevelList } from '@/api/nurse'

const tableData = ref([])
const customerList = ref([])
const levelList = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增客户护理')
const isEdit = ref(false)

const form = ref({
  id: null,
  customerId: null,
  levelId: null,
  startDate: '',
  remark: ''
})

const resetForm = () => {
  form.value = { id: null, customerId: null, levelId: null, startDate: '', remark: '' }
}

const loadData = async () => {
  try {
    const res = await request({ url: '/customer-nursing-level/list', method: 'get' })
    tableData.value = res || []
  } catch (e) { /* handled by interceptor */ }
}

const loadCustomers = async () => {
  try {
    const res = await getCustomerList({ page: 1, size: 9999 })
    customerList.value = res.records || res || []
  } catch (e) { /* handled by interceptor */ }
}

const loadLevels = async () => {
  try {
    const res = await getNursingLevelList({ page: 1, size: 9999 })
    levelList.value = res.records || res || []
  } catch (e) { /* handled by interceptor */ }
}

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增客户护理'
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑客户护理'
  form.value = { ...row }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await request({ url: '/customer-nursing-level/update', method: 'put', data: form.value })
    } else {
      await request({ url: '/customer-nursing-level/add', method: 'post', data: form.value })
    }
    ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
    dialogVisible.value = false
    loadData()
  } catch (e) { /* handled by interceptor */ }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定删除该记录？', '提示', { type: 'warning' })
    await request({ url: '/customer-nursing-level/delete', method: 'delete', params: { id: row.id } })
    ElMessage.success('删除成功')
    loadData()
  } catch (e) { /* cancelled or handled */ }
}

onMounted(() => {
  loadData()
  loadCustomers()
  loadLevels()
})
</script>

<style scoped>
.page-container { padding: 20px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
</style>
