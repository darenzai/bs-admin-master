import request from '@/utils/request'

const api_name = '/api/edu/statistics'

export default {
  // 统计日数据
  createStatisticsByDay(day) {
    return request({
      url: `${api_name}/create/${day}`,
      method: 'post'
    })
  },
  // 获取某个时间段的图标数据
  getChartData(begin, end) {
    return request({
      url: `${api_name}/get/chart/data/${begin}/${end}`,
      method: 'get'
    })
  }
}
