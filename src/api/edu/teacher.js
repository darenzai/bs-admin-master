import request from '@/utils/request'
import qs from 'qs'

const api_name = '/api/edu/teacher'

export default {
  // 1. 讲师列表之多条件分页查询
  getTeacherForPageLimit(current, size, queryCondition) {
    return request({
      url: `${api_name}/get/teacher/${current}/${size}`,
      method: 'post',
      data: queryCondition
    })
  },
  // 2. 删除讲师, 根据讲师id
  deleteTeacherById(id) {
    return request({
      url: `${api_name}/delete/teacher/${id}`,
      method: 'delete'
    })
  },
  // 3. 添加讲师
  addTeacher(teacher) {
    return request({
      url: `${api_name}/add/teacher`,
      method: 'post',
      data: teacher
    })
  },
  // 4. 根据讲师id查询讲师
  getTeacherById(id) {
    return request({
      url: `${api_name}/get/teacher/${id}`,
      method: 'get'
    })
  },
  // 5. 通过讲师id修改讲师
  updateTeacher(teacher) {
    return request({
      url: `${api_name}/update/teacher`,
      method: 'put',
      data: teacher
    })
  },
  // 6. 批量删除的方法
  batchDeleteTeacher(ids) {
    return request({
      url: `${api_name}/delete/teacher`,
      method: 'delete',
      params: {
        ids
      },
      paramsSerializer: function(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
  },
  // 7. 根据key获取讲师列表
  getTeacherNameListByKey(key) {
    return request({
      url: `${api_name}/get/list/${key}`,
      method: 'get'
    })
  },
  // 8. 获取讲师列表
  getAllTeachers() {
    return request({
      url: `${api_name}/get/all/teachers`,
      method: 'get'
    })
  }
}
