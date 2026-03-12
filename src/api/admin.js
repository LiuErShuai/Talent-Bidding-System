import request from './request'

/**
 * 获取平台统计数据
 */
export const getStatistics = () => {
  return request({
    url: '/admin/statistics',
    method: 'get'
  })
}
