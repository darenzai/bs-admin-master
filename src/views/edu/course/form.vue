<template>
  <div id="container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="active" process-status="success" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" icon="el-icon-edit"/>
      <el-step title="创建课程大纲" icon="el-icon-upload"/>
      <el-step title="提交审核" icon="el-icon-picture"/>
    </el-steps>

    <!-- 填写课程基本信息 -->
    <info v-if="active === 0" />

    <!-- 创建课程大纲 -->
    <chapter v-if="active === 1" />

    <!-- 发布课程 -->
    <publish v-if="active === 2 || active === 3" />

  </div>
</template>

<script>
// 引入子组件
import info from '@/views/edu/course/components/info'
import chapter from '@/views/edu/course/components/chapter'
import publish from '@/views/edu/course/components/publish'

export default {
  components: { info, chapter, publish }, // 注册子组件
  data() {
    // 这里存数据
    return {
      active: 0,
      courseId: null
    }
  },
  // 声明周期 - 创建完成（可以访问当前this实例）
  created() {
    // 获取路由id
    this.courseId = this.$route.params.id
    if (this.$route.name === 'CourseEditInfo') {
      this.active = 0
    }
    if (this.$route.name === 'CourseChapterEdit') {
      this.active = 1
    }
  }
}
</script>

<style scoped>
</style>
