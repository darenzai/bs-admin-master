import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRoutes = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  // 首页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  }]
// 讲师管理
export const asyncRoutes = [{
  path: '/teacher',
  component: Layout,
  redirect: '/teacher/table',
  name: '讲师管理',
  meta: { title: '讲师管理', icon: 'users' },
  children: [
    {
      path: 'table',
      name: 'TeacherListPage',
      component: () => import('@/views/edu/teacher/list'),
      meta: { title: '讲师列表', noCache: true }
    },
    {
      path: 'save',
      name: 'TeacherAddPage',
      component: () => import('@/views/edu/teacher/save'),
      meta: { title: '讲师编辑', noCache: true }
    },
    {
      path: 'edit/:id',
      name: 'TeacherEditPage',
      component: () => import('@/views/edu/teacher/save'),
      meta: { title: '讲师编辑', noCache: true },
      hidden: true
    }
  ]
},
  // 学科分类管理
{
  path: '/subject',
  component: Layout,
  redirect: '/subject/list',
  name: '学科管理',
  meta: { title: '学科管理', icon: 'education' },
  children: [
    {
      path: 'list',
      name: 'SubjectListPage',
      component: () => import('@/views/edu/subject/list'),
      meta: { title: '学科列表', noCache: true }
    },
    {
      path: 'import',
      name: 'SubjectEditPage',
      component: () => import('@/views/edu/subject/save'),
      meta: { title: '学科创编', noCache: true }
    }
  ]
},
  // 课程管理
{
  path: '/course',
  component: Layout,
  redirect: '/course/list',
  name: 'Course',
  meta: { title: '课程管理', icon: 'task' },
  children: [
    {
      path: 'list',
      name: 'CourseList',
      component: () => import('@/views/edu/course/list'),
      meta: { title: '课程列表', noCache: true }
    },
    {
      path: 'info',
      name: 'CourseInfo',
      component: () => import('@/views/edu/course/form'),
      meta: { title: '课程发布', noCache: true }
    },
    {
      path: 'info/:id',
      name: 'CourseEditInfo',
      component: () => import('@/views/edu/course/form'),
      meta: { title: '课程编辑', noCache: true },
      hidden: true
    },
    {
      path: 'chapter/:id',
      name: 'CourseChapterEdit',
      component: () => import('@/views/edu/course/form'),
      meta: { title: '课程大纲', noCache: true },
      hidden: true
    }
  ]
},
  // banner管理
{
  path: '/banner',
  component: Layout,
  redirect: '/banner/table',
  name: 'Banner',
  meta: { title: 'Banner管理', icon: 'component' },
  children: [
    {
      path: 'table',
      name: 'BannerListPage',
      component: () => import('@/views/edu/banner/list'),
      meta: { title: 'Banner列表', noCache: true }
    },
    {
      path: 'save',
      name: 'BannerAddPage',
      component: () => import('@/views/edu/banner/save'),
      meta: { title: 'Banner编辑', noCache: true }
    },
    {
      path: 'edit/:id',
      name: 'BannerEditPage',
      component: () => import('@/views/edu/banner/save'),
      meta: { title: 'Banner编辑', noCache: true },
      hidden: true
    }
  ]
},
  // 统计分析
{
  path: '/statistics',
  component: Layout,
  redirect: '/statistics/create',
  name: 'Statistics',
  meta: { title: '统计管理', icon: 'chart' },
  children: [
    {
      path: 'create',
      name: 'StatisticsAddPage',
      component: () => import('@/views/edu/statistics/create'),
      meta: { title: '统计生成', noCache: true }
    },
    {
      path: 'chart',
      name: 'StatisticsChartPage',
      component: () => import('@/views/edu/statistics/chart'),
      meta: { title: '统计图表', noCache: true }
    }
  ]
},
  // 考试管理
{
  path: '/exam',
  component: Layout,
  redirect: '/exam/table',
  name: 'Exam',
  meta: { title: '考试管理', icon: 'exam' },
  children: [
    {
      path: 'table',
      name: 'ExamListPage',
      component: () => import('@/views/ems/exam/list'),
      meta: { title: '试卷列表', noCache: true }
    },
    {
      path: 'save',
      name: 'ExamAddPage',
      component: () => import('@/views/ems/exam/save'),
      meta: { title: '试卷创编', noCache: true }
    },
    {
      path: 'edit/:id',
      name: 'ExamEditPage',
      component: () => import('@/views/ems/exam/save'),
      meta: { title: '试卷编辑', noCache: true },
      hidden: true
    }
  ]
},
  // 题库管理
{
  path: '/question',
  component: Layout,
  redirect: '/question/table',
  name: 'Question',
  meta: { title: '题库管理', icon: 'question' },
  children: [
    {
      path: 'table',
      name: 'QuestionListPage',
      component: () => import('@/views/ems/question/list'),
      meta: { title: '题目列表', noCache: true }
    },
    {
      path: 'save',
      name: 'QuestionAddPage',
      component: () => import('@/views/ems/question/save'),
      meta: { title: '题目创编', noCache: true }
    },
    {
      path: 'edit/:questionType/:id',
      name: 'QuestionEditPage',
      component: () => import('@/views/ems/question/save'),
      meta: { title: '修改题目', noCache: true },
      hidden: true
    }
  ]
},
{
  path: '/acl',
  component: Layout,
  redirect: '/acl/user/list',
  name: '权限管理',
  meta: { title: '权限管理', icon: 'chart' },
  children: [
    {
      path: 'user/list',
      name: '用户管理',
      component: () => import('@/views/acl/user/list'),
      meta: { title: '用户管理' }
    },
    {
      path: 'role/list',
      name: '角色管理',
      component: () => import('@/views/acl/role/list'),
      meta: { title: '角色管理' }
    },
    {
      path: 'role/form',
      name: '角色添加',
      component: () => import('@/views/acl/role/form'),
      meta: { title: '角色添加' },
      hidden: true
    },
    {
      path: 'role/update/:id',
      name: '角色修改',
      component: () => import('@/views/acl/role/form'),
      meta: { title: '角色修改' },
      hidden: true
    },
    {
      path: 'role/distribution/:id',
      name: '角色权限',
      component: () => import('@/views/acl/role/roleForm'),
      meta: { title: '角色权限' },
      hidden: true
    },
    {
      path: 'menu/list',
      name: '菜单管理',
      component: () => import('@/views/acl/menu/list'),
      meta: { title: '菜单管理' }
    },
    {
      path: 'user/add',
      name: '用户添加',
      component: () => import('@/views/acl/user/form'),
      meta: { title: '用户添加' },
      hidden: true
    },
    {
      path: 'user/update/:id',
      name: '用户修改',
      component: () => import('@/views/acl/user/form'),
      meta: { title: '用户修改' },
      hidden: true
    },
    {
      path: 'user/role/:id',
      name: '用户角色',
      component: () => import('@/views/acl/user/roleForm'),
      meta: { title: '用户角色' },
      hidden: true
    }
  ]
},
{ path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// export default new Router({
//   // mode: 'history', //后端支持可开
//   scrollBehavior: () => ({ y: 0 }),
//   routes: constantRouterMap
// })

export default router
