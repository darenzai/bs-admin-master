<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="学科：" required>
        <el-select v-model="paper.subjectParentId" placeholder="一级学科" @change="getTwoSubjects" >
          <el-option v-for="item in oneSubjectList" :key="item.id" :value="item.id" :label="item.title"/>
        </el-select>
        <el-select v-model="paper.subjectId" placeholder="二级学科" >
          <el-option v-for="item in twoSubjectList" :key="item.id" :value="item.id" :label="item.title"/>
        </el-select>
      </el-form-item>
      <el-form-item label="题目类型：" required>
        <el-select v-if="!paper.id" v-model="paper.questionType" clearable placeholder="选择题目类型" >
          <el-option v-for="type in questionType" :key="type.value" :value="type.value" :label="type.label"/>
        </el-select>
        <el-select v-else v-model="paper.questionType" disabled clearable placeholder="选择题目类型" >
          <el-option v-for="type in questionType" :key="type.value" :value="type.value" :label="type.label"/>
        </el-select>
      </el-form-item>
      <!-- 题干 -->
      <el-form-item label="题干：" required>
        <el-input v-if="paper.questionType != 4" v-model="paper.question" placeholder="请输入内容" />
        <el-input v-else v-model="paper.question" placeholder="注意：该题干的形式, 例如: 从计算机网络系统组成的角度看，计算机网络可以分为()和()。注意需要考生答题部分一定要用括号（英文半角）括起来。" />
      </el-form-item>
      <el-form-item v-if="paper.questionType == 1" label="选项：" required><br>
        <el-button type="info" circle>A</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-input v-model="paper.answerA" placeholder="请输入内容" style="width:600px;" /><br>
        <el-button type="info" circle>B</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-input v-model="paper.answerB" placeholder="请输入内容" style="width:600px;" /><br>
        <el-button type="info" circle>C</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-input v-model="paper.answerC" placeholder="请输入内容" style="width:600px;" /><br>
        <el-button type="info" circle>D</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-input v-model="paper.answerD" placeholder="请输入内容" style="width:600px;" /><br>
      </el-form-item>
      <el-form-item v-if="paper.questionType == 2" label="选项：" required><br>
        <el-button type="info" circle>A</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-input v-model="paper.answerA" placeholder="请输入内容" style="width:600px;" /><br>
        <el-button type="info" circle>B</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-input v-model="paper.answerB" placeholder="请输入内容" style="width:600px;" /><br>
        <el-button type="info" circle>C</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-input v-model="paper.answerC" placeholder="请输入内容" style="width:600px;" /><br>
        <el-button type="info" circle>D</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-input v-model="paper.answerD" placeholder="请输入内容" style="width:600px;" /><br>
      </el-form-item>
      <el-form-item v-if="paper.questionType == 3" label="标答：" required><br>
        <el-radio v-model="paper.answer" label="1">正确</el-radio>
        <el-radio v-model="paper.answer" label="2">错误</el-radio>
      </el-form-item>
      <el-form-item v-if="paper.questionType == 4" label="标答：" required>
        <el-input v-model="paper.answer" placeholder="注意: 答案按照  、 分隔开！！！" style="width:600px;" />
      </el-form-item>
      <el-form-item v-if="paper.questionType == 5" label="标答：" required>
        <el-input v-model="paper.answer" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item v-if="paper.questionType == 1" label="标答：" required>
        <el-radio v-model="paper.rightKey" label="A">A</el-radio>
        <el-radio v-model="paper.rightKey" label="B">B</el-radio>
        <el-radio v-model="paper.rightKey" label="C">C</el-radio>
        <el-radio v-model="paper.rightKey" label="D">D</el-radio>
      </el-form-item>
      <el-form-item v-if="paper.questionType == 2" label="标答：" required>
        <el-checkbox-group v-model="paper.rightKeyArray">
          <el-checkbox label="A"/>
          <el-checkbox label="B"/>
          <el-checkbox label="C"/>
          <el-checkbox label="D"/>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="解析：" required>
        <el-input v-model="paper.analysis" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="分数：" required>
        <el-input-number v-model="paper.score" :precision="2" :step="1" :max="100"/>
      </el-form-item>
      <el-form-item label="难度：" required>
        <el-rate v-model="paper.level" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveOrUpdate">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import subjectApi from '@/api/edu/subject'
