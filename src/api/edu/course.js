import request from '@/utils/request'

const api_name = '/api/edu/course'

export default {
  // 1. 保存课程信息, 返回课程的id
  saveCourseInfo(courseInfo) {
    return request({
      url: `${api_name}/save/course/info`,
      method: 'post',
      data: courseInfo
    })
  },
  // 2. 根据课程id查询课程
  getCourseById(id) {
    return request({
      url: `${api_name}/get/course/${id}`,
      method: 'get'
    })
  },
  // 3. 更新课程信息
  updateCourseInfo(courseInfo) {
    return request({
      url: `${api_name}/update/course/info`,
      method: 'put',
      data: courseInfo
    })
  },
  // 4. 分页条件查询课程信息, 完善课程列表信息
  getCourseListByCondition(searchObj, current, size) {
    return request({
      url: `${api_name}/list/course/${current}/${size}`,
      method: 'post',
      data: searchObj
    })
  },
  // 5. 根据课程id删除该课程
  deleteCourseById(id) {
    return request({
      url: `${api_name}/delete/course/${id}`,
      method: 'delete'
    })
  },
  // 6. 根据课程id查询, 发布课程的信息
  getCoursePublishInfoById(id) {
    return request({
      url: `${api_name}/get/course/publish/info/${id}`,
      method: 'get'
    })
  },
  // 7. 发布课程
  publishCourseById(id) {
    return request({
      url: `${api_name}/update/publish/course/${id}`,
      method: 'put'
    })
  },
  // 8. 获取课程列表
  getCourseList() {
    return request({
      url: `${api_name}/get/course/list`,
      method: 'get'
    })
  }
}
