import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
})

request.interceptors.response.use(
  res => res.data,
  err => {
    const msg = err.response?.data?.msg || err.message || '请求失败'
    ElMessage.error(msg)
    return Promise.reject(err)
  }
)

export default request
