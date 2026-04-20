<template>
  <el-dialog
    v-model="visible"
    width="auto"
    :show-close="false"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    class="auth-dialog"
    align-center
    destroy-on-close
  >
    <!-- 登录表单 -->
    <div v-if="currentMode === 'login'" class="auth-content">
      <div class="auth-card login-card">
        <div class="auth-left">
          <img class="auth-illustration" src="@/assets/Login.jpg" alt="登录插画" @error="handleImageError" />
        </div>
        <div class="auth-right">
          <button class="inline-close" @click="closeDialog" aria-label="关闭登录弹窗">✕</button>
          <div class="auth-header">
            <h2 class="auth-title">揭榜挂帅系统</h2>
            <p class="auth-subtitle">一款让对接更高效的协同平台</p>
          </div>

          <el-form
            ref="loginForm"
            :model="loginFormData"
            :rules="loginRules"
            label-width="0"
            label-position="top"
            size="large"
            class="auth-form"
          >
            <!-- 【测试功能】角色选择下拉框 - 用于快速切换不同角色进行测试 -->
            <el-form-item label="选择角色（测试用）" prop="testRole">
              <el-select
                v-model="loginFormData.testRole"
                placeholder="请选择角色"
                style="width: 100%"
                clearable
              >
                <el-option label="测试学生1" value="student" />
                <el-option label="测试学生2" value="student2" />
                <el-option label="测试学生3" value="student3" />
                <el-option label="演示学生" value="student_demo" />
                <el-option label="企业" value="enterprise" />
                <el-option label="苏州云枢智能科技有限公司" value="enterprise_demo" />
                <el-option label="教师（暂不可用）" value="teacher" disabled />
                <el-option label="管理员（暂不可用）" value="admin" disabled />
              </el-select>
            </el-form-item>

            <el-button
              type="primary"
              :loading="loginLoading"
              class="auth-submit"
              @click="handleLogin"
              :disabled="!loginFormData.testRole"
            >
              登录
            </el-button>

            <div class="below-link">
              <span class="muted">还没有账号？</span>
              <el-link type="primary" @click="switchToRegister" title="去注册" aria-label="去注册">去注册</el-link>
            </div>
            <div class="below-link" style="margin-top: 4px;">
              <el-link type="info" @click="switchToAdminLogin">管理员登录</el-link>
            </div>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 注册表单 -->
    <div v-else-if="currentMode === 'register'" class="auth-content">
      <div class="auth-card register-card">
        <div class="auth-left">
          <img class="auth-illustration" src="@/assets/Register.jpg" alt="注册插画" />
        </div>
        <div class="auth-right">
          <button class="inline-close" @click="closeDialog" aria-label="关闭注册弹窗">✕</button>
          <div class="auth-header">
            <h2 class="auth-title">揭榜挂帅系统</h2>
            <p class="auth-subtitle">欢迎加入，请完成注册信息</p>
          </div>

          <el-form
            ref="registerForm"
            :model="registerFormData"
            :rules="registerRules"
            label-width="0"
            label-position="top"
            size="large"
            class="auth-form"
          >
            <el-form-item label="昵称" prop="nickname">
              <el-input
                v-model="registerFormData.nickname"
                placeholder="请输入昵称"
                clearable
              />
            </el-form-item>

            <el-form-item label="用户类型" prop="type" class="no-margin">
              <el-select
                v-model="registerFormData.type"
                placeholder="请选择用户类型"
                style="width: 100%"
              >
                <el-option label="👨‍🎓 学生" value="学生" />
                <el-option label="🏢 企业" value="企业" />
              </el-select>
            </el-form-item>

            <el-form-item label="注册方式" prop="identityType" class="no-margin">
              <el-select
                v-model="registerFormData.identityType"
                placeholder="请选择注册方式"
                style="width: 100%"
              >
                <el-option label="👤 用户名注册" value="USERNAME" />
                <el-option label="📧 邮箱注册" value="EMAIL" />
                <el-option label="📱 电话号码注册" value="PHONE" />
              </el-select>
            </el-form-item>

            <el-form-item :label="identifierLabel" prop="identifier">
              <el-input
                v-model="registerFormData.identifier"
                :placeholder="`请输入${identifierLabel}`"
                :type="registerFormData.identityType === 'PHONE' ? 'tel' : 'text'"
                clearable
              />
            </el-form-item>

            <el-form-item label="密码" prop="credential">
              <el-input
                v-model="registerFormData.credential"
                type="password"
                show-password
                placeholder="请输入密码（6-20位，包含字母和数字）"
                clearable
              />
            </el-form-item>

            <el-button
              type="primary"
              :loading="registerLoading"
              class="auth-submit"
              @click="handleRegister"
            >
              注册
            </el-button>

            <div class="below-link">
              <span class="muted">已有账号？</span>
              <el-link type="primary" @click="switchToLogin" title="去登录" aria-label="去登录">立即登录</el-link>
            </div>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 管理员登录表单 -->
    <div v-else-if="currentMode === 'admin-login'" class="auth-content">
      <div class="auth-card admin-login-card">
        <div class="auth-right" style="padding: 36px 40px;">
          <button class="inline-close" @click="closeDialog" aria-label="关闭登录弹窗">✕</button>
          <div class="auth-header" style="text-align: center;">
            <h2 class="auth-title">管理员登录</h2>
            <p class="auth-subtitle">揭榜挂帅系统 · 后台管理</p>
          </div>

          <el-form
            ref="adminLoginForm"
            :model="adminFormData"
            :rules="adminLoginRules"
            label-width="0"
            label-position="top"
            size="large"
            class="auth-form"
          >
            <el-form-item label="用户名" prop="identifier">
              <el-input
                v-model="adminFormData.identifier"
                placeholder="请输入管理员用户名"
                clearable
                prefix-icon="User"
              />
            </el-form-item>

            <el-form-item label="密码" prop="credential">
              <el-input
                v-model="adminFormData.credential"
                type="password"
                show-password
                placeholder="请输入密码"
                clearable
                prefix-icon="Lock"
                @keyup.enter="handleAdminLogin"
              />
            </el-form-item>

            <el-button
              type="primary"
              :loading="adminLoginLoading"
              class="auth-submit"
              @click="handleAdminLogin"
            >
              登录
            </el-button>

            <div class="below-link">
              <el-link type="primary" @click="switchToLogin">返回普通登录</el-link>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'
