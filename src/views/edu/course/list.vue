<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="searchObj.subjectParentId"
          placeholder="请选择"
          @change="subjectLevelOneChanged"
        >
          <el-option
            v-for="subject in oneLevelSubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="searchObj.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in twoLevelSubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>

      <!-- 标题 -->
      <el-form-item>
        <el-input v-model="searchObj.title" placeholder="课程标题" />
      </el-form-item>
      <!-- 讲师 -->
      <el-form-item>
        <el-select v-model="searchObj.teacherId" placeholder="请选择讲师">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table :data="list" border stripe>
      <el-table-column label="#" width="50" align="center">
        <template slot-scope="scope">{{ (page - 1) * limit + scope.$index + 1 }}</template>
      </el-table-column>

      <el-table-column label="封面" width="200" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.cover" alt="scope.row.title" width="100%" >
        </template>
      </el-table-column>
      <el-table-column label="课程信息">
        <template slot-scope="scope">
          <a href="#">{{ scope.row.title }}</a>
          <p>分类：{{ scope.row.subjectParentTitle }} > {{ scope.row.subjectTitle }}</p>
          <p>
            课时：{{ scope.row.lessonNum }} /
            浏览：{{ scope.row.viewCount }} /
            付费学员：{{ scope.row.buyCount }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="讲师" width="100" align="center">
        <template slot-scope="scope">{{ scope.row.teacherName }}</template>
      </el-table-column>
      <el-table-column label="价格(元)" width="100" align="center">
        <template slot-scope="scope">
          <!-- {{ typeof '0' }}  {{ typeof 0 }} {{ '0' == 0 }} -->
          <!-- {{ typeof scope.row.price }}
          {{ typeof Number(scope.row.price) }}
          {{ typeof Number(scope.row.price).toFixed(2) }}-->

          <el-tag v-if="Number(scope.row.price) === 0" type="success">免费</el-tag>

          <!-- 前端解决保留两位小数的问题 -->
          <!-- <el-tag v-else>{{ Number(scope.row.price).toFixed(2) }}</el-tag> -->

          <!-- 后端解决保留两位小数的问题，前端不用处理 -->
          <el-tag v-else>{{ scope.row.price }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="课程状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 'Draft' ? 'warning' : 'success'"
          >{{ scope.row.status === 'Draft' ? '未发布' : '已发布' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="120" align="center">
        <!-- 创建时间截取10位 -->
        <template slot-scope="scope">{{ scope.row.gmtCreate.substr(0, 10) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <router-link :to="'/course/chapter/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑大纲</el-button>
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeById(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 30px 0; text-align: center;"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="changePageSize"
      @current-change="changeCurrentPage"
    />
  </div>
</template>
<script>
import courseApi from '@/api/edu/course'
import teacherApi from '@/api/edu/teacher'
import subjectApi from '@/api/edu/subject'

export default {
  data() {
    return {
      list: [], // 课程列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 10, // 每页记录数
      searchObj: {
        subjectId: '' // 解决查询表单无法选中二级类别
      }, // 查询条件
      teacherList: [], // 讲师列表
      oneLevelSubjectList: [], // 一级分类列表
      twoLevelSubjectList: [] // 二级分类列表,
    }
  },

  created() {
    this.fetchData()
    // 初始化分类列表
    this.initSubjectList()
    // 获取讲师列表
    this.initTeacherList()
  },

  methods: {
    // 根剧id删除课程方法,
    removeById(id) {
      this.$confirm('此操作将永久删除该课程，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 根剧课程id, 删除课程
        courseApi.deleteCourseById(id).then(reponse => {
          // 1. 提示信息
          this.$message({
            type: 'success',
            message: '删除课程成功'
          })
          // 2. 刷新页面
          this.fetchData()
        })
      }).catch(() => {

      })
    },
    // 根剧条件获取课程列表
    fetchData() {
      courseApi
        .getCourseListByCondition(this.searchObj, this.page, this.limit)
        .then(response => {
          this.list = response.data.courseList
          this.total = response.data.total
        })
    },
    // 初始化讲师列表
    initTeacherList() {
      teacherApi.getAllTeachers().then(response => {
        this.teacherList = response.data.teacherList
      })
    },
    // 初始化学科列表
    initSubjectList() {
      subjectApi.getAllSubjects().then(response => {
        this.oneLevelSubjectList = response.data.subjects
      })
    },
    // 学科级别切换触发的事件
    subjectLevelOneChanged(value) {
      for (let i = 0; i < this.oneLevelSubjectList.length; i++) {
        if (this.oneLevelSubjectList[i].id === value) {
          this.twoLevelSubjectList = this.oneLevelSubjectList[i].childs
          this.searchObj.subjectId = ''
        }
      }
    },

    // 每页记录数改变，size：回调参数，表示当前选中的“每页条数”
    changePageSize(size) {
      this.limit = size
      this.fetchData()
    },

    // 改变页码，page：回调参数，表示当前选中的“页码”
    changeCurrentPage(page) {
      this.page = page
      this.fetchData()
    },

    // 重置表单
    resetData() {
      this.searchObj = {}
      this.twoLevelSubjectList = [] // 二级分类列表
      this.fetchData()
    }

  }
}
</script>
