<template>
  <div class="auth-container">
    <transition name="slide-fade" appear>
      <div class="auth-card">
      <div class="auth-left">
        <img class="auth-illustration" src="/src/assets/Register.jpg" alt="注册插画" />
      </div>
      <div class="auth-right">
        <div class="auth-header">
          <h2 class="auth-title">揭榜挂帅系统</h2>
          <p class="auth-subtitle">欢迎加入，请完成注册信息</p>
        </div>

      <el-form
        ref="registerForm"
        :model="form"
        :rules="rules"
        label-width="0"
        label-position="top"
        size="large"
        class="auth-form"
      >
        <el-form-item label="昵称" prop="nickname">
          <el-input
            v-model="form.nickname"
            placeholder="请输入昵称"
            title="昵称"
            aria-label="昵称"
            aria-required="true"
            name="nickname"
            autocomplete="name"
            id="register-nickname"
            clearable
          />
        </el-form-item>

        <el-form-item label="用户类型" prop="type" class="no-margin">
          <el-select
            v-model="form.type"
            placeholder="请选择用户类型"
            title="用户类型"
            aria-label="用户类型"
            name="type"
            id="register-type"
            style="width: 100%"
          >
            <el-option label="👨‍🎓 学生" value="学生" />
            <el-option label="🏢 企业" value="企业" />
          </el-select>
        </el-form-item>

        <el-form-item label="注册方式" prop="identityType" class="no-margin">
          <el-select
            v-model="form.identityType"
            placeholder="请选择注册方式"
            title="注册方式"
            aria-label="注册方式"
            name="identityType"
            id="register-identityType"
            style="width: 100%"
          >
            <el-option label="👤 用户名注册" value="username" />
            <el-option label="📧 邮箱注册" value="email" />
            <el-option label="📱 电话号码注册" value="phone" />
          </el-select>
        </el-form-item>

        <el-form-item :label="identifierLabel" prop="identifier">
          <el-input
            v-model="form.identifier"
            :placeholder="`请输入${identifierLabel}`"
            :title="identifierLabel"
            :aria-label="identifierLabel"
            aria-required="true"
            name="identifier"
            :autocomplete="form.identityType === 'email' ? 'email' : (form.identityType === 'phone' ? 'tel' : 'username')"
            :type="form.identityType === 'phone' ? 'tel' : 'text'"
            id="register-identifier"
            clearable
          />
        </el-form-item>

        <el-form-item label="密码" prop="credential">
          <el-input
            v-model="form.credential"
            type="password"
            show-password
            placeholder="请输入密码（6-20位，包含字母和数字）"
            title="密码"
            aria-label="密码"
            aria-required="true"
            name="credential"
            autocomplete="new-password"
            id="register-credential"
            clearable
          />
        </el-form-item>

        <el-button
          type="primary"
          :loading="loading"
          class="auth-submit"
          @click="handleRegister"
        >
          注册
        </el-button>

        <div class="below-link">
          <span class="muted">已有账号？</span>
          <el-link 
            type="primary" 
            @click="goLogin" 
            title="去登录" 
            aria-label="去登录"
            :underline="false"
            class="nav-link"
          >
            立即登录
            <el-icon class="link-arrow"><ArrowRight /></el-icon>
          </el-link>
        </div>
      </el-form>
      </div>
    </div>
    </transition>
  </div>
  </template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { registerAPI } from '../../../api/user'
import { ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()

const loading = ref(false)
const registerForm = ref(null)

const form = ref({
  nickname: '',
  type: '学生',
  identityType: 'username',
  identifier: '',
  credential: ''
})

const identifierLabel = computed(() => {
  if (form.value.identityType === 'phone') return '电话号码'
  if (form.value.identityType === 'username') return '用户名'
  return '邮箱'
})

// 验证规则
const validateIdentifier = (rule, value, callback) => {
  if (!value) {
    callback(new Error(`请输入${identifierLabel.value}`))
    return
  }
  
  if (form.value.identityType === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      callback(new Error('请输入正确的邮箱格式'))
      return
    }
  } else if (form.value.identityType === 'phone') {
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(value)) {
      callback(new Error('请输入正确的手机号码格式（11位数字）'))
      return
    }
  } else if (form.value.identityType === 'username') {
    if (value.length < 3 || value.length > 20) {
      callback(new Error('用户名长度应为3-20个字符'))
      return
    }
    const usernameRegex = /^[a-zA-Z0-9_]+$/
    if (!usernameRegex.test(value)) {
      callback(new Error('用户名只能包含字母、数字和下划线'))
      return
    }
  }
  
  callback()
}

