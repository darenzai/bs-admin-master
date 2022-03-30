import request from '@/utils/request'
import qs from 'qs'

const api_name = '/api/edu/subject'

export default {

  // 1. 获取学科所有分类
  getAllSubjects() {
    return request({
      url: `${api_name}/get/all/subjects`,
      method: 'get'
    })
  },
  // 2. 追加学科
  appendSubject(subject) {
    return request({
      url: `${api_name}/append/subject`,
      method: 'post',
      data: subject
    })
  },
  // 3. 根据id查询学科
  getSubjectById(sId) {
    return request({
      url: `${api_name}/get/subject/${sId}`,
      method: 'get'
    })
  },
  // 4. 修改学科
  editSubject(subject) {
    return request({
      url: `${api_name}/edit/subject`,
      method: 'put',
      data: subject
    })
  },
  // 5. 删除学科
  deleteSubject(id) {
    return request({
      url: `${api_name}/delete/subject/${id}`,
      method: 'delete'
    })
  },
  // 6. 添加学科
  addSubject(subject) {
    return request({
      url: `${api_name}/add/subject`,
      method: 'post',
      data: subject
    })
  },
  // 7. 批量删除学科
  batchDeleteSubject(sIds) {
    return request({
      url: `${api_name}/batch/delete/subject`,
      method: 'delete',
      params: {
        sIds
      },
      paramsSerializer: function(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  // 8. 批量保存
  batchSaveSubject(subjects) {
    return request({
      url: `${api_name}/batch/save/subject`,
      method: 'post',
      data: subjects
    })
  }
}
