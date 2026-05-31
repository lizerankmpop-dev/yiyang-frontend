<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>膳食管理</span>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </div>
      </template>

      <el-form :model="queryForm" inline style="margin-bottom: 20px;">
        <el-form-item label="餐别">
          <el-input v-model="queryForm.mealType" placeholder="请输入餐别" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchList">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border stripe>
        <el-table-column label="ID" prop="id" width="80" />
        <el-table-column label="餐别" prop="mealType" />
        <el-table-column label="膳食日期" prop="mealDate" />
        <el-table-column label="膳食描述" prop="description" />
        <el-table-column label="状态" prop="status" :formatter="formatStatus" />
        <el-table-column label="创建时间" prop="createTime" width="180" />
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
        <el-form-item label="餐别">
          <el-select v-model="form.mealType" placeholder="请选择餐别" style="width: 100%;">
            <el-option label="早餐" value="早餐" />
            <el-option label="午餐" value="午餐" />
            <el-option label="晚餐" value="晚餐" />
            <el-option label="加餐" value="加餐" />
          </el-select>
        </el-form-item>

        <el-form-item label="膳食日期">
          <el-date-picker v-model="form.mealDate" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width:100%" />
        </el-form-item>

        <el-form-item label="膳食描述">
          <el-input v-model="form.description" type="textarea" rows="3" placeholder="请输入膳食内容" />
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%;">
            <el-option label="正常" :value="1" />
            <el-option label="停用" :value="0" />
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
import { getMealList, addMeal, updateMeal, deleteMeal } from '@/api/meal'

const dialogVisible = ref(false)
const dialogTitle = ref('新增')
const tableData = ref([])
const total = ref(0)

const queryForm = reactive({
  mealType: '',
  page: 1,
  size: 10
})

const form = reactive({
  id: null,
  mealType: '',
  mealDate: '',
  description: '',
  status: 1
})

const formatStatus = (row) => {
  return row.status === 1 ? '正常' : '停用'
}

const fetchList = async () => {
  try {
    const res = await getMealList(queryForm)
    tableData.value = res.records || res.list || res || []
    total.value = res.total || 0
    console.log('接口返回数据：', tableData.value)
  } catch (e) {
    console.error('请求错误：', e)
  }
}

const resetQuery = () => {
  queryForm.mealType = ''
  queryForm.page = 1
  fetchList()
}

const handlePageChange = (page) => {
  queryForm.page = page
  fetchList()
}

const handleAdd = () => {
  dialogTitle.value = '新增膳食'
  Object.assign(form, {
    id: null,
    mealType: '',
    mealDate: '',
    description: '',
    status: 1
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑膳食'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定删除该膳食数据？', '提示', { type: 'warning' })
  .then(async () => {
    await deleteMeal(row.id)
    ElMessage.success('删除成功')
    fetchList()
  }).catch(() => {})
}

const handleSave = async () => {
  try {
    if (form.id) {
      await updateMeal(form)
      ElMessage.success('编辑成功')
    } else {
      await addMeal(form)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    fetchList()
  } catch (e) {
    console.error('保存失败：', e)
  }
}

onMounted(() => {
  fetchList()
})
</script>