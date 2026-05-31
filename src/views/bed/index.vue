<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>床位管理</span>
          <el-button type="success" @click="handleAdd">新增床位</el-button>
          <el-button type="danger" style="margin-left: 10px;" @click="handleBatchDelete">批量删除({{ selectedIds.length }})</el-button>
        </div>
      </template>
      
      <!-- 查询表单 -->
      <el-form :model="queryForm" inline style="margin-bottom: 20px;">
        <el-form-item label="床位号">
          <el-input v-model="queryForm.bedNo" placeholder="请输入床位号" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="请选择状态" clearable>
            <el-option label="空闲" :value="0" />
            <el-option label="占用" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchList">搜索</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 数据表格 -->
      <el-table 
        :data="tableData" 
        border 
        stripe 
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="bedNo" label="床位号" />
        <el-table-column prop="roomNo" label="房间号" />
        <el-table-column prop="floor" label="楼层" />
        <el-table-column 
          prop="status" 
          label="状态"
          :formatter="formatStatus"
        />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页组件 -->
      <el-pagination
        style="margin-top: 20px; text-align: right;"
        v-model:current-page="queryForm.page"
        v-model:page-size="queryForm.size"
        :total="total"
        layout="total, prev, pager, next, jumper"
        @current-change="fetchList"
      />
    </el-card>
    
    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="床位号" required>
          <el-input v-model="form.bedNo" placeholder="请输入床位号" />
        </el-form-item>
        <el-form-item label="房间号" required>
          <el-input v-model.number="form.roomNo" type="number" placeholder="请输入房间号" />
        </el-form-item>
        <el-form-item label="楼层" required>
          <el-input v-model.number="form.floor" type="number" placeholder="请输入楼层" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">空闲</el-radio>
            <el-radio :label="1">占用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" placeholder="请输入备注" type="textarea" />
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
import { getBedList, addBed, updateBed, deleteBed } from '@/api/bed'

// 弹窗状态
const dialogVisible = ref(false)
const dialogTitle = ref('新增床位')

// 表格数据
const tableData = ref([])
const total = ref(0)
const selectedIds = ref([])

// 查询条件
const queryForm = reactive({ 
  bedNo: '', 
  status: null,
  page: 1, 
  size: 10 
})

// 表单数据
const form = reactive({
  id: null,
  bedNo: '',
  roomNo: '',
  floor: '',
  status: 0,
  remark: ''
})

// ==================== 数据请求 ====================
const fetchList = async () => {
  try {
    const res = await getBedList(queryForm)
    tableData.value = res.records || res || []
    total.value = res.total || 0
  } catch (e) { 
    console.error('获取床位列表失败：', e)
    ElMessage.error('获取数据失败，请检查接口是否正常')
  }
}

// ==================== 表单操作 ====================
// 重置查询
const resetQuery = () => {
  queryForm.bedNo = ''
  queryForm.status = null
  queryForm.page = 1
  fetchList()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增床位'
  // 重置表单
  Object.assign(form, {
    id: null,
    bedNo: '',
    roomNo: '',
    floor: '',
    status: 0,
    remark: ''
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑床位'
  Object.assign(form, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该床位吗？', '提示', { type: 'warning' })
    await deleteBed(row.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch (e) {
    ElMessage.info('已取消删除')
  }
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的床位')
    return
  }
  try {
    await ElMessageBox.confirm('确定要删除选中的床位吗？', '提示', { type: 'warning' })
    // 批量删除接口（如果后端没有批量删除，循环调用删除接口）
    for (const id of selectedIds.value) {
      await deleteBed(id)
    }
    ElMessage.success('批量删除成功')
    selectedIds.value = []
    fetchList()
  } catch (e) {
    ElMessage.info('已取消删除')
  }
}

// 保存
const handleSave = async () => {
  if (!form.bedNo) {
    ElMessage.warning('请输入床位号')
    return
  }
  try {
    if (form.id) {
      await updateBed(form)
      ElMessage.success('更新成功')
    } else {
      await addBed(form)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    fetchList()
  } catch (e) {
    console.error('保存失败：', e)
    ElMessage.error('操作失败')
  }
}

// 选择数据
const handleSelectionChange = (val) => {
  selectedIds.value = val.map(item => item.id)
}

// ==================== 工具方法 ====================
// 状态格式化
const formatStatus = (row) => {
  return row.status === 0 ? '空闲' : '占用'
}

// 初始化
onMounted(() => {
  fetchList()
})
</script>

<style scoped>
/* 可选：自定义样式 */
</style>