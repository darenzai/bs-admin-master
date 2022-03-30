<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item style="width:200px">
        <!-- <el-input v-model="searchObj.name" placeholder="讲师名" /> -->
        <!-- TODO 完成该方法 querySearch -->
        <el-autocomplete
          v-model="searchObj.title"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          class="inline-input"
          placeholder="考试名称"
          value-key="title"
        />
      </el-form-item>
      <el-form-item style="width:160px">
        <el-select v-model="searchObj.courseId" clearable placeholder="课程名称">
          <el-option v-for="course in courseList" :key="course.id" :value="course.id" :label="course.title" />
        </el-select>
      </el-form-item>
      <el-form-item style="width:160px">
        <el-select v-model="searchObj.teacherId" clearable placeholder="出卷老师">
          <el-option v-for="teacher in teacherList" :key="teacher.id" :value="teacher.id" :label="teacher.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间">
        <el-date-picker
          v-model="searchObj.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchObj.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格-->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      stripe
      fit
      highlight-current-row
    >
      <el-table-column label="#" width="60" align="center">
        <template slot-scope="scope">{{ (page - 1) * limit + scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="title" label="考试名称" />
      <el-table-column prop="totalTime" label="考试时长" width="80" />
      <el-table-column prop="totalScore" label="考试总分" width="80" />
      <el-table-column prop="stopTime" label="截止日期" width="160" />
      <el-table-column prop="gmtCreate" label="创建日期" width="160" />
      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <!-- <el-button type="info" size="mini" icon="el-icon-view" @click="show(scope.row.id)">预览</el-button> -->
          <router-link :to="'/exam/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页插件 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />
  </div>
</template>
<script>
import examApi from '@/api/ems/exam'
import teacherApi from '@/api/edu/teacher'
import courseId from '@/api/edu/course'
export default {
  data() {
    return {
      listLoading: true, // 是否显示loading信息
      list: null, // 数据列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 10, // 每页记录数
      searchObj: {}, // 查询条件
      courseList: [], // 课程列表
      teacherList: [] // 讲师列表
    }
  },
  created() {
    // 1. 获取试卷列表
    this.fetchData()
    // 2. 获取讲师列表
    this.fetchTeacherData()
    // 3. 获取课程列表
    this.fetchCourseData()
  },
  methods: {
    // 1. 页面初始化获取数据
    fetchData(page = 1) {
      this.page = page
      this.listLoading = true
      examApi.getExamListByConditionPage(this.searchObj, this.page, this.limit).then(response => {
        this.list = response.data.recodes
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // show(id) {
    //   console.log('id:', id)
    //   examApi.select(id).then(response => {
    //   })
    // },
    // 2. 获取讲师列表
    fetchTeacherData() {
      teacherApi.getAllTeachers().then(response => {
        this.teacherList = response.data.teacherList
      })
    },
    // 3. 获取课程列表
    fetchCourseData() {
      courseId.getCourseList().then(response => {
        this.courseList = response.data.courseList
      })
    },
    // 4. 考试名称动态的查询
    querySearch(queryString, cb) {
      examApi.getExamTitleListByKey(queryString)
        .then(response => {
          cb(response.data.examTitleList)
        })
    },
    // 5. 清空数据
    resetData() {
      // 1. 清空查询条件,
      this.searchObj = {}
      // 2. 刷新页面
      this.fetchData()
    },
    // 6. 移除试卷
    removeDataById(id) {
      // 1. deleteExamById
      this.$confirm('此操作将删除该考试, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          examApi.deleteExamById(id).then(response => {
            // 1. 刷新页面
            this.fetchData()
            // 2. 提示讲师删除成功
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        })
        .catch(() => {})
    }
  }
}
</script>
