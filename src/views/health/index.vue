<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>健康档案</span>
          <el-button type="primary" @click="handleAdd">新增记录</el-button>
        </div>
      </template>

      <el-form :model="queryForm" inline style="margin-bottom: 20px;">
        <el-form-item label="客户姓名">
          <el-input v-model="queryForm.keyword" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchList">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border stripe>
        <el-table-column prop="customerName" label="客户姓名" />
        <el-table-column prop="systolicPressure" label="收缩压" />
        <el-table-column prop="diastolicPressure" label="舒张压" />
        <el-table-column prop="bloodSugar" label="血糖" />
        <el-table-column prop="measureTime" label="测量时间" />
        <el-table-column prop="remark" label="备注" />
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
        <el-form-item label="客户">
          <el-select v-model="form.customerId" placeholder="请选择客户" style="width: 100%;">
            <el-option v-for="c in customerList" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="收缩压">
          <el-input v-model.number="form.systolicPressure" placeholder="请输入收缩压" />
        </el-form-item>
        <el-form-item label="舒张压">
          <el-input v-model.number="form.diastolicPressure" placeholder="请输入舒张压" />
        </el-form-item>
        <el-form-item label="血糖">
          <el-input v-model.number="form.bloodSugar" placeholder="请输入血糖" />
        </el-form-item>
        <el-form-item label="测量时间">
          <el-date-picker v-model="form.measureTime" type="datetime" placeholder="选择测量时间" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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
import { reactive, ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getHealthRecordList, addHealthRecord, updateHealthRecord, deleteHealthRecord } from '@/api/health'
import { getCustomerList } from '@/api/customer'

const dialogVisible = ref(false)
const dialogTitle = ref('新增')
const tableData = ref([])
const total = ref(0)
const customerList = ref([])

// 客户ID映射表
const customerMap = computed(() => {
  const map = {}
  customerList.value.forEach(c => { map[c.id] = c.name })
  return map
})

const queryForm = reactive({ keyword: '', page: 1, size: 10 })
const form = reactive({
  id: null,
  customerId: null,
  systolicPressure: null,
  diastolicPressure: null,
  bloodSugar: null,
  measureTime: '',
  remark: ''
})

const fetchList = async () => {
  try {
    const res = await getHealthRecordList({ page: queryForm.page, size: queryForm.size })
    const list = Array.isArray(res) ? res : (res.records || [])
    // 映射客户姓名
    tableData.value = list.map(item => ({
      ...item,
      customerName: customerMap.value[item.customerId] || ('客户' + item.customerId)
    }))
    total.value = Array.isArray(res) ? res.length : (res.total || 0)
  } catch (e) {
    console.error('健康档案加载失败：', e)
    ElMessage.error('数据加载失败')
  }
}

const loadCustomers = async () => {
  try {
    const res = await getCustomerList({ page: 1, size: 9999 })
    customerList.value = res.records || res || []
  } catch (e) {
    console.error('客户列表加载失败：', e)
  }
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
  form.id = null
  form.customerId = null
  form.systolicPressure = null
  form.diastolicPressure = null
  form.bloodSugar = null
  form.measureTime = ''
  form.remark = ''
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定删除该健康记录吗？', '提示', { type: 'warning' })
    await deleteHealthRecord(row.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch (e) {
    if (e !== 'cancel') {
      console.error('删除失败：', e)
      ElMessage.error('删除失败')
    }
  }
}

const handleSave = async () => {
  try {
    if (!form.customerId) {
      ElMessage.warning('请选择客户')
      return
    }
    if (form.id) {
      await updateHealthRecord(form)
      ElMessage.success('更新成功')
    } else {
      await addHealthRecord(form)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    fetchList()
  } catch (e) {
    console.error('保存失败：', e)
    ElMessage.error('保存失败')
  }
}

onMounted(async () => {
  await loadCustomers()
  fetchList()
})
</script>
