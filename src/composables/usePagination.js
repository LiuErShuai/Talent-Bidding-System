/**
 * 分页逻辑组合式函数
 */
import { ref, computed } from 'vue'
import { DEFAULT_PAGE_SIZE } from '@/utils/constants'

export function usePagination(options = {}) {
  const {
    pageSize = DEFAULT_PAGE_SIZE,
    total = 0,
    onPageChange,
    onSizeChange
  } = options

  const currentPage = ref(1)
  const pageSizeValue = ref(pageSize)
  const totalValue = ref(total)

  // 总页数
  const totalPages = computed(() => {
    return Math.ceil(totalValue.value / pageSizeValue.value) || 1
  })

  // 是否有上一页
  const hasPrev = computed(() => currentPage.value > 1)

  // 是否有下一页
  const hasNext = computed(() => currentPage.value < totalPages.value)

  // 跳转到指定页
  const goToPage = (page) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
    onPageChange?.(page)
  }

  // 上一页
  const prevPage = () => {
    if (hasPrev.value) {
      goToPage(currentPage.value - 1)
    }
  }

  // 下一页
  const nextPage = () => {
    if (hasNext.value) {
      goToPage(currentPage.value + 1)
    }
  }

  // 改变每页条数
  const changePageSize = (size) => {
    pageSizeValue.value = size
    currentPage.value = 1
    onSizeChange?.(size)
  }

  // 重置分页
  const reset = () => {
    currentPage.value = 1
    totalValue.value = 0
  }

  // 设置总数
  const setTotal = (total) => {
    totalValue.value = total
  }

  return {
    currentPage,
    pageSize: pageSizeValue,
    total: totalValue,
    totalPages,
    hasPrev,
    hasNext,
    goToPage,
    prevPage,
    nextPage,
    changePageSize,
    reset,
    setTotal
  }
}

