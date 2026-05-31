<template>
  <div class="page-container">
    <div class="page-header">
      <h3>服务关注</h3>
      <el-button type="primary" @click="handleBuy">购买</el-button>
    </div>

    <el-table :data="tableData" border stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="customerName" label="客户姓名" />
      <el-table-column prop="itemName" label="护理项目" />
      <el-table-column prop="startDate" label="开始日期" />
      <el-table-column prop="endDate" label="到期日期" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" type="warning" @click="handleRenew(scope.row)">续费</el-button>
          <el-button size="small" type="danger" @click="handleRemove(scope.row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 购买对话框 -->
    <el-dialog v-model="buyDialogVisible" title="购买护理项目" width="500px">
      <el-form :model="buyForm" label-width="100px">
        <el-form-item label="客户">
          <el-select v-model="buyForm.customerId" placeholder="请选择客户" style="width: 100%">
            <el-option v-for="c in customerList" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="护理项目">
          <el-select v-model="buyForm.itemId" placeholder="请选择护理项目" style="width: 100%">
            <el-option v-for="i in nurseItemList" :key="i.id" :label="i.itemName" :value="i.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="buyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitBuy">确定</el-button>
      </template>
    </el-dialog>

    <!-- 续费对话框 -->
    <el-dialog v-model="renewDialogVisible" title="续费" width="500px">
      <el-form :model="renewForm" label-width="100px">
        <el-form-item label="续费天数">
          <el-input-number v-model="renewForm.days" :min="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="renewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRenew">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCustomerNurseItemList, buyNurseItem, renewNurseItem, removeNurseItem } from '@/api/service'
import { getCustomerList } from '@/api/customer'
import { getNurseItemList } from '@/api/nurse'

const tableData = ref([])
const customerList = ref([])
const nurseItemList = ref([])

const buyDialogVisible = ref(false)
const renewDialogVisible = ref(false)

const buyForm = ref({ customerId: null, itemId: null })
const renewForm = ref({ id: null, days: 30 })

const loadData = async () => {
  try {
    const res = await getCustomerNurseItemList({ page: 1, size: 9999 })
    tableData.value = res.records || res || []
  } catch (e) { /* handled */ }
}

const loadCustomers = async () => {
  try {
    customerList.value = await getCustomerList()
  } catch (e) { /* handled */ }
}

const loadNurseItems = async () => {
  try {
    nurseItemList.value = await getNurseItemList()
  } catch (e) { /* handled */ }
}

const handleBuy = () => {
  buyForm.value = { customerId: null, itemId: null }
  buyDialogVisible.value = true
}

const submitBuy = async () => {
  try {
    await buyNurseItem(buyForm.value)
    ElMessage.success('购买成功')
    buyDialogVisible.value = false
    loadData()
  } catch (e) { /* handled */ }
}

const handleRenew = (row) => {
  renewForm.value = { id: row.id, days: 30 }
  renewDialogVisible.value = true
}

const submitRenew = async () => {
  try {
    await renewNurseItem(renewForm.value.id, { days: renewForm.value.days })
    ElMessage.success('续费成功')
    renewDialogVisible.value = false
    loadData()
  } catch (e) { /* handled */ }
}

const handleRemove = async (row) => {
  try {
    await ElMessageBox.confirm('确定移除该护理项目？', '提示', { type: 'warning' })
    await removeNurseItem(row.id)
    ElMessage.success('移除成功')
    loadData()
  } catch (e) { /* cancelled or handled */ }
}

onMounted(() => {
  loadData()
  loadCustomers()
  loadNurseItems()
})
</script>

<style scoped>
.page-container { padding: 20px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
</style>
