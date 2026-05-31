<template>
  <div>
    <el-card>
      <template #header>
        <span>退住管理</span>
      </template>
      <el-form :model="queryForm" inline style="margin-bottom: 20px;">
        <el-form-item label="客户姓名">
          <el-input v-model="queryForm.name" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchList">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border stripe>
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="age" label="年龄" />
        <el-table-column prop="gender" label="性别" />
        <el-table-column prop="bedNo" label="床位号" />
        <el-table-column prop="checkInDate" label="入住日期" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button size="small" type="danger" @click="handleCheckOut(scope.row)">退住</el-button>
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

    <!-- 退住确认弹窗 -->
    <el-dialog v-model="dialogVisible" title="退住确认" width="500px">
      <el-form :model="backdownForm" label-width="100px">
        <el-form-item label="客户姓名">
          <span>{{ backdownForm.customerName }}</span>
        </el-form-item>
        <el-form-item label="床位号">
          <span>{{ backdownForm.bedNo }}</span>
        </el-form-item>
        <el-form-item label="入住日期">
          <el-date-picker v-model="backdownForm.checkinDate" type="date" disabled value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="退住日期">
          <el-date-picker v-model="backdownForm.backdownDate" type="date" placeholder="选择退住日期" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="退住原因">
          <el-input v-model="backdownForm.reason" type="textarea" placeholder="请输入退住原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmBackdown">确认退住</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCustomerList } from '@/api/customer'
import { applyBackdown } from '@/api/backdown'

const dialogVisible = ref(false)
const tableData = ref([])
const total = ref(0)

const queryForm = reactive({ name: '', page: 1, size: 10 })

const backdownForm = reactive({
  customerId: null,
  customerName: '',
  bedNo: '',
  checkinDate: '',
  backdownDate: '',
  reason: ''
})

const fetchList = async () => {
  try {
    const res = await getCustomerList(queryForm)
    tableData.value = (res.records || []).filter(item => item.bedNo)
    total.value = tableData.value.length
  } catch (e) { console.error(e) }
}

const resetQuery = () => {
  queryForm.name = ''
  queryForm.page = 1
  fetchList()
}

const handlePageChange = (page) => {
  queryForm.page = page
  fetchList()
}

const handleCheckOut = (row) => {
  backdownForm.customerId = row.id
  backdownForm.customerName = row.name
  backdownForm.bedNo = row.bedNo
  backdownForm.checkinDate = row.checkinDate
  backdownForm.backdownDate = ''
  backdownForm.reason = ''
  dialogVisible.value = true
}

const confirmBackdown = async () => {
  if (!backdownForm.backdownDate) {
    ElMessage.warning('请选择退住日期')
    return
  }
  try {
    await applyBackdown({
      customerId: backdownForm.customerId,
      backdownDate: backdownForm.backdownDate,
      reason: backdownForm.reason
    })
    ElMessage.success('退住办理成功')
    dialogVisible.value = false
    fetchList()
  } catch (e) { console.error(e) }
}

onMounted(() => fetchList())
</script>
