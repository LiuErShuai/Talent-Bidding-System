/**
 * 表单通用逻辑组合式函数
 */
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

export function useForm(options = {}) {
  const {
    initialValues = {},
    onSubmit,
    validateOnSubmit = true
  } = options

  const formRef = ref(null)
  const loading = ref(false)
  const formData = reactive({ ...initialValues })

  /**
   * 表单验证
   * @returns {Promise<boolean>}
   */
  const validate = async () => {
    if (!formRef.value) return false
    try {
      await formRef.value.validate()
      return true
    } catch (error) {
      console.error('表单验证失败:', error)
      return false
    }
  }

  /**
   * 重置表单
   */
  const reset = () => {
    if (formRef.value) {
      formRef.value.resetFields()
    }
    Object.assign(formData, initialValues)
  }

  /**
   * 提交表单
   */
  const submit = async () => {
    if (loading.value) return

    // 验证表单
    if (validateOnSubmit) {
      const isValid = await validate()
      if (!isValid) {
        ElMessage.warning('请检查表单填写是否正确')
        return
      }
    }

    loading.value = true
    try {
      if (onSubmit) {
        await onSubmit(formData)
      }
    } catch (error) {
      console.error('表单提交失败:', error)
      ElMessage.error(error.message || '提交失败，请重试')
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 设置字段值
   * @param {string} field 字段名
   * @param {any} value 值
   */
  const setFieldValue = (field, value) => {
    formData[field] = value
  }

  /**
   * 获取字段值
   * @param {string} field 字段名
   * @returns {any}
   */
  const getFieldValue = (field) => {
    return formData[field]
  }

  return {
    formRef,
    formData,
    loading,
    validate,
    reset,
    submit,
    setFieldValue,
    getFieldValue
  }
}

