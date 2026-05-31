<template>
  <div>
    <el-card>
      <template #header>
        <span>护理任务</span>
      </template>

      <el-form :model="queryForm" inline style="margin-bottom: 20px;">
        <el-form-item label="任务状态">
          <el-select v-model="queryForm.status" placeholder="请选择状态" clearable style="width: 150px;">
            <el-option label="待执行" :value="0" />
            <el-option label="已完成" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchList">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border stripe>
        <el-table-column prop="customerName" label="客户姓名" />
        <el-table-column label="任务名称">
        <template #default="scope">
          {{ scope.row.taskName || scope.row.itemName || '-' }}
        </template>
      </el-table-column>
        <el-table-column prop="taskDate" label="任务日期" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'warning'">
              {{ scope.row.status === 1 ? '已完成' : '待执行' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button
              v-if="scope.row.status !== 1"
              size="small"
              type="success"
              @click="handleComplete(scope.row)"
            >标记完成</el-button>
            <span v-else style="color: #67c23a;">已完成</span>
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
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getNursingTaskList, updateTaskStatus } from '@/api/nurse'

const tableData = ref([])
const total = ref(0)

const queryForm = reactive({ status: '', page: 1, size: 10 })

const fetchList = async () => {
  try {
    const params = { ...queryForm }
    if (params.status === '') delete params.status
    // 不传 nurseId，让后端返回所有任务
    const res = await getNursingTaskList(params)
    // 兼容处理：后端返回字符串状态，前端需要数字状态用于筛选和标签显示
    const list = (res || []).map(item => ({
      ...item,
      // 如果后端返回字符串状态，转换为数字
      status: item.status === '已完成' ? 1 : 0
    }))
    // 状态筛选（前端筛选，因为后端返回的是当日所有任务）
    if (params.status !== undefined && params.status !== '') {
      tableData.value = list.filter(item => item.status === params.status)
    } else {
      tableData.value = list
    }
    total.value = tableData.value.length || 0
  } catch (e) { console.error(e) }
}

const resetQuery = () => {
  queryForm.status = ''
  queryForm.page = 1
  fetchList()
}

const handlePageChange = (page) => {
  queryForm.page = page
  fetchList()
}

const handleComplete = (row) => {
  ElMessageBox.confirm('确定标记此任务为已完成吗？', '提示', { type: 'warning' })
    .then(async () => {
      await updateTaskStatus({ id: row.id, status: 1 })
      ElMessage.success('标记完成')
      fetchList()
    }).catch(() => {})
}

onMounted(() => fetchList())
</script>
