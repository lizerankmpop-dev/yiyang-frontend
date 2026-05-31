import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import router from '@/router'

// 鍒涘缓鏃犳嫤鎴櫒鐨刟xios瀹炰緥锛屼笓闂ㄧ敤浜庡埛鏂皌oken
const refreshInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

// 涓昏姹傚疄渚?
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 骞跺彂鎺у埗锛氱‘淇濆悓涓€鏃堕棿鍙湁涓€涓埛鏂拌姹?
let isRefreshing = false
let refreshSubscribers = []

const notifyRefreshSubscribers = (token) => {
  refreshSubscribers.forEach(callback => callback(token))
  refreshSubscribers = []
}

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback)
}

// 璇锋眰鎷︽埅鍣細娣诲姞token鍒拌姹傚ご
request.interceptors.request.use(config => {
  const userStore = useUserStore()
  const token = userStore.token || localStorage.getItem('token')
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  config.isRefreshRequest = config.url.includes('/refresh-token')
  
  return config
}, error => {
  return Promise.reject(error)
})

// 鍝嶅簲鎷︽埅鍣細澶勭悊鍝嶅簲鍜岄敊璇?
request.interceptors.response.use(
  response => {
    const res = response.data
    
    if (res.code !== 200) {
      if (!response.config.isRefreshRequest) {
        ElMessage.error(res.msg || '鎿嶄綔澶辫触锛岃绋嶅悗閲嶈瘯')
      }
      return Promise.reject(new Error(res.msg || '璇锋眰澶辫触'))
    }
    
    return res.data
  },
  async error => {
    const originalRequest = error.config
    
    if (error.response?.status === 401) {
      if (isRefreshing) {
        return new Promise(resolve => {
          addRefreshSubscriber(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(request(originalRequest))
          })
        })
      }
      
      if (!originalRequest._retry && !originalRequest.isRefreshRequest) {
        originalRequest._retry = true
        isRefreshing = true
        
        try {
          const userStore = useUserStore()
          const refreshToken = userStore.refreshToken || localStorage.getItem('refreshToken')
          
          if (!refreshToken) {
            throw new Error('鏃犲埛鏂板嚟璇侊紝闇€閲嶆柊鐧诲綍')
          }
          
          const { data } = await refreshInstance.post('/admin/refresh-token', {
            token: localStorage.getItem('token'),
            refreshToken
          })
          
          const { token: newToken, refreshToken: newRefreshToken } = data
          
          localStorage.setItem('token', newToken)
          localStorage.setItem('refreshToken', newRefreshToken)
          userStore.setToken(newToken)
          userStore.setRefreshToken(newRefreshToken)
          
          notifyRefreshSubscribers(newToken)
          
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return request(originalRequest)
          
        } catch (refreshError) {
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('userInfo')
          localStorage.removeItem('admin')
          
          const userStore = useUserStore()
          userStore.clearUserInfo()
          
          refreshSubscribers = []
          
          ElMessageBox.alert(
            '登录已过期，请重新登录',
            '会话超时',
            { type: 'warning' }
          ).then(() => {
            router.push('/login')
          })
          
          return Promise.reject(refreshError)
          
        } finally {
          isRefreshing = false
        }
      }
    }
    
    const errorMsg = error.response?.data?.msg || error.message || '缃戠粶寮傚父锛岃绋嶅悗閲嶈瘯'
    const displayMsg = import.meta.env.DEV ? errorMsg : '缃戠粶寮傚父锛岃绋嶅悗閲嶈瘯'
    ElMessage.error(displayMsg)
    
    return Promise.reject(error)
  }
)

export default request
