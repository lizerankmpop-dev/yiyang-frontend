<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>护理项目管理</span>
          <el-button type="primary" @click="dialogVisible = true">新增项目</el-button>
        </div>
      </template>
      
      <el-form :model="queryForm" inline style="margin-bottom: 20px;">
        <el-form-item label="项目名称">
          <el-input v-model="queryForm.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="请选择状态" clearable>
            <el-option label="启用" :value="1" />
            <el-option label="停用" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getProjectList">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="projectList" border stripe>
        <el-table-column prop="serialNumber" label="项目编号" />
        <el-table-column prop="nursingName" label="项目名称" />
        <el-table-column prop="servicePrice" label="价格" />
        <el-table-column prop="executionCycle" label="执行周期" />
        <el-table-column prop="executionTimes" label="执行次数" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" type="primary" @click="editProject(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteProject(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        style="margin-top: 20px; text-align: right;"
        :total="total"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
      />
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="新增护理项目" width="600px">
      <el-form :model="projectForm" label-width="100px">
        <el-form-item label="项目编号" prop="serialNumber">
          <el-input v-model="projectForm.serialNumber" />
        </el-form-item>
        <el-form-item label="项目名称" prop="nursingName">
          <el-input v-model="projectForm.nursingName" />
        </el-form-item>
        <el-form-item label="价格" prop="servicePrice">
          <el-input v-model="projectForm.servicePrice" />
        </el-form-item>
        <el-form-item label="执行周期" prop="executionCycle">
          <el-input v-model="projectForm.executionCycle" />
        </el-form-item>
        <el-form-item label="执行次数" prop="executionTimes">
          <el-input v-model.number="projectForm.executionTimes" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="projectForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveProject">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)

const queryForm = reactive({
  name: '',
  status: ''
})

const projectForm = reactive({
  serialNumber: '',
  nursingName: '',
  servicePrice: '',
  executionCycle: '',
  executionTimes: '',
  status: 1
})

// 模拟数据
const projectList = ref([
  { id: 1, serialNumber: 'LZ-001', nursingName: '晨间护理', servicePrice: '15元/次', executionCycle: '每天', executionTimes: 1, status: 1 },
  { id: 2, serialNumber: 'LZ-002', nursingName: '晚间护理', servicePrice: '10元/次', executionCycle: '每天', executionTimes: 1, status: 1 },
  { id: 3, serialNumber: 'YL-001', nursingName: '生命体征监测', servicePrice: '5元/次', executionCycle: '每天', executionTimes: 2, status: 1 },
  { id: 4, serialNumber: 'YL-005', nursingName: '吸氧', servicePrice: '5元/小时', executionCycle: '按需', executionTimes: 1, status: 1 }
])

const total = ref(4)

const getProjectList = () => {
  ElMessage.success('查询成功')
}

const resetQuery = () => {
  queryForm.name = ''
  queryForm.status = ''
  getProjectList()
}

const editProject = (row) => {
  Object.assign(projectForm, row)
  dialogVisible.value = true
}

const deleteProject = (row) => {
  ElMessage.confirm('确定要删除该项目吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const saveProject = () => {
  ElMessage.success('保存成功')
  dialogVisible.value = false
}
</script>