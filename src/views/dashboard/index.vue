<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      roles:
      <span v-for="role in roles" :key="role">{{ role }}</span>
    </div>
    <el-card class="box-card">
      <div class="dashboard-text">欢迎你{{ name }}:</div>
      <div class="dashboard-text">
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span>欢迎来到教辅后台管理系统, 该系统包括讲师模块, 学科分类模块, 课程管理模块, 统计分析模块, Banner模块, 考试管理模块, 题库管理模块, 权限管理模块等..</span>
      </div>
      <div class="right" style="right">热爱生活, 热爱自己</div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 20px;
    line-height: 46px;
  }
}
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 480px;
}
.right {
  width: 300px;
  float: right;
  text-align: right;
  line-height: 60px;
  font-size: 20px;
}
</style>
