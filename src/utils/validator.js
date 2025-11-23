/**
 * 表单验证规则
 */

/**
 * 验证手机号
 * @param {string} phone 手机号
 * @returns {boolean}
 */
export function validatePhone(phone) {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
}

/**
 * 验证邮箱
 * @param {string} email 邮箱
 * @returns {boolean}
 */
export function validateEmail(email) {
  const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return reg.test(email)
}

/**
 * 验证密码强度
 * @param {string} password 密码
 * @returns {object} { valid: boolean, message: string }
 */
export function validatePassword(password) {
  if (!password) {
    return { valid: false, message: '密码不能为空' }
  }
  if (password.length < 6) {
    return { valid: false, message: '密码长度至少6位' }
  }
  if (password.length > 20) {
    return { valid: false, message: '密码长度不能超过20位' }
  }
  // 至少包含字母和数字
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  if (!hasLetter || !hasNumber) {
    return { valid: false, message: '密码需包含字母和数字' }
  }
  return { valid: true, message: '' }
}

/**
 * 验证身份证号
 * @param {string} idCard 身份证号
 * @returns {boolean}
 */
export function validateIdCard(idCard) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(idCard)
}

/**
 * 验证URL
 * @param {string} url URL地址
 * @returns {boolean}
 */
export function validateUrl(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 验证文件类型
 * @param {File} file 文件对象
 * @param {string[]} allowedTypes 允许的类型数组，如 ['image/jpeg', 'image/png']
 * @returns {boolean}
 */
export function validateFileType(file, allowedTypes) {
  if (!file || !allowedTypes || allowedTypes.length === 0) return false
  return allowedTypes.includes(file.type)
}

/**
 * 验证文件大小
 * @param {File} file 文件对象
 * @param {number} maxSize 最大大小（字节）
 * @returns {boolean}
 */
export function validateFileSize(file, maxSize) {
  if (!file) return false
  return file.size <= maxSize
}

/**
 * Element Plus表单验证规则生成器
 */
export const rules = {
  /**
   * 必填规则
   * @param {string} message 错误提示
   * @returns {object}
   */
  required(message = '此项为必填项') {
    return {
      required: true,
      message,
      trigger: 'blur'
    }
  },

  /**
   * 手机号规则
   * @returns {object}
   */
  phone() {
    return {
      validator: (rule, value, callback) => {
        if (!value) {
          callback()
          return
        }
        if (validatePhone(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的手机号'))
        }
      },
      trigger: 'blur'
    }
  },

  /**
   * 邮箱规则
   * @returns {object}
   */
  email() {
    return {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: 'blur'
    }
  },

  /**
   * 密码规则
   * @returns {object}
   */
  password() {
    return {
      validator: (rule, value, callback) => {
        if (!value) {
          callback()
          return
        }
        const result = validatePassword(value)
        if (result.valid) {
          callback()
        } else {
          callback(new Error(result.message))
        }
      },
      trigger: 'blur'
    }
  },

  /**
   * 长度规则
   * @param {number} min 最小长度
   * @param {number} max 最大长度
   * @returns {object}
   */
  length(min, max) {
    return {
      min,
      max,
      message: `长度应在${min}到${max}个字符之间`,
      trigger: 'blur'
    }
  }
}

