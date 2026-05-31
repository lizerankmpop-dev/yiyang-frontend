<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>护理级别管理</span>
          <el-button type="primary" @click="dialogVisible = true">新增级别</el-button>
        </div>
      </template>
      
      <el-table :data="levelList" border stripe>
        <el-table-column prop="levelName" label="级别名称" />
        <el-table-column prop="levelStatus" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.levelStatus === 1 ? 'success' : 'danger'">
              {{ scope.row.levelStatus === 1 ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button size="small" type="primary" @click="editLevel(scope.row)">编辑</el-button>
            <el-button size="small" @click="configProject(scope.row)">配置项目</el-button>
            <el-button size="small" :type="scope.row.levelStatus === 1 ? 'warning' : 'success'" @click="toggleStatus(scope.row)">
              {{ scope.row.levelStatus === 1 ? '停用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="新增护理级别" width="500px">
      <el-form :model="levelForm" label-width="100px">
        <el-form-item label="级别名称" prop="levelName">
          <el-input v-model="levelForm.levelName" />
        </el-form-item>
        <el-form-item label="状态" prop="levelStatus">
          <el-radio-group v-model="levelForm.levelStatus">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveLevel">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)

const levelForm = reactive({
  levelName: '',
  levelStatus: 1
})

// 模拟数据
const levelList = ref([
  { id: 1, levelName: '自理型', levelStatus: 1 },
  { id: 2, levelName: '一级护理', levelStatus: 1 },
  { id: 3, levelName: '二级护理', levelStatus: 1 },
  { id: 4, levelName: '三级护理', levelStatus: 1 }
])

const editLevel = (row) => {
  Object.assign(levelForm, row)
  dialogVisible.value = true
}

const configProject = (row) => {
  ElMessage.info('配置护理项目功能')
}

const toggleStatus = (row) => {
  row.levelStatus = row.levelStatus === 1 ? 2 : 1
  ElMessage.success('状态修改成功')
}

const saveLevel = () => {
  ElMessage.success('保存成功')
  dialogVisible.value = false
}
</script>