<template>
  <el-container style="height: 100vh;">
    <!-- 左侧导航栏：固定显示，永不隐藏 -->
    <el-aside width="220px" style="background-color: #23262e; overflow-y: auto;">
      <div style="height: 60px; line-height: 60px; text-align: center; color: white; font-size: 18px; font-weight: bold;">
        东软颐养中心
      </div>
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        background-color="#23262e"
        text-color="#fff"
        active-text-color="#409eff"
        router
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataLine /></el-icon>
          <span>数据概览</span>
        </el-menu-item>

        <el-sub-menu index="customer-group">
          <template #title>
            <el-icon><User /></el-icon>
            <span>客户管理</span>
          </template>
          <el-menu-item index="/customer/list">客户列表</el-menu-item>
          <el-menu-item index="/checkin/index">入住登记</el-menu-item>
          <el-menu-item index="/checkout/index">退住管理</el-menu-item>
          <el-menu-item index="/backdown/index">退住记录</el-menu-item>
          <el-menu-item index="/outward/index">外出管理</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/bed/index">
          <el-icon><Memo /></el-icon>
          <span>床位管理</span>
        </el-menu-item>

        <el-sub-menu index="nurse-group">
          <template #title>
            <el-icon><FirstAidKit /></el-icon>
            <span>护理管理</span>
          </template>
          <el-menu-item index="/nurse/level">护理级别</el-menu-item>
          <el-menu-item index="/nurse/project">护理项目</el-menu-item>
          <el-menu-item index="/nurse/record">护理记录</el-menu-item>
          <el-menu-item index="/nurse/task">护理任务</el-menu-item>
          <el-menu-item index="/nurse/customer-nursing">客户护理设置</el-menu-item>
          <el-menu-item index="/nurse/service">护理服务</el-menu-item>
          <el-menu-item index="/nurse/assignment">护理排班</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/health/index">
          <el-icon><Document /></el-icon>
          <span>健康档案</span>
        </el-menu-item>

        <el-menu-item index="/meal/index">
          <el-icon><DishDot /></el-icon>
          <span>膳食管理</span>
        </el-menu-item>

        <el-menu-item index="/schedule/index">
          <el-icon><Calendar /></el-icon>
          <span>排班管理</span>
        </el-menu-item>

        <el-menu-item index="/statistics/index">
          <el-icon><PieChart /></el-icon>
          <span>统计分析</span>
        </el-menu-item>

        <!-- 系统管理：仅超级管理员可见 -->
        <el-sub-menu index="system-group" v-if="userInfo.role === 'super_admin'">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/user/manage">护士管理</el-menu-item>
          <el-menu-item index="/role/index">角色管理</el-menu-item>
          <el-menu-item index="/admin/index">管理员管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="background-color: white; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; padding: 0 20px;">
        <span>欢迎使用东软颐养中心管理系统</span>
        <div>
          <!-- 用户身份标签 -->
          <el-tag 
            :type="userInfo.role === 'super_admin' ? 'danger' : 'info'" 
            size="small" 
            style="margin-right: 8px;"
          >
            {{ roleLabel }}
          </el-tag>
          <span style="margin-right: 15px; color: #666;">{{ userInfo.nickname || userInfo.username }}</span>
          <el-button type="text" @click="logout">退出登录</el-button>
        </div>
      </el-header>
      <el-main style="background-color: #f5f7fa;">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { DataLine, User, Memo, FirstAidKit, Document, DishDot, Calendar, PieChart, Setting } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { computed } from 'vue'

const userStore = useUserStore()
const router = useRouter()

// 当前登录用户信息
const userInfo = computed(() => userStore.userInfo || {})

// 用户身份标签
const roleLabel = computed(() => {
  const role = userInfo.value?.role || ''
  if (role === 'super_admin') return '高级管理员'
  if (role === 'admin') return '普通管理员'
  return '未知角色'
})

const logout = () => {
  userStore.logout()
  ElMessage.success('退出登录成功')
  router.push('/login')
}
</script>

<style scoped>
.el-menu-vertical-demo {
  border-right: none;
}
</style>
