import axios from 'axios'
import { ElMessage } from 'element-plus'


const request = axios.create({
  baseURL: 'http://43.142.157.145:8091/api/v1',
  timeout: 10000
}) 

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
request.interceptors.response.use(
  (response) => {
    const res = response.data
    // 兼容 code 为 200 或 "0000" 的成功响应
    if (res.code !== 200 && res.code !== '0000') {
      ElMessage.error(res.info || res.message || '请求错误')
      return Promise.reject(res)
    }
    return res
  },
  (error) => {
    ElMessage.error(error.response?.data?.info || error.response?.data?.message || '网络错误')
    return Promise.reject(error)
  }
)

export default request
