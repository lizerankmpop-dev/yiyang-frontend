<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>退住记录</span>
          <el-button type="primary" @click="handleAdd">新增</el-button>
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
        <el-table-column prop="customerName" label="客户姓名" />
        <el-table-column prop="checkOutDate" label="退住日期" />
        <el-table-column prop="reason" label="退住原因" />
        <el-table-column prop="status" label="审核状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : scope.row.status === 0 ? 'warning' : 'danger'">
              {{ scope.row.status === 1 ? '已通过' : scope.row.status === 0 ? '待审核' : '已驳回' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.status === 0" size="small" type="success" @click="handleAudit(scope.row, 1)">通过</el-button>
            <el-button v-if="scope.row.status === 0" size="small" type="danger" @click="handleAudit(scope.row, 2)">驳回</el-button>
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
        <el-form-item label="退住日期">
          <el-date-picker v-model="form.checkOutDate" type="date" placeholder="选择退住日期" value-format="YYYY-MM-DD" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="退住原因">
          <el-input v-model="form.reason" type="textarea" placeholder="请输入退住原因" />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="form.status" placeholder="请选择审核状态" style="width: 100%;">
            <el-option label="待审核" :value="0" />
            <el-option label="已通过" :value="1" />
            <el-option label="已驳回" :value="2" />
          </el-select>
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
import { getBackdownList, applyBackdown, auditBackdown } from '@/api/backdown'

const dialogVisible = ref(false)
const dialogTitle = ref('新增')
const tableData = ref([])
const total = ref(0)

const queryForm = reactive({ keyword: '', page: 1, size: 10 })
const form = reactive({
  id: null,
  customerName: '',
  checkOutDate: '',
  reason: '',
  status: 0
})

const fetchList = async () => {
  try {
    const res = await getBackdownList(queryForm)
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
  Object.keys(form).forEach(k => form[k] = k === 'status' ? 0 : null)
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleAudit = (row, status) => {
  const statusText = status === 1 ? '通过' : '驳回'
  ElMessageBox.confirm(`确定要${statusText}此退住申请吗？`, '提示', { type: 'warning' })
    .then(async () => {
      await auditBackdown(row.id, { status })
      ElMessage.success('审核完成')
      fetchList()
    }).catch(() => {})
}

const handleSave = async () => {
  try {
    if (form.id) {
      await ElMessage.info('暂不支持编辑，请使用审核功能')
    } else {
      await applyBackdown(form)
      ElMessage.success('保存成功')
    }
    dialogVisible.value = false
    fetchList()
  } catch (e) { console.error(e) }
}

onMounted(() => fetchList())
</script>
