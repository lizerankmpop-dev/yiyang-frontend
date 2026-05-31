<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>排班管理</span>
          <el-button type="primary" @click="handleAdd">新增排班</el-button>
        </div>
      </template>

      <el-form :model="queryForm" inline style="margin-bottom: 20px;">
        <el-form-item label="护士姓名">
          <el-input v-model="queryForm.keyword" placeholder="请输入护士姓名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchList">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格字段 100% 匹配数据库 -->
      <el-table :data="tableData" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="nurseName" label="护士姓名" />
        <el-table-column prop="scheduleDate" label="排班日期" />
        <el-table-column prop="shiftType" label="班次" />
        <el-table-column prop="dutyArea" label="值班区域" />
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

    <!-- 弹窗补全所有字段：姓名、日期、班次、区域、备注 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="护士姓名">
          <el-input v-model="form.nurseName" placeholder="请输入护士姓名" />
        </el-form-item>
        <el-form-item label="排班日期">
          <el-date-picker v-model="form.scheduleDate" type="date" placeholder="选择排班日期" value-format="YYYY-MM-DD" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="班次">
          <el-select v-model="form.shiftType" placeholder="请选择班次" style="width: 100%;">
            <el-option label="早班" value="早班" />
            <el-option label="中班" value="中班" />
            <el-option label="晚班" value="晚班" />
            <el-option label="夜班" value="夜班" />
          </el-select>
        </el-form-item>
        <el-form-item label="值班区域">
          <el-input v-model="form.dutyArea" placeholder="请输入值班区域" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
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
import { getScheduleList, addSchedule, updateSchedule, deleteSchedule } from '@/api/schedule'

const dialogVisible = ref(false)
const dialogTitle = ref('新增排班')
const tableData = ref([])
const total = ref(0)

// 查询条件
const queryForm = reactive({ keyword: '', page: 1, size: 10 })

// 表单 完全匹配数据库字段
const form = reactive({
  id: null,
  nurseName: '',
  scheduleDate: '',
  shiftType: '',
  dutyArea: '',
  remark: ''
})

// 获取列表
const fetchList = async () => {
  try {
    const res = await getScheduleList(queryForm)
    tableData.value = res.records || res.list || res || []
    total.value = res.total || 0
    console.log('排班数据：', tableData.value)
  } catch (e) { 
    console.error(e) 
  }
}

// 重置查询
const resetQuery = () => {
  queryForm.keyword = ''
  queryForm.page = 1
  fetchList()
}

// 分页
const handlePageChange = (page) => {
  queryForm.page = page
  fetchList()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增排班'
  // 安全重置表单
  Object.assign(form, {
    id: null,
    nurseName: '',
    scheduleDate: '',
    shiftType: '',
    dutyArea: '',
    remark: ''
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑排班'
  Object.assign(form, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该排班记录吗？', '提示', { type: 'warning' })
    .then(async () => {
      await deleteSchedule(row.id)
      ElMessage.success('删除成功')
      fetchList()
    }).catch(() => {})
}

// 保存
const handleSave = async () => {
  try {
    if (form.id) {
      await updateSchedule(form)
      ElMessage.success('更新成功')
    } else {
      await addSchedule(form)
      ElMessage.success('保存成功')
    }
    dialogVisible.value = false
    fetchList()
  } catch (e) { 
    console.error(e) 
  }
}

onMounted(() => fetchList())
</script>