// 密码强度验证
const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'))
    return
  }
  
  if (value.length < 6 || value.length > 20) {
    callback(new Error('密码长度应为6-20个字符'))
    return
  }
  
  // 检查密码强度：至少包含字母和数字
  const hasLetter = /[a-zA-Z]/.test(value)
  const hasNumber = /\d/.test(value)
  
  if (!hasLetter || !hasNumber) {
    callback(new Error('密码必须包含字母和数字'))
    return
  }
  
  callback()
}

const rules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度应为2-20个字符', trigger: 'blur' }
  ],
  type: [{ required: true, message: '请选择用户类型', trigger: 'change' }],
  identityType: [{ required: true, message: '请选择注册方式', trigger: 'change' }],
  identifier: [{ validator: validateIdentifier, trigger: 'blur' }],
  credential: [{ validator: validatePassword, trigger: 'blur' }]
}

// 当注册方式改变时，清空标识符输入并重新验证
watch(() => form.value.identityType, () => {
  form.value.identifier = ''
  if (registerForm.value) {
    registerForm.value.clearValidate('identifier')
  }
})

const handleRegister = () => {
  registerForm.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      // 与接口文档字段保持一致：
      // { nickname, type, identityType, identifier, credential }
      const res = await registerAPI({
        nickname: form.value.nickname,
        type: form.value.type,
        identityType: form.value.identityType,
        identifier: form.value.identifier,
        credential: form.value.credential
      })
      // 假定拦截器已抛错并只返回成功响应
      const identityTypeText = form.value.identityType === 'email' ? '邮箱' : 
                              form.value.identityType === 'phone' ? '手机号' : '用户名'
      ElMessage.success(`注册成功！您可以使用${identityTypeText}：${form.value.identifier} 进行登录`)
      // 添加页面切换动画效果
      loading.value = true
      setTimeout(() => {
        router.push('/login')
      }, 300)
    } catch (err) {
      console.error('注册错误:', err)
      ElMessage.error(err?.response?.data?.message || err?.message || '注册失败，请稍后重试')
    } finally {
      loading.value = false
    }
  })
}

const goLogin = () => {
  // 添加页面切换的加载效果
  loading.value = true
  setTimeout(() => {
    router.push('/login')
  }, 150)
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
  width: 1080px;
  height: 620px;
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
  padding: 36px;
}

.auth-illustration {
  width: 80%;
  max-width: 360px;
  height: auto;
}

.auth-right {
  padding: 28px 36px;
  overflow: hidden;
}

.auth-header {
  text-align: left;
  margin-bottom: 18px;
}

.auth-title {
  margin: 0;
  color: #2c2f36;
  font-weight: 700;
  font-size: 26px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.auth-subtitle {
  margin: 6px 0 0 0;
  color: #8b8e99;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.auth-form {
  margin-top: 2px;
}

.no-margin :deep(.el-form-item__content) {
  margin: 0 !important;
}

.auth-form :deep(.el-form-item) {
  margin-bottom: 8px;
}

.auth-submit {
  width: 100%;
  height: 42px;
  font-size: 16px;
  border-radius: 28px;
  margin: 6px 0 10px;
}

.no-wrap {
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
.auth-form .el-form-item:nth-child(5) { animation-delay: 0.5s; }
.auth-form .el-form-item:nth-child(6) { animation-delay: 0.6s; }

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

/* 选择框动画 */
.auth-form :deep(.el-select .el-input__wrapper) {
  transition: all 0.3s ease;
}

.auth-form :deep(.el-select .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px rgba(106, 122, 252, 0.2);
}

.auth-form :deep(.el-select .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(106, 122, 252, 0.3);
}

/* 链接动画 */
.auth-form .el-link {
  transition: all 0.2s ease;
}

.auth-form .el-link:hover {
  transform: translateX(2px);
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

