<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>外出管理</span>
          <el-button type="primary" @click="handleAdd">新增外出</el-button>
        </div>
      </template>

      <el-form :model="queryForm" inline style="margin-bottom: 20px;">
        <el-form-item label="客户姓名">
          <el-input v-model="queryForm.keyword" placeholder="请输入关键词" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchList">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border stripe>
        <el-table-column label="客户姓名">
          <template #default="scope">
            {{ scope.row.customerName || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="goOutDate" label="外出日期" />
        <el-table-column prop="expectedReturnDate" label="预计返回日期" />
        <el-table-column prop="actualReturnDate" label="实际返回日期" />
        <el-table-column prop="reason" label="外出原因" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'warning' : scope.row.status === 1 ? 'primary' : 'success'">
              {{ scope.row.status === 0 ? '待审核' : scope.row.status === 1 ? '已通过' : '已返回' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.status === 0" size="small" type="success" @click="handleAudit(scope.row, 1)">通过</el-button>
            <el-button v-if="scope.row.status === 1" size="small" type="warning" @click="handleReturn(scope.row)">返回</el-button>
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
        <el-form-item label="客户姓名">
          <el-input v-model="form.customerName" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="外出日期">
          <el-date-picker v-model="form.goOutDate" type="date" placeholder="选择外出日期" value-format="YYYY-MM-DD" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="预计返回日期">
          <el-date-picker v-model="form.expectedReturnDate" type="date" placeholder="选择预计返回日期" value-format="YYYY-MM-DD" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="外出原因">
          <el-input v-model="form.reason" type="textarea" placeholder="请输入外出原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>

    <!-- 返回登记弹窗 -->
    <el-dialog v-model="returnDialogVisible" title="返回登记" width="400px">
      <el-form :model="returnForm" label-width="100px">
        <el-form-item label="客户姓名">
          <span>{{ returnForm.customerName }}</span>
        </el-form-item>
        <el-form-item label="实际返回日期">
          <el-date-picker v-model="returnForm.actualReturnDate" type="date" placeholder="选择实际返回日期" value-format="YYYY-MM-DD" style="width: 100%;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="returnDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmReturn">确认返回</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOutwardList, applyOutward, auditOutward, returnOutward } from '@/api/outward'

const dialogVisible = ref(false)
const dialogTitle = ref('新增')
const returnDialogVisible = ref(false)
const tableData = ref([])
const total = ref(0)

const queryForm = reactive({ keyword: '', page: 1, size: 10 })
const form = reactive({
  id: null,
  customerName: '',
  goOutDate: '',
  expectedReturnDate: '',
  reason: ''
})

const returnForm = reactive({
  id: null,
  customerName: '',
  actualReturnDate: ''
})

const fetchList = async () => {
  try {
    const res = await getOutwardList(queryForm)
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

const handleAudit = (row, status) => {
  ElMessageBox.confirm('确定要通过此外出申请吗？', '提示', { type: 'warning' })
    .then(async () => {
      await auditOutward(row.id, { status })
      ElMessage.success('审核通过')
      fetchList()
    }).catch(() => {})
}

const handleReturn = (row) => {
  returnForm.id = row.id
  returnForm.customerName = row.customerName
  returnForm.actualReturnDate = ''
  returnDialogVisible.value = true
}

const confirmReturn = async () => {
  if (!returnForm.actualReturnDate) {
    ElMessage.warning('请选择实际返回日期')
    return
  }
  try {
    await returnOutward(returnForm.id, { actualReturnDate: returnForm.actualReturnDate })
    ElMessage.success('返回登记成功')
    returnDialogVisible.value = false
    fetchList()
  } catch (e) { console.error(e) }
}

const handleSave = async () => {
  try {
    if (form.id) {
      ElMessage.info('请使用审核功能处理')
    } else {
      await applyOutward(form)
      ElMessage.success('保存成功')
    }
    dialogVisible.value = false
    fetchList()
  } catch (e) { console.error(e) }
}

onMounted(() => fetchList())
</script>
