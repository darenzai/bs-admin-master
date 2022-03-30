import request from '@/utils/request'
import qs from 'qs'

const api_name = '/api/thirdparty/vod'

export default {
  
  // 1. 根据视频的id删除视频
  deleteVideById(videoSourceId) {
    return request({
      url: `${api_name}/delete/video/${videoSourceId}`,
      method: 'delete'
    })
  }

}