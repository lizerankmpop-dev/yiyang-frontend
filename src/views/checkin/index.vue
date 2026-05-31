<template>
  <div>
    <!-- 入住登记 -->
    <el-card style="margin-bottom: 20px;">
      <template #header>
        <span>入住登记</span>
      </template>
      <el-form :model="checkinForm" inline>
        <el-form-item label="选择客户">
          <el-select v-model="checkinForm.customerId" placeholder="请选择客户" filterable style="width: 200px;">
            <el-option v-for="c in customerList" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择床位">
          <el-select v-model="checkinForm.bedId" placeholder="请选择床位" style="width: 200px;">
            <el-option v-for="b in availableBeds" :key="b.id" :label="'床位 ' + b.bedNo" :value="b.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="入住日期">
          <el-date-picker v-model="checkinForm.checkinDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleCheckIn">办理入住</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 已入住记录 -->
    <el-card>
      <template #header>
        <span>已入住记录</span>
      </template>
      <el-form :model="queryForm" inline style="margin-bottom: 20px;">
        <el-form-item label="客户姓名">
          <el-input v-model="queryForm.name" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchCheckedInList">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border stripe>
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="age" label="年龄" />
        <el-table-column prop="gender" label="性别" />
        <el-table-column prop="bedNo" label="床位号" />
        <el-table-column prop="checkInDate" label="入住日期" />
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
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { checkIn, getAvailableBeds } from '@/api/checkin'
import { getCustomerList } from '@/api/customer'

const customerList = ref([])
const availableBeds = ref([])
const tableData = ref([])
const total = ref(0)

const checkinForm = reactive({
  customerId: null,
  bedId: null,
  checkinDate: ''
})

const queryForm = reactive({ name: '', page: 1, size: 10 })

const loadCustomerList = async () => {
  try {
    const res = await getCustomerList({ size: 999 })
    customerList.value = res.records || []
  } catch (e) { console.error(e) }
}

const loadAvailableBeds = async () => {
  try {
    const res = await getAvailableBeds()
    availableBeds.value = res || []
  } catch (e) { console.error(e) }
}

const fetchCheckedInList = async () => {
  try {
    const params = { ...queryForm, status: 'checked_in' }
    const res = await getCustomerList(params)
    tableData.value = (res.records || []).filter(item => item.bedNo)
    total.value = res.total || 0
  } catch (e) { console.error(e) }
}

const resetQuery = () => {
  queryForm.name = ''
  queryForm.page = 1
  fetchCheckedInList()
}

const handlePageChange = (page) => {
  queryForm.page = page
  fetchCheckedInList()
}

const handleCheckIn = async () => {
  if (!checkinForm.customerId || !checkinForm.bedId || !checkinForm.checkinDate) {
    ElMessage.warning('请填写完整信息')
    return
  }
  try {
    await checkIn(checkinForm)
    ElMessage.success('入住办理成功')
    checkinForm.customerId = null
    checkinForm.bedId = null
    checkinForm.checkinDate = ''
    loadAvailableBeds()
    fetchCheckedInList()
  } catch (e) { console.error(e) }
}

onMounted(() => {
  loadCustomerList()
  loadAvailableBeds()
  fetchCheckedInList()
})
</script>
