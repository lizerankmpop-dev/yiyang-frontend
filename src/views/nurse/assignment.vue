<template>
  <div class="page-container">
    <div class="page-header">
      <h3>设置服务对象</h3>
      <el-button type="primary" @click="handleAssign">分配</el-button>
    </div>

    <el-table :data="tableData" border stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="nurseName" label="管家姓名" />
      <el-table-column prop="customerName" label="客户姓名" />
      <el-table-column prop="assignDate" label="分配日期" />
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button size="small" type="danger" @click="handleRemove(scope.row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="分配管家" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="管家">
          <el-select v-model="form.nurseId" placeholder="请选择管家" style="width: 100%">
            <el-option v-for="n in nurseList" :key="n.id" :label="n.name" :value="n.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户">
          <el-select v-model="form.customerId" placeholder="请选择客户" style="width: 100%">
            <el-option v-for="c in customerList" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
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
import { getNurseCustomerList, assignNurseCustomer } from '@/api/nurse'
import { getCustomerList } from '@/api/customer'
import request from '@/api/request'

const tableData = ref([])
const customerList = ref([])
const nurseList = ref([])
const dialogVisible = ref(false)

const form = ref({ nurseId: null, customerId: null })

const loadData = async () => {
  try {
    const res = await getNurseCustomerList()
    tableData.value = res || []
  } catch (e) { /* handled */ }
}

const loadCustomers = async () => {
  try {
    const res = await getCustomerList({ page: 1, size: 9999 })
    customerList.value = res.records || res || []
  } catch (e) { /* handled */ }
}

const loadNurses = async () => {
  try {
    const res = await request({ url: '/nurse/list', method: 'get', params: { page: 1, size: 9999 } })
    nurseList.value = res.records || res || []
  } catch (e) { /* handled */ }
}

const handleAssign = () => {
  form.value = { nurseId: null, customerId: null }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    await assignNurseCustomer(form.value)
    ElMessage.success('分配成功')
    dialogVisible.value = false
    loadData()
  } catch (e) { /* handled */ }
}

const handleRemove = async (row) => {
  try {
    await ElMessageBox.confirm('确定移除该分配？', '提示', { type: 'warning' })
    await request({ url: '/nurse-customer/' + row.id, method: 'delete' })
    ElMessage.success('移除成功')
    loadData()
  } catch (e) { /* cancelled or handled */ }
}

onMounted(() => {
  loadData()
  loadCustomers()
  loadNurses()
})
</script>

<style scoped>
.page-container { padding: 20px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
</style>
