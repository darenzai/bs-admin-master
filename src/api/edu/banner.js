import request from '@/utils/request'
const api_name = '/api/edu/banner'

export default {
  // 1. 获取所有Banner列表
  getBannerList() {
    return request({
      url: `${api_name}/get/banners`,
      method: 'get'
    })
  },
  // 2. 新增banner
  addBanner(banner) {
    return request({
      url: `${api_name}/add/banner`,
      method: 'post',
      data: banner
    })
  },
  // 3. 修改banner根据id
  updateBanner(banner) {
    return request({
      url: `${api_name}/update/banner`,
      method: 'put',
      data: banner
    })
  },
  // 4. 根据id查询banner
  getBannerById(id) {
    return request({
      url: `${api_name}/get/banner/${id}`,
      method: 'get'
    })
  },
  // 5. 删除banner根据id
  deleteBanner(id) {
    return request({
      url: `${api_name}/delete/banner/${id}`,
      method: 'delete'
    })
  },
  // 6. banner分页列表
  pageBannerList(current, size) {
    return request({
      url: `${api_name}/list/banner/page/${current}/${size}`,
      method: 'get'
    })
  }
}
