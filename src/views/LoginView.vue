<template>
  <div class="auth-container">
    <transition name="slide-fade" appear>
      <div class="auth-card">
      <div class="auth-left">
        <img class="auth-illustration" src="/src/assets/Login.jpg" alt="登录插画" @error="handleImageError" />
      </div>
      <div class="auth-right">
        <div class="auth-header">
          <h2 class="auth-title">揭榜挂帅系统</h2>
          <p class="auth-subtitle">一款让对接更高效的协同平台</p>
        </div>

        <el-form
          ref="loginForm"
          :model="form"
          :rules="rules"
          label-width="0"
          label-position="top"
          size="large"
          class="auth-form"
        >
          <el-form-item label="账号" prop="identifier">
            <el-input
              v-model="form.identifier"
              placeholder="请输入账号（手机号/邮箱/用户名）"
              title="账号"
              aria-label="账号"
              aria-required="true"
              name="identifier"
              autocomplete="username"
              id="login-identifier"
              clearable
              prefix-icon="User"
            />
          </el-form-item>

          <el-form-item label="密码" prop="credential">
            <el-input
              v-model="form.credential"
              type="password"
              show-password
              placeholder="请输入密码"
              title="密码"
              aria-label="密码"
              aria-required="true"
              name="credential"
              autocomplete="current-password"
              id="login-credential"
              clearable
              prefix-icon="Lock"
            />
          </el-form-item>

          <div class="aux-line">
            <el-checkbox v-model="rememberMe" label="记住用户名" aria-label="记住用户名" />
          </div>

          <el-button
            type="primary"
            :loading="loading"
            class="auth-submit"
            @click="handleLogin"
          >
            登录
          </el-button>

          <div class="below-link">
            <span class="muted">还没有账号？</span>
            <el-link type="primary" @click="goRegister" title="去注册" aria-label="去注册">去注册</el-link>
          </div>
        </el-form>
      </div>
    </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { loginAPI } from '../api/user'
import { ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const loginForm = ref(null)
const rememberMe = ref(false)

const form = ref({
  identifier: '',
  credential: ''
})

// 组件加载时检查是否有记住的用户名
onMounted(() => {
  const rememberedUsername = localStorage.getItem('rememberedUsername')
  if (rememberedUsername) {
    form.value.identifier = rememberedUsername
    rememberMe.value = true
  }
})

const rules = {
  identifier: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  credential: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

// 自动识别标识符类型
const detectIdentityType = (identifier) => {
  if (!identifier) return 'username'
  
  // 判断是否为手机号（11位数字，以1开头）
  const phoneRegex = /^1[3-9]\d{9}$/
  if (phoneRegex.test(identifier)) {
    return 'phone'
  }
  
  // 判断是否为邮箱（包含@符号）
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (emailRegex.test(identifier)) {
    return 'email'
  }
  
  // 默认为用户名
  return 'username'
}

const handleLogin = () => {
  loginForm.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true

    try {
      // 自动识别标识符类型
      const identityType = detectIdentityType(form.value.identifier)
      
      // 与后端接口约定：请求体 { identityType, identifier, credential }
      const res = await loginAPI({
        identityType,
        identifier: form.value.identifier,
        credential: form.value.credential
      })
      
      // 响应拦截器已保证 code === 200，这里假定返回结构 { code, message, data }
      const { data } = res || {}
      const token = data?.token
      const username = data?.username || data?.nickname || data?.userId || form.value.identifier
      if (!token) {
        throw new Error('登录失败：未获取到token')
      }

      ElMessage.success('登录成功！')

      // 保存登录状态（同时写入 pinia 与 localStorage）
      localStorage.setItem('token', token)
      userStore.login(username, token)

      // 记住用户名功能
      if (rememberMe.value) {
        localStorage.setItem('rememberedUsername', form.value.identifier)
      } else {
        localStorage.removeItem('rememberedUsername')
      }

      // 添加页面切换动画效果
      loading.value = true
      setTimeout(() => {
        router.push('/home')
      }, 300)
    } catch (err) {
      console.error('登录错误:', err)
      ElMessage.error(err?.response?.data?.message || err?.message || '用户名或密码错误')
    } finally {
      loading.value = false
    }
  })
}

const goRegister = () => {
  // 添加页面切换的加载效果
  loading.value = true
  setTimeout(() => {
    router.push('/register')
  }, 150)
}

// 图片加载错误处理
const handleImageError = (e) => {
  console.error('图片加载失败:', e.target.src)
  // 如果图片加载失败，可以设置一个占位符或隐藏图片
  e.target.style.display = 'none'
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #6a6afc 0%, #8ec5ff 100%);
}

.auth-card {
  width: 800px;
  height: 480px;
  max-width: 94vw;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.auth-left {
  background: linear-gradient(145deg, #eef5ff, #ffffff);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
}

.auth-illustration {
  width: 100%;
  max-width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.auth-right {
  padding: 28px 36px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.auth-header {
  text-align: left;
  margin-bottom: 14px;
}

.auth-title {
  margin: 0;
  color: #2c2f36;
  font-weight: 700;
  font-size: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.auth-subtitle {
  margin: 4px 0 0 0;
  color: #8b8e99;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.auth-form {
  margin-top: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.auth-form :deep(.el-form-item) {
  margin-bottom: 16px;
}

.aux-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0 10px;
  flex-wrap: nowrap;
}

.no-margin :deep(.el-form-item__content) {
  margin: 0 !important;
}

.auth-submit {
  width: 100%;
  height: 42px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 8px;
  margin-top: 2px;
}

.below-link {
  margin-top: 6px;
  text-align: center;
  color: #909399;
  font-size: 13px;
}

.below-link .muted {
  margin-right: 4px;
}
.aux-line :deep(.el-checkbox__label),
.aux-line :deep(.el-link__inner) {
  white-space: nowrap;
}

/* 过渡动画效果 */
.slide-fade-enter-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

/* 卡片悬停效果 */
.auth-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.auth-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.12);
}

/* 表单元素动画 */
.auth-form .el-form-item {
  animation: fadeInUp 0.6s ease-out backwards;
}

.auth-form .el-form-item:nth-child(1) { animation-delay: 0.1s; }
.auth-form .el-form-item:nth-child(2) { animation-delay: 0.2s; }
.auth-form .el-form-item:nth-child(3) { animation-delay: 0.3s; }
.auth-form .el-form-item:nth-child(4) { animation-delay: 0.4s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 按钮动画 */
.auth-submit {
  transition: all 0.3s ease;
}

.auth-submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(106, 122, 252, 0.3);
}

.auth-submit:active {
  transform: translateY(0);
}

/* 输入框聚焦动画 */
.auth-form :deep(.el-input__wrapper) {
  transition: all 0.3s ease;
}

.auth-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px rgba(106, 122, 252, 0.2);
}

.auth-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(106, 122, 252, 0.3);
}

/* 链接动画 */
.below-link .el-link {
  transition: all 0.2s ease;
}

.below-link .el-link:hover {
  transform: translateX(2px);
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.link-arrow {
  transition: transform 0.2s ease;
  font-size: 14px;
}

.nav-link:hover .link-arrow {
  transform: translateX(2px);
}
</style>