import { registerAPI, loginAPI } from '@/api/user'

// 预设测试账号（用于便捷登录）
const PRESET_ACCOUNTS = {
  student: {
    identityType: 'USERNAME',
    identifier: 'test_student',
    credential: 'Test123456'
  },
  student2: {
    identityType: 'USERNAME',
    identifier: 'test_student2',
    credential: 'Test123456'
  },
  student3: {
    identityType: 'USERNAME',
    identifier: 'test_student3',
    credential: 'Test123456'
  },
  student_demo: {
    identityType: 'USERNAME',
    identifier: '演示学生',
    credential: 'Test123456'
  },
  enterprise: {
    identityType: 'USERNAME',
    identifier: 'test_enterprise',
    credential: 'Test123456'
  },
  enterprise_demo: {
    identityType: 'USERNAME',
    identifier: '苏州云枢智能科技有限公司',
    credential: 'Test123456'
  }
}

// 属性与事件
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  defaultMode: {
    type: String,
    default: 'login',
    validator: (value) => ['login', 'register', 'admin-login'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'login-success'])

const router = useRouter()
const authStore = useAuthStore()

// 弹窗与模式
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
const currentMode = ref(props.defaultMode)

// 登录
const loginLoading = ref(false)
const loginForm = ref(null)
const loginFormData = ref({
  testRole: ''
})
const loginRules = {
  testRole: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

// 注册
const registerLoading = ref(false)
const registerForm = ref(null)
const registerFormData = ref({
  nickname: '',
  type: '学生',
  identityType: 'USERNAME',
  identifier: '',
  credential: ''
})

const identifierLabel = computed(() => {
  if (registerFormData.value.identityType === 'PHONE') return '电话号码'
  if (registerFormData.value.identityType === 'USERNAME') return '用户名'
  return '邮箱'
})

// 关闭弹窗
const closeDialog = () => {
  visible.value = false
}

// 校验
const validateIdentifier = (rule, value, callback) => {
  if (!value) {
    callback(new Error(`请输入${identifierLabel.value}`))
    return
  }
  if (registerFormData.value.identityType === 'EMAIL') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      callback(new Error('请输入正确的邮箱格式'))
      return
    }
  } else if (registerFormData.value.identityType === 'PHONE') {
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(value)) {
      callback(new Error('请输入正确的手机号码格式（11位数字）'))
      return
    }
  } else if (registerFormData.value.identityType === 'USERNAME') {
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

const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'))
    return
  }
  if (value.length < 6 || value.length > 20) {
    callback(new Error('密码长度应为6-20个字符'))
    return
  }
  const hasLetter = /[a-zA-Z]/.test(value)
  const hasNumber = /\d/.test(value)
  if (!hasLetter || !hasNumber) {
    callback(new Error('密码必须包含字母和数字'))
    return
  }
  callback()
}

const registerRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度应为2-20个字符', trigger: 'blur' }
  ],
  type: [{ required: true, message: '请选择用户类型', trigger: 'change' }],
  identityType: [{ required: true, message: '请选择注册方式', trigger: 'change' }],
  identifier: [{ validator: validateIdentifier, trigger: 'blur' }],
  credential: [{ validator: validatePassword, trigger: 'blur' }]
}

// 切换模式
const switchToRegister = () => {
  currentMode.value = 'register'
}
const switchToLogin = () => {
  currentMode.value = 'login'
}
const switchToAdminLogin = () => {
  currentMode.value = 'admin-login'
}

// 管理员登录
const adminLoginLoading = ref(false)
const adminLoginForm = ref(null)
const adminFormData = ref({
  identifier: '',
  credential: ''
})
const adminLoginRules = {
  identifier: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  credential: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleAdminLogin = () => {
  adminLoginForm.value.validate(async (valid) => {
    if (!valid) return
    adminLoginLoading.value = true
    try {
      const res = await loginAPI({
        identityType: 'USERNAME',
        identifier: adminFormData.value.identifier,
        credential: adminFormData.value.credential
      })

      // 验证是否为管理员角色
      const userType = res.data.type
      if (userType !== '管理员' && String(userType) !== '3') {
        ElMessage.error('该账号不是管理员，请使用普通登录')
        return
      }

      const userData = {
        userId: res.data.userId,
        username: res.data.nickname,
        nickname: res.data.nickname,
        role: 'admin',
        type: res.data.type,
        avatar: res.data.avatarUrl || '',
        avatarUrl: res.data.avatarUrl || ''
      }
      const token = res.data.authentication

      ElMessage.success('管理员登录成功')
      authStore.login(userData, token)
      visible.value = false
      emit('login-success', userData)
    } catch (err) {
      console.error('管理员登录错误:', err)
      ElMessage.error(err?.info || err?.message || '登录失败')
    } finally {
      adminLoginLoading.value = false
    }
  })
}

// 登录
const handleLogin = () => {
  loginForm.value.validate(async (valid) => {
    if (!valid) return
    loginLoading.value = true
    try {
      const testRole = loginFormData.value.testRole
      if (!testRole) {
        ElMessage.warning('请选择角色')
        loginLoading.value = false
        return
      }

      // 检查是否有预设账号
      const presetAccount = PRESET_ACCOUNTS[testRole]
      if (!presetAccount) {
        ElMessage.warning('该角色暂不支持便捷登录')
        loginLoading.value = false
        return
      }

      // 调用真实登录 API
      const res = await loginAPI(presetAccount)

      // 调试日志：检查后端返回的数据
      console.log('[登录] 后端返回完整响应:', res)
      console.log('[登录] res.data:', res.data)
      console.log('[登录] authentication 字段:', res.data.authentication)
      console.log('[登录] authentication 类型:', typeof res.data.authentication)

      // 处理登录成功
      const userData = {
        userId: res.data.userId,
        username: res.data.nickname,
        nickname: res.data.nickname,
        role: ['student', 'student2', 'student3', 'student_demo'].includes(testRole) ? 'student' : 'enterprise',
        type: res.data.type,
        avatar: res.data.avatarUrl || '',
        avatarUrl: res.data.avatarUrl || ''
      }
      const token = res.data.authentication

      console.log('[登录] 准备存储的 token:', token)
      console.log('[登录] 准备存储的 userData:', userData)

      ElMessage.success(`登录成功！欢迎，${userData.nickname}`)
      // 统一由 authStore.login 管理存储，不再重复写 localStorage
      authStore.login(userData, token)

      visible.value = false
      emit('login-success', userData)
    } catch (err) {
      console.error('登录错误:', err)
      ElMessage.error(err?.info || err?.message || '登录失败，请检查网络连接')
    } finally {
      loginLoading.value = false
    }
  })
}

// 注册
const handleRegister = () => {
  registerForm.value.validate(async (valid) => {
    if (!valid) return
    registerLoading.value = true
    try {
      await registerAPI({
        nickname: registerFormData.value.nickname,
        type: registerFormData.value.type,
        identityType: registerFormData.value.identityType,
        identifier: registerFormData.value.identifier,
        credential: registerFormData.value.credential
      })
      const identityTypeText = registerFormData.value.identityType === 'EMAIL' ? '邮箱' :
                              registerFormData.value.identityType === 'PHONE' ? '手机号' : '用户名'
      ElMessage.success(`注册成功！您可以使用${identityTypeText}：${registerFormData.value.identifier} 进行登录`)
      switchToLogin()
    } catch (err) {
      console.error('注册错误:', err)
      ElMessage.error(err?.info || err?.message || '注册失败，请稍后重试')
    } finally {
      registerLoading.value = false
    }
  })
}

// 图片兜底
const handleImageError = (e) => {
  console.error('图片加载失败:', e.target.src)
  e.target.style.display = 'none'
}

// 注册方式切换时重置
watch(() => registerFormData.value.identityType, () => {
  registerFormData.value.identifier = ''
  if (registerForm.value) registerForm.value.clearValidate('identifier')
})

// 弹窗打开时重置
watch(visible, (newVal) => {
  if (newVal) {
    currentMode.value = props.defaultMode
    if (loginForm.value) loginForm.value.resetFields()
    if (registerForm.value) registerForm.value.resetFields()
    if (adminLoginForm.value) adminLoginForm.value.resetFields()
  }
})
</script>

<style scoped>
:deep(.auth-dialog) {
  border-radius: 18px;
}

:deep(.auth-dialog .el-dialog) {
  border-radius: 18px;
  overflow: hidden;
  background: transparent;
  box-shadow: none;
}

:deep(.auth-dialog .el-dialog__header) {
  display: none;
}

:deep(.auth-dialog .el-dialog__body) {
  padding: 0;
  background: transparent;
}

.auth-content {
  position: relative;
}

.auth-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* 去掉外部视觉框架，保留内容区域 */
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  overflow: visible;
  border: none;
  margin: 0 auto;
}

