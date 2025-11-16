import axios from 'axios'
import { ElMessage } from 'element-plus'


const request = axios.create({
  baseURL: 'http://localhost:8091/api/v1',
  timeout: 5000
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
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求错误')
      return Promise.reject(res)
    }
    return res
  },
  (error) => {
    ElMessage.error(error.response?.data?.message || '网络错误')
    return Promise.reject(error)
  }
)

export default request
