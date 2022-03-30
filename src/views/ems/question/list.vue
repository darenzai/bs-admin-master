<template>
  <div class="app-container">
    <!-- 表单 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="学科：">
        <el-select v-model="queryObj.subjectParentId" placeholder="一级学科" @change="changeSubjectEvent">
          <el-option v-for="oneSubject in oneLevelSubjectList" :key="oneSubject.id" :label="oneSubject.title" :value="oneSubject.id"/>
        </el-select>
        <el-select v-model="queryObj.subjectId" placeholder="二级学科">
          <el-option v-for="twoSubject in twoLevelSubjectList" :key="twoSubject.id" :label="twoSubject.title" :value="twoSubject.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="题型：">
        <el-select v-model="queryObj.questionType" placeholder="请选择题型" >
          <el-option v-for="type in questionType" :key="type.value" :value="type.value" :label="type.label"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if=" queryObj.questionType != null" label="题目ID：">
        <el-input v-model="queryObj.id" />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="fetchPageData()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
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
    >
      <el-table-column label="#" width="55px" align="center">
        <template slot-scope="scope">{{ (page - 1) * limit + scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="学科" width="170px">
        <template slot-scope="scope">
          一级学科: {{ scope.row.subjectParentTitle }}<br>
          二级学科: {{ scope.row.subjectTitle }}
        </template>
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
      <el-table-column label="分数" width="60px">
        <template slot-scope="scope">
          {{ scope.row.score }}分
        </template>
      </el-table-column>
      <el-table-column label="难度" width="150px">
        <template slot-scope="scope">
          <el-rate
            v-model="scope.row.level"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"/>
        </template>
      </el-table-column>
      <el-table-column prop="gmtCreate" label="创建日期" width="160" />
      <el-table-column label="操作" width="300px" align="center">
        <template slot-scope="scope">
          <el-button type="info" size="mini" icon="el-icon-view" @click="show(scope.row.questionType, scope.row.id)">预览</el-button>
          <router-link :to="'/question/edit/'+scope.row.questionType+'/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id, scope.row.questionType)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页插件 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      background
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchPageData"/>
    <!-- 对话框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="title"
      width="40%">
      <span v-if="paper.questionType == '1' || paper.questionType == '2'">
        {{ paper.question }}&nbsp;&nbsp;&nbsp;&nbsp;<br>
        A.&nbsp;{{ paper.answerA }}<br>
        B.&nbsp;{{ paper.answerB }}<br>
        C.&nbsp;{{ paper.answerC }}<br>
        D.&nbsp;{{ paper.answerD }}
      </span>
      <span v-if="paper.questionType == '4' || paper.questionType == '5'">
        {{ paper.question }}
      </span>
      <span v-if="paper.questionType == '3'">
        {{ paper.question }}&nbsp;&nbsp;&nbsp;&nbsp;(正确, 错误)
      </span>
    </el-dialog>
  </div>
</template>
<script>
import subjectApi from '@/api/edu/subject'
import paperApi from '@/api/ems/paper'
export default {
  data() {
    return {
      queryObj: {
        subjectParentId: '',
        subjectId: '',
        questionType: '',
        id: ''
      },
      paper: {

      },
      dialogVisible: false, // 对话框按钮
      title: '', // 对话框标题
      oneLevelSubjectList: [],
      twoLevelSubjectList: [],
      page: 1,
      limit: 10,
      total: 0,
      listLoading: true, // 默认
      questionList: null, // 列表数据
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
  created() {
    // 1. 发送请求获取题库页面数据
    this.fetchPageData()
    // 2. 初始化学科列表
    this.fetchSubjectData()
  },
  methods: {
    // 初始化页面数据
    fetchPageData(page = 1) {
      // 拿到传入的age, 赋值给本地值
      this.page = page
      paperApi.pageList(this.queryObj, this.page, this.limit).then(response => {
        this.total = response.data.total
        this.questionList = response.data.records
        this.listLoading = false
      })
    },
    // 获取学科数据
    fetchSubjectData() {
      subjectApi.getAllSubjects().then(response => {
        this.oneLevelSubjectList = response.data.subjects
      })
    },
    // 删除题目根据题目ID 和 题目类型
    removeDataById(id, questionType) {
      this.$confirm('你确定要删除该题目吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        paperApi.delete(questionType, id).then(response => {
          this.$message({
            message: '删除题目成功',
            type: 'success'
          })
          this.fetchPageData()
        })
      }).cancel(() => {})
    },
    // 切换一级学科事件
    changeSubjectEvent(val) {
      for (var i = 0; i < this.oneLevelSubjectList.length; i++) {
        if (val === this.oneLevelSubjectList[i].id) {
          if (this.queryObj.subjectId != null) {
            this.queryObj.subjectId = ''
          }
          this.twoLevelSubjectList = this.oneLevelSubjectList[i].childs
        }
      }
    },
    show(questionType, id) {
      // 1. 设置对话框主题
      if (questionType === '1') {
        this.title = '单选题'
      } else if (questionType === '2') {
        this.title = '多选题'
      } else if (questionType === '3') {
        this.title = '判断题'
      } else if (questionType === '4') {
        this.title = '填空题'
      } else {
        this.title = '简答题'
      }
      // 2. 获取改题目的数据
      paperApi.select(questionType, id).then(response => {
        this.paper = response.data.questionVo
      })
      this.dialogVisible = true
    },
    // 重置
    resetData() {
      // 清空查询条件
      this.queryObj = {}
      // 刷新页面
      this.fetchPageData()
    }
  }
}
</script>
