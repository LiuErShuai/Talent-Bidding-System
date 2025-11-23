/**
 * localStorage/sessionStorage封装
 */

/**
 * localStorage操作
 */
export const local = {
  /**
   * 设置值
   * @param {string} key 键名
   * @param {any} value 值
   */
  set(key, value) {
    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(key, serialized)
    } catch (error) {
      console.error('localStorage.set error:', error)
    }
  },

  /**
   * 获取值
   * @param {string} key 键名
   * @param {any} defaultValue 默认值
   * @returns {any}
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      if (item === null) return defaultValue
      return JSON.parse(item)
    } catch (error) {
      console.error('localStorage.get error:', error)
      return defaultValue
    }
  },

  /**
   * 移除值
   * @param {string} key 键名
   */
  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('localStorage.remove error:', error)
    }
  },

  /**
   * 清空所有
   */
  clear() {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('localStorage.clear error:', error)
    }
  }
}

/**
 * sessionStorage操作
 */
export const session = {
  /**
   * 设置值
   * @param {string} key 键名
   * @param {any} value 值
   */
  set(key, value) {
    try {
      const serialized = JSON.stringify(value)
      sessionStorage.setItem(key, serialized)
    } catch (error) {
      console.error('sessionStorage.set error:', error)
    }
  },

  /**
   * 获取值
   * @param {string} key 键名
   * @param {any} defaultValue 默认值
   * @returns {any}
   */
  get(key, defaultValue = null) {
    try {
      const item = sessionStorage.getItem(key)
      if (item === null) return defaultValue
      return JSON.parse(item)
    } catch (error) {
      console.error('sessionStorage.get error:', error)
      return defaultValue
    }
  },

  /**
   * 移除值
   * @param {string} key 键名
   */
  remove(key) {
    try {
      sessionStorage.removeItem(key)
    } catch (error) {
      console.error('sessionStorage.remove error:', error)
    }
  },

  /**
   * 清空所有
   */
  clear() {
    try {
      sessionStorage.clear()
    } catch (error) {
      console.error('sessionStorage.clear error:', error)
    }
  }
}

