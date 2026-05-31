<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h2 class="login-title">颐养中心管理系统</h2>
      <el-form :model="loginForm" :rules="rules" ref="formRef" label-width="0">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" :loading="loading" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
      <div class="link-row">
        没有账号？<el-link type="primary" @click="$router.push('/register')">去注册</el-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api/admin'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 关键：必须定义 formRef
const formRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    const data = await login({
      username: loginForm.username,
      password: loginForm.password
    })
    console.log('登录返回数据:', data)

    // 关键：根据后端实际返回的数据结构提取token
    // 如果后端返回的是 { code: 200, data: { token: 'xxx', admin: {} } }
    const token = data.data?.token || data.token
    const admin = data.data?.admin || data.admin

    if (token) {
      // 同时保存到localStorage和pinia
      localStorage.setItem('token', token)
      userStore.setToken(token)
      if (admin) userStore.setUserInfo(admin)
      
      ElMessage.success('登录成功')
      // 强制跳转到dashboard
      window.location.href = '/#/dashboard'
    } else {
      ElMessage.error('登录失败：未获取到token')
    }
  } catch (err) {
    console.error('登录失败:', err)
    ElMessage.error('登录失败，请检查账号密码')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.login-card {
  width: 320px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}
.login-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}
.link-row {
  text-align: center;
  margin-top: 15px;
  color: #666;
  font-size: 14px;
}
</style>