import request from '@/utils/request'

const api_name = '/api/ems/paper'

export default {
  // 1. 根据查询条件, 进行分页多条件查询
  edit(paper) {
    return request({
      url: `${api_name}/edit`,
      method: 'post',
      data: paper
    })
  },
  // 2. 根据查询条件, 进行分页条件查询题库数据
  pageList(queryObj, current, size) {
    return request({
      url: `${api_name}/page/${current}/${size}`,
      method: 'post',
      data: queryObj
    })
  },
  // 3. 删除
  delete(questionType, id) {
    return request({
      url: `${api_name}/delete/${questionType}/${id}`,
      method: 'post'
    })
  },
  // 4. 查询
  select(questionType, id) {
    return request({
      url: `${api_name}/select/${questionType}/${id}`,
      method: 'post'
    })
  }
}
