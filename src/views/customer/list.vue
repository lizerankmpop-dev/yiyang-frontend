<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>客户列表</span>
          <el-button type="primary" @click="handleAdd">新增客户</el-button>
        </div>
      </template>

      <el-form :model="queryForm" inline style="margin-bottom: 20px;">
        <el-form-item label="客户姓名">
          <el-input v-model="queryForm.name" placeholder="请输入客户姓名" clearable />
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
        <el-table-column prop="nurseLevel" label="护理级别" />
        <el-table-column prop="checkInDate" label="入住日期" :formatter="formatDate" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="margin-top: 20px; text-align: right;"
        v-model:current-page="queryForm.page"
        v-model:page-size="queryForm.size"
        :total="total"
        layout="total, prev, pager, next, jumper"
        @current-change="fetchList"
      />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="姓名" required>
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model.number="form.age" type="number" placeholder="请输入年龄" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.gender">
            <el-radio label="男" />
            <el-radio label="女" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="床位号">
          <el-select v-model="form.bedNo" placeholder="请选择空闲床位" style="width: 100%;">
            <el-option
              v-for="bed in availableBeds"
              :key="bed.id"
              :label="bed.bedNo + '（房间：' + bed.roomNo + '，楼层：' + bed.floor + '楼）'"
              :value="bed.bedNo"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="护理级别">
          <el-select v-model="form.nurseLevel" placeholder="请选择护理级别" style="width: 100%;">
            <el-option label="自理型" value="自理型" />
            <el-option label="一级护理" value="一级护理" />
            <el-option label="二级护理" value="二级护理" />
            <el-option label="三级护理" value="三级护理" />
          </el-select>
        </el-form-item>
        <el-form-item label="入住日期">
          <el-date-picker v-model="form.checkInDate" type="date" value-format="YYYY-MM-DD" placeholder="选择入住日期" style="width: 100%;" />
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
import { getCustomerList, addCustomer, updateCustomer, deleteCustomer } from '@/api/customer'
import { getAvailableBeds } from '@/api/bed'
import dayjs from 'dayjs'

const dialogVisible = ref(false)
const dialogTitle = ref('新增')
const tableData = ref([])
const total = ref(0)
const availableBeds = ref([])

const queryForm = reactive({
  name: '',
  page: 1,
  size: 10
})

const form = reactive({
  id: null,
  name: '',
  age: '',
  gender: '男',
  bedNo: '',
  nurseLevel: '',
  checkInDate: ''
})

const fetchList = async () => {
  try {
    const res = await getCustomerList(queryForm)
    tableData.value = res.records || res || []
    total.value = res.total || 0
  } catch (e) {
    console.error('获取客户列表失败：', e)
    ElMessage.error('获取数据失败')
  }
}

// 加载空闲床位列表
const fetchAvailableBeds = async () => {
  try {
    const res = await getAvailableBeds()
    availableBeds.value = res || []
  } catch (e) {
    console.error('获取空闲床位失败：', e)
    availableBeds.value = []
  }
}

const resetQuery = () => {
  queryForm.name = ''
  queryForm.page = 1
  fetchList()
}

const handleAdd = () => {
  dialogTitle.value = '新增客户'
  Object.assign(form, {
    id: null,
    name: '',
    age: '',
    gender: '男',
    bedNo: '',
    nurseLevel: '',
    checkInDate: ''
  })
  dialogVisible.value = true
  fetchAvailableBeds()
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑客户'
  Object.assign(form, row)
  dialogVisible.value = true
  fetchAvailableBeds()
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该客户吗？', '提示', { type: 'warning' })
    await deleteCustomer(row.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch (e) {
    ElMessage.info('已取消删除')
  }
}

const handleSave = async () => {
  if (!form.name) {
    ElMessage.warning('请输入客户姓名')
    return
  }
  try {
    if (form.id) {
      await updateCustomer(form)
      ElMessage.success('更新成功')
    } else {
      await addCustomer(form)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    fetchList()
  } catch (e) {
    console.error('保存失败：', e)
    // 错误消息已由 request.js 拦截器统一显示
  }
}

const formatDate = (row) => {
  return row.checkInDate ? dayjs(row.checkInDate).format('YYYY-MM-DD') : '-'
}

// 只在进入页面时加载一次
onMounted(() => {
  fetchList()
})
</script>

<style scoped></style>