import paperApi from '@/api/ems/paper'
export default {
  data() {
    return {
      paper: {
        subjectId: '',
        subjectParentId: '',
        questionType: '',
        analysis: '',
        answer: '',
        score: 0,
        level: 0,
        question: '',
        rightKey: '',
        rightKeyArray: []
      },
      oneSubjectList: [],
      twoSubjectList: [],
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
      this.initForm()
    }
  },
  created() {
    // 1. 判断是否存在路由参数, 如果存在则表示是一个更新操作, 是否是一个保存操作
    if (this.$route.params && this.$route.params.id != null && this.$route.params.questionType != null) {
      this.paper.id = this.$route.params.id
      this.paper.questionType = this.$route.params.questionType
      this.getQuestionInfoById(this.paper.questionType, this.paper.id)
    } else {
      // 获取学科数据
      this.fetchSubjectData()
    }
  },
  methods: {
    // 获取所有学科
    fetchSubjectData() {
      subjectApi.getAllSubjects().then(response => {
        this.oneSubjectList = response.data.subjects
      })
    },
    // 切换一级学科事件, 获取二级学科
    getTwoSubjects(val) {
      // val为一级学科的id
      this.oneSubjectList.forEach(item => {
        if (item.id === val) {
          // 传入的值, 等于该item的值
          if (this.paper.subjectId != null) {
            this.paper.subjectId = ''
          }
          this.twoSubjectList = item.childs
        }
      })
    },
    // 根据题目Id查询题目信息
    getQuestionInfoById(questionType, id) {
      paperApi.select(questionType, id).then(response => {
        this.paper = response.data.questionVo
        if (questionType === '2') { // 多选题, 回显选项时需要处理一下
          // 1. 解决回显问题
          var str = response.data.questionVo.rightKey
          this.paper.rightKeyArray = str.split(',')
          // 2. 清空当前的rightKey
          this.paper.rightKey = ''
        }
        // 2. 发送请求获取学科的所有信息
        subjectApi.getAllSubjects().then(response => {
          this.oneSubjectList = response.data.subjects
          this.oneSubjectList.forEach(item => {
            if (this.paper.subjectParentId === item.id) {
              this.twoSubjectList = item.childs
            }
          })
        })
      })
    },
    // 提交表单数据
    saveOrUpdate() {
      paperApi.edit(this.paper).then(response => {
        if (!this.paper.id) {
          this.$message({
            type: 'success',
            message: '插入题库成功'
          })
        } else {
          this.$message({
            type: 'success',
            message: '更新题目成功'
          })
        }
        // 2. 路由到 题库列表
        this.$router.push({
          path: '/question/table'
        })
      })
    },
    // 初始化表单
    initForm() {
      this.paper = {}
    },
    // 重置按钮
    resetForm() {
      this.paper.subjectParentId = ''
      this.paper.subjectId = ''
      this.paper.analysis = ''
      this.paper.score = 0
      this.paper.level = 0
      this.paper.answer = ''
      this.paper.answerA = ''
      this.paper.answerB = ''
      this.paper.answerC = ''
      this.paper.answerD = ''
      this.paper.question = ''
      this.paper.rightKey = ''
      // console.log('this.paper.rightKey:', this.paper.rightKey)
      this.paper.rightKeyArray = []
      // console.log('this.paper.rightKeyArray:', this.paper.rightKeyArray)
    }
  }
}
</script>
<style scoped>
  .eleA {
    color: red,
  }
</style>
