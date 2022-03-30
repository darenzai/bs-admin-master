<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="出卷老师">
        <el-select v-model="exam.teacherId" clearable placeholder="选择老师">
          <el-option v-for="teacher in teacherList" :key="teacher.id" :value="teacher.id" :label="teacher.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="试卷类型">
        <el-select v-model="exam.type" clearable placeholder="请选择试卷类型">
          <el-option :value="1" label="期末考试" />
          <el-option :value="2" label="单元测试" />
        </el-select>
        <el-select v-model="exam.courseId" clearable placeholder="选择课程" @change="getChapterEvent(exam.courseId)">
          <el-option v-for="course in courseList" :key="course.id" :value="course.id" :label="course.title" />
        </el-select>
        <el-select v-if="exam.type == 2" v-model="exam.chapterId" clearable placeholder="选择章节">
          <el-option v-for="chapter in chapterList" :key="chapter.id" :value="chapter.id" :label="chapter.title" />
        </el-select>
      </el-form-item>
      <el-form-item label="考试名称">
        <el-input v-model="exam.title" />
      </el-form-item>
      <el-form-item label="考试总分">
        <el-input v-model="exam.totalScore" />
      </el-form-item>
      <el-form-item label="考试时长">
        <el-input v-model="exam.totalTime" />
      </el-form-item>
      <el-form-item v-for="(titleItem,index) in exam.titleItems" :key="index" :label="'标题'+(index+1)+'：'" required>
        <el-input v-model="titleItem.name" style="width: 80%"/>
        <el-button type="text" class="link-left" style="margin-left: 20px" size="mini" @click="addQuestion(titleItem)">
          添加题目
        </el-button>
        <el-button type="text" class="link-left" size="mini" @click="exam.titleItems.splice(index,1)">删除</el-button>
        <el-card v-if="titleItem.questionItems.length!==0" class="exampaper-item-box">
          <el-form-item
            v-for="(questionItem,questionIndex) in titleItem.questionItems"
            :key="questionIndex"
            :label="'题目'+(questionIndex+1)+'：'"
            style="margin-bottom: 15px">
            <el-row>
              <el-col :span="23">
                <span v-if="questionItem.questionType === '1' || questionItem.questionType === '2'">
                  {{ questionItem.question }} <br>
                  A.&nbsp;{{ questionItem.answerA }}&nbsp;&nbsp;
                  B.&nbsp;{{ questionItem.answerB }}&nbsp;&nbsp;
                  C.&nbsp;{{ questionItem.answerC }}&nbsp;&nbsp;
                  D.&nbsp;{{ questionItem.answerD }}&nbsp;&nbsp;
                </span>
                <span v-if="questionItem.questionType === '3'">
                  {{ questionItem.question }}  (正确, 错误)
                </span>
                <span v-if="questionItem.questionType === '4' || questionItem.questionType === '5'">
                  {{ questionItem.question }}
                </span>
              </el-col>
              <el-col :span="1">
                <el-button type="text" size="mini" @click="titleItem.questionItems.splice(questionIndex,1)">删除
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-card>
      </el-form-item>
      <el-form-item label="截止时间">
        <el-date-picker
          v-model="exam.stopTime"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button type="success" @click="addTitle">添加标题</el-button>
        </el-form-item>
      </el-form-item>
    </el-form>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible " width="70%">
      <el-form ref="queryForm" :inline="true">
        <el-form-item label="题型：">
          <el-select v-model="queryObj.questionType" placeholder="请选择题型" >
            <el-option v-for="type in questionType" :key="type.value" :value="type.value" :label="type.label"/>
          </el-select>
        </el-form-item>
        <el-form-item label="ID：">
          <el-input v-model="queryObj.id" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchPageData(1)">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格 -->
      <el-table
        v-loading="listLoading"
        :data="questionList"
        element-loading-text="数据加载中"
        border
        stripe
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="45"/>
        <el-table-column label="序号" width="55px" align="center">
          <template slot-scope="scope">{{ (pageParams.page - 1) * pageParams.limit + scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="题型" width="75px">
          <template slot-scope="scope">
            <span v-if="scope.row.questionType == 1">单选题</span>
            <span v-if="scope.row.questionType == 2">多选题</span>
            <span v-if="scope.row.questionType == 3">判断题</span>
            <span v-if="scope.row.questionType == 4">填空题</span>
            <span v-if="scope.row.questionType == 5">简答题</span>
          </template>
        </el-table-column>
        <el-table-column prop="question" label="题干"/>
      </el-table>
      <!-- 分页插件 -->
      <el-pagination
        :current-page="pageParams.page"
        :page-size="pageParams.limit"
        :total="pageParams.total"
        background
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="fetchPageData"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmQuestionSelect">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import teacherApi from '@/api/edu/teacher'
import courseApi from '@/api/edu/course'
import chapterApi from '@/api/edu/chapter'
import paperApi from '@/api/ems/paper'
import examApi from '@/api/ems/exam'
export default {
  data() {
    return {
      dialogVisible: false, // 对话框
      queryObj: {
        questionType: '',
        id: ''
      },
      pageParams: {
        page: 1,
        limit: 5,
        total: 0
      },
      listLoading: true,
      multipleSelection: [],
      exam: {
        id: '',
        teacherId: '',
        type: '',
        courseId: '',
        chapterId: '',
        title: '',
        totalScore: null,
        totalTime: '',
        stopTime: '',
        titleItems: []
      },
      currentTitleItem: null, // 标题名称
      questionList: [], // 查询的题目数据
      teacherList: [],
      courseList: [],
      chapterList: [],
      questionType: [{
        value: '1',
        label: '单选题'
      }, {
        value: '2',
        label: '多选题'
      }, {
        value: '3',
        label: '判断题'
      }, {
        value: '4',
        label: '填空题'
      }, {
        value: '5',
        label: '简答题'
      }]
    }
  },
  // 监听,当路由发生变化的时候执行
  // vue-router导航切换 时，如果两个路由都渲染同个组件，组件会重用
  watch: {
    $route(to, from) {
      this.resetForm()
    }
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.select(this.$route.params.id)
    }
    // 1. 初始化讲师
    this.getTeacherList()

    // 2. 初始话课程
    this.getCourseList()
  },
  methods: {
    // 提交
    submitForm() {
      examApi.edit(this.exam).then(response => {
        // 1. 提示信息
        this.$message({
          type: 'success',
          message: '成功'
        })
        // 2. 路由到试卷列表页面
        this.$router.push({
          path: '/exam/table'
        })
      })
    },
    // 重置
    resetForm() {
      this.exam = {}
    },
    select(id) {
      examApi.select(id).then(response => {
        this.exam = response.data.examVo
      })
    },
    // 添加主题
    addTitle() {
      this.exam.titleItems.push({
        name: '',
        questionItems: []
      })
    },
    // 选中多选框点击确认！！！
    confirmQuestionSelect() {
      this.multipleSelection.forEach(item => {
        paperApi.select(item.questionType, item.id).then(response => {
          this.currentTitleItem.questionItems.push(response.data.questionVo)
        })
      })
      this.dialogVisible = false
    },
    // 选择对话框的中多选框触发的事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 初始化页面数据
    fetchPageData(page = 1) {
      // 拿到传入的age, 赋值给本地值
      this.pageParams.page = page
      // debugger
      paperApi.pageList(this.queryObj, this.pageParams.page, this.pageParams.limit).then(response => {
        this.pageParams.total = response.data.total
        this.questionList = response.data.records
        this.listLoading = false
      })
    },
    // 初始化讲师
    getTeacherList() {
      teacherApi.getAllTeachers().then(response => {
        this.teacherList = response.data.teacherList
      })
    },
    // 初始化课程
    getCourseList() {
      courseApi.getCourseList().then(response => {
        this.courseList = response.data.courseList
      })
    },
    // 初始化可章节
    getChapterList(id) {
      chapterApi.getChapterByCourseId(id).then(response => {
        this.chapterList = response.data.chapterList
      })
    },
    // 课程选择事件,
    getChapterEvent(id) {
      if (this.exam.type === 2) {
        this.getChapterList(id)
      }
    },
    // 移除主题事件
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    // 添加题目事件
    addQuestion(titleItem) {
      // console.log('titleItem:', titleItem)
      this.currentTitleItem = titleItem
      this.dialogVisible = true
      this.fetchPageData()
    }
  }
}
</script>
