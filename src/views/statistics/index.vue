<template>
  <div>
    <el-row :gutter="20" style="margin-bottom: 20px;">
      <el-col :span="6">
        <el-card>
          <el-statistic title="总客户数" :value="overview.totalCustomers || 0" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="总床位数" :value="overview.totalBeds || 0" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="护士总数" :value="overview.totalNurses || 0" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="入住率" :value="overview.occupancyRate || 0" suffix="%" :precision="1" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-bottom: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>床位统计</span>
          </template>
          <el-row>
            <el-col :span="8">
              <el-statistic title="空闲床位" :value="bedStats.available || 0" />
            </el-col>
            <el-col :span="8">
              <el-statistic title="已占用" :value="bedStats.occupied || 0" />
            </el-col>
            <el-col :span="8">
              <el-statistic title="外出" :value="bedStats.outward || 0" />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>性别分布</span>
          </template>
          <el-row>
            <el-col :span="12">
              <el-statistic title="男性" :value="genderStats.male || 0" />
            </el-col>
            <el-col :span="12">
              <el-statistic title="女性" :value="genderStats.female || 0" />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getOverview, getBedStats, getGenderDistribution } from '@/api/statistics'

const overview = reactive({
  totalCustomers: 0,
  totalBeds: 0,
  totalNurses: 0,
  occupancyRate: 0
})

const bedStats = reactive({
  available: 0,
  occupied: 0,
  outward: 0
})

const genderStats = reactive({
  male: 0,
  female: 0
})

onMounted(async () => {
  try {
    const [ov, bs, gd] = await Promise.all([
      getOverview(),
      getBedStats(),
      getGenderDistribution()
    ])
    // 概览数据
    if (ov) {
      overview.totalCustomers = ov.totalCustomers || 0
      overview.totalBeds = ov.totalBeds || 0
      overview.totalNurses = ov.totalNurses || 0
      overview.occupancyRate = ov.occupancyRate || 0
    }
    // 床位统计（兼容后端返回的字段名）
    if (bs) {
      bedStats.available = bs.availableBeds || bs.available || 0
      bedStats.occupied = bs.occupiedBeds || bs.occupied || 0
      bedStats.outward = bs.outward || 0
    }
    // 性别分布后端返回 List<Map> 格式: [{name:'男',value:10},{name:'女',value:8}]
    if (gd && Array.isArray(gd)) {
      genderStats.male = 0
      genderStats.female = 0
      gd.forEach(item => {
        if (item.name === '男') genderStats.male = Number(item.value) || 0
        if (item.name === '女') genderStats.female = Number(item.value) || 0
      })
    } else if (gd) {
      Object.assign(genderStats, gd)
    }
  } catch (e) { console.error(e) }
})
</script>
