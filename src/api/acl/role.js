import request from '@/utils/request'

export default {
  // 1. 获取角色分页列表
  getPageList(page, limit, searchObj) {
    return request({
      url: `/api/admin/acl/role/${page}/${limit}`,
      method: 'get',
      params: searchObj // url查询字符串或表单键值对
    })
  },
  // 2. 获取角色
  getById(id) {
    return request({
      url: `/api/admin/acl/role/get/${id}`,
      method: 'get'
    })
  },
  // 3. 新增角色
  save(role) {
    return request({
      url: `/api/admin/acl/role/save`,
      method: 'post',
      data: role
    })
  },
  // 4. 修改角色
  updateById(role) {
    return request({
      url: `/api/admin/acl/role/update`,
      method: 'put',
      data: role
    })
  },
  // 5. 根据角色获取菜单
  getAssign(roleId) {
    return request({
      url: `/api/admin/acl/permission/toAssign/${roleId}`,
      method: 'get'
    })
  },
  // 6. 根据id列表删除角色
  removeById(id) {
    return request({
      url: `/api/admin/acl/role/remove/${id}`,
      method: 'delete'
    })
  },
  // 7. 删除角色
  removeRows(idList) {
    return request({
      url: `/api/admin/acl/role/batchRemove`,
      method: 'delete',
      data: idList
    })
  }

}
