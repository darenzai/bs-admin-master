import request from '@/utils/request'

export default {
  // 1. 获取管理用户分页列表
  getPageList(page, limit, searchObj) {
    return request({
      url: `/api/admin/acl/user/${page}/${limit}`,
      method: 'get',
      params: searchObj // url查询字符串或表单键值对
    })
  },
  // 2. 通过id查询用户
  getById(id) {
    return request({
      url: `/api/admin/acl/user/get/${id}`,
      method: 'get'
    })
  },
  // 3. 新增管理用户
  save(user) {
    return request({
      url: `/api/admin/acl/user/save`,
      method: 'post',
      data: user
    })
  },
  // 4.  修改管理用户
  updateById(user) {
    return request({
      url: `/api/admin/acl/user/update`,
      method: 'put',
      data: user
    })
  },
  // 5. 根据用户获取角色数据
  getAssign(userId) {
    return request({
      url: `/api/admin/acl/user/toAssign/${userId}`,
      method: 'get'
    })
  },
  // 6. 根据用户分配角色
  saveAssign(userId, roleId) {
    return request({
      url: `/api/admin/acl/user/doAssign`,
      method: 'post',
      params: { userId, roleId }
    })
  },
  // 7. 删除管理用户
  removeById(id) {
    return request({
      url: `/api/admin/acl/user/remove/${id}`,
      method: 'delete'
    })
  },
  // 8. 根据id列表删除管理用户
  removeRows(idList) {
    return request({
      url: `/api/admin/acl/user/batchRemove`,
      method: 'delete',
      data: idList
    })
  }
}
