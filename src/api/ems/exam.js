import request from '@/utils/request'

const api_name = '/api/ems/exam'

export default {
  // 1. 根据查询条件, 进行分页多条件查询
  getExamListByConditionPage(searchObj, current, size) {
    return request({
      url: `${api_name}/get/exam/list/${current}/${size}`,
      method: 'post',
      data: searchObj
    })
  },
  // 2. 根据key来查询考试标题
  getExamTitleListByKey(key) {
    return request({
      url: `${api_name}/get/exam/title/${key}`,
      method: 'get'
    })
  },
  // 3. 根据id删除考试
  deleteExamById(id) {
    return request({
      url: `${api_name}/delete/exam/${id}`,
      method: 'delete'
    })
  },
  edit(exam) {
    return request({
      url: `${api_name}/edit`,
      method: 'post',
      data: exam
    })
  },
  select(id) {
    return request({
      url: `${api_name}/select/${id}`,
      method: 'post'
    })
  }
}
