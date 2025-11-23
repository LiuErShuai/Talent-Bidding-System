/**
 * 系统常量定义
 */

// API相关常量
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8091/api/v1'
export const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL || 'http://localhost:8091/upload'

// 文件上传限制
export const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_FILE_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  archive: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'],
  video: ['video/mp4', 'video/avi', 'video/mov']
}

// 分页默认值
export const DEFAULT_PAGE_SIZE = 10
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

// 日期时间格式
export const DATE_FORMAT = 'YYYY-MM-DD'
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
export const TIME_FORMAT = 'HH:mm:ss'

// 应用配置
export const APP_TITLE = '揭榜挂帅平台'
export const APP_VERSION = '1.0.0'

// 存储键名
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  USER_ROLE: 'userRole',
  THEME: 'theme',
  LANGUAGE: 'language'
}

// 请求超时时间
export const REQUEST_TIMEOUT = 30000 // 30秒

