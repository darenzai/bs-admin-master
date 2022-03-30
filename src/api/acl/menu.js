import request from '@/utils/request'

export default {
  // 1. 查询所有权限
  getNestedTreeList() {
    return request({
      url: `/api/admin/acl/permission`,
      method: 'get'
    })
  },
  // 2. 传入一个 菜单的 id, 删除该菜单的所有, 包括子菜单
  removeById(id) {
    return request({
      url: `/api/admin/acl/permission/remove/${id}`,
      method: 'delete'
    })
  },
  // 3. 新增菜单
  saveLevelOne(menu) {
    return request({
      url: `/api/admin/acl/permission/save`,
      method: 'post',
      data: menu
    })
  },
  // 4. 修改菜单
  update(menu) {
    return request({
      url: `/api/admin/acl/permission/update`,
      method: 'put',
      data: menu
    })
  },
  // 5. 根据角色获取菜单
  toAssign(roleId) {
    return request({
      url: `/api/admin/acl/permission/toAssign/${roleId}`,
      method: 'get'
    })
  },
  // 6. 角色分配权限
  doAssign(roleId, permissionId) {
    return request({
      url: `/api/admin/acl/permission/doAssign`,
      method: 'post',
      params: { roleId, permissionId }
    })
  }
}
