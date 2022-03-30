import request from '@/utils/request'

const api_name = '/api/edu/chapter'

export default {
  // 1. 添加章节
  addChapter(chapter) {
    return request({
      url: `${api_name}/add/chapter`,
      method: 'post',
      data: chapter
    })
  },
  // 2. 根据id查询章节
  getChapterById(id) {
    return request({
      url: `${api_name}/get/chapter/${id}`,
      method: 'get'
    })
  },
  // 3. 更新章节
  updateChapter(chapter) {
    return request({
      url: `${api_name}/update/chapter`,
      method: 'put',
      data: chapter
    })
  },
  // 4. 根据id删除章节
  deleteChapterById(id) {
    return request({
      url: `${api_name}/delete/chapter/${id}`,
      method: 'delete'
    })
  },
  // 5. 根据课程id查询课程的章节和小节
  getChapterInfoByCourseId(id) {
    return request({
      url: `${api_name}/get/chapter/video/list/${id}`,
      method: 'get'
    })
  },
  getChapterByCourseId(courseId) {
    return request({
      url: `${api_name}/get/chapter/course/${courseId}`,
      method: 'get'
    })
  }
}
