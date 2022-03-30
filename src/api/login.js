import request from '@/utils/request'

// export function login(username, password) {
//   return request({
//     url: '/api/edu/user/login',
//     method: 'post',
//     data: {
//       username,
//       password
//     }
//   })
// }
// 登录
export function login(username, password) {
  return request({
    url: '/api/admin/acl/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

// 获取用户信息
export function getInfo(token) {
  return request({
    url: '/api/admin/acl/index/info',
    method: 'get',
    params: { token }
  })
}

// 登出
export function logout() {
  return request({
    url: '/api/admin/acl/index/logout',
    method: 'post'
  })
}

// 获取菜单权限数据
export function getMenu() {
  return request({
    url: '/api/admin/acl/index/menu',
    method: 'get'
  })
}