.login-card {
  width: 800px;
  height: 480px;
}

.login-card .auth-left {
  padding: 20px;
}

.login-card .auth-illustration {
  width: 100%;
  max-width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.login-card .auth-right {
  padding: 28px 36px;
}

.login-card .auth-title {
  font-size: 24px;
}

.login-card .auth-subtitle {
  font-size: 12px;
  margin: 4px 0 0 0;
}

.login-card .auth-form :deep(.el-form-item) {
  margin-bottom: 16px;
}

.login-card .auth-submit {
  font-size: 15px;
  border-radius: 8px;
  margin-top: 2px;
}

.register-card {
  width: 1080px;
  height: 620px;
}

.register-card .auth-left {
  padding: 36px;
}

.register-card .auth-illustration {
  width: 80%;
  max-width: 360px;
  height: auto;
}

.register-card .auth-right {
  padding: 28px 36px;
}

.register-card .auth-title {
  font-size: 26px;
}

.register-card .auth-subtitle {
  font-size: 13px;
  margin: 6px 0 0 0;
}

.register-card .auth-form :deep(.el-form-item) {
  margin-bottom: 8px;
}

.register-card .auth-submit {
  font-size: 16px;
  border-radius: 28px;
  margin: 6px 0 10px;
}

.auth-left {
  background: linear-gradient(145deg, #eef5ff, #ffffff);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.auth-right {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.auth-header {
  text-align: left;
  margin-bottom: 14px;
}

.auth-title {
  margin: 0;
  color: #2c2f36;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.auth-subtitle {
  color: #8b8e99;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.inline-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  color: #606266;
  transition: all 0.2s ease;
}

.inline-close:hover {
  background: rgba(0, 0, 0, 0.08);
  color: #303133;
}

.auth-form {
  margin-top: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.no-margin :deep(.el-form-item__content) {
  margin: 0 !important;
}

.auth-submit {
  width: 100%;
  height: 42px;
  font-weight: 500;
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

.admin-login-card {
  width: 400px;
  display: block;
}

.admin-login-card .auth-right {
  background: #fff;
  border-radius: 12px;
}

.admin-login-card .auth-title {
  font-size: 22px;
}

.admin-login-card .auth-subtitle {
  font-size: 13px;
  margin: 6px 0 0 0;
}

.admin-login-card .auth-submit {
  font-size: 15px;
  border-radius: 8px;
  margin-top: 8px;
}
</style>

<style>
.auth-dialog .el-overlay {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: linear-gradient(135deg, rgba(106, 106, 252, 0.7) 0%, rgba(142, 197, 255, 0.7) 100%);
}
</style>

