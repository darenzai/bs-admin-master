import request from '@/utils/request'
import qs from 'qs'

const api_name = '/api/edu/video'

export default {
  // 1. 新增课时
  addVideoSection(videoSection) {
    return request({
      url: `${api_name}/add/video/section`,
      method: "post",
      data: videoSection
    })
  },
  // 2. 根据id查询课时
  getVideoSectionById(id) {
    return request({
      url: `${api_name}/get/video/section/${id}`,
      method: "get"
    })
  },
  // 3. 使用id更新课时
  updateVideoSectionById(videoSection) {
    return request({
      url: `${api_name}/update/video/section`,
      method: 'put',
      data: videoSection
    })
  },
  // 4. 根据id删除课时
  deleteVideoSectionById(id) {
    return request({
      url: `${api_name}/delete/video/section/${id}`,
      method: "delete"
    })
  }
}