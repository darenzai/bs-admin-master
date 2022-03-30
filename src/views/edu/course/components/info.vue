<template>
  <div class="app-container">
    <!-- 课程信息表单 -->
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写" />
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <!-- 所属分类 -->
      <el-form-item label="课程所属学科">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="请选择"
          @change="getTwoLevelSubjectByChange"
        >
          <el-option
            v-for="oneSubject in oneLevelSubjectList"
            :key="oneSubject.id"
            :label="oneSubject.title"
            :value="oneSubject.id"
          />
        </el-select>
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
          <el-option
            v-for="twoSubject in twoLevelSubjectList"
            :key="twoSubject.id"
            :label="twoSubject.title"
            :value="twoSubject.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介 -->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>

      <!-- 课程封面 -->
      <el-form-item label="课程封面">
        <el-upload
          :on-success="handleCoverSuccess"
          :before-upload="beforeCoverUpload"
          :on-error="handleCoverError"
          :action="BASE_API+'/api/thirdparty/oss/get/url'"
          class="cover-uploader"
        >
          <img v-if="courseInfo.cover" :src="courseInfo.cover" >
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />元
      </el-form-item>
    </el-form>

    <div style="text-align:center">
      <el-button :disabled="saveBtnDisabled" type="primary" @click="saveAndUpdateCourseInfo()">保存并下一步</el-button>
    </div>
  </div>
</template>

<script>
import courseApi from '@/api/edu/course'
import teacherApi from '@/api/edu/teacher'
import subjectApi from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce'

export default {
  components: { Tinymce },
  data() {
    return {
      BASE_API: process.env.BASE_API,
      saveBtnDisabled: false, // 按钮是否禁用
      courseInfo: {
        price: 0,
        lessonNum: 0,
        teacherId: '',
        subjectId: '',
        subjectParentId: '',
        cover: '',
        description: ''
      },
      teacherList: [], // 讲师列表
      oneLevelSubjectList: [], // 一级学科
      twoLevelSubjectList: [] // 二级学科
    }
  },

  created() {
    if (this.$parent.courseId) {
      // 1. 回显课程信息
      this.getCourseInfoById(this.$parent.courseId)
    } else {
      // 2. 初始化学科
      this.initOneSubjects()
    }
    // 1. 初始化讲师
    this.initTeachers()
  },

  methods: {
    // 初始化讲师
    initTeachers() {
      teacherApi.getAllTeachers().then(response => {
        this.teacherList = response.data.teacherList
      })
    },
    // 初始化学科, 获取所有学科
    initOneSubjects() {
      subjectApi.getAllSubjects().then(response => {
        this.oneLevelSubjectList = response.data.subjects
      })
    },
    // 根据课程id, 获取课程信息
    getCourseInfoById(courseId) {
      courseApi.getCourseById(courseId).then(response => {
        // 1. 保存课程信息
        this.courseInfo = response.data.courseInfoVo

        // 2. 发送请求获取学科的所有信息
        subjectApi.getAllSubjects().then(response => {
          this.oneLevelSubjectList = response.data.subjects
          this.oneLevelSubjectList.forEach(item => {
            if (item.id === this.courseInfo.subjectParentId) {
              this.twoLevelSubjectList = item.childs
            }
          })
        })
      })
    },
    // 通过该值, 查询所在的所有二级分类
    getTwoLevelSubjectByChange(value) {
      this.oneLevelSubjectList.forEach(item => {
        if (item.id === value) {
          // 传入的值, 等于该item的值
          this.courseInfo.subjectId = ''
          this.twoLevelSubjectList = item.childs
        }
      })
    },
    // 保存并下一步
    saveAndUpdateCourseInfo() {
      // 1. 禁止保存按钮
      this.saveBtnDisabled = true
      if (this.$parent.courseId || this.$route.params.id) {
        this.updateCourseInfo()
      } else {
        this.saveCourseInfo()
      }
    },
    // 保存课程信息
    saveCourseInfo() {
      // 2. 发送请求保存课程信息
      courseApi.saveCourseInfo(this.courseInfo).then(response => {
        // 3. 提示消息
        this.$message({
          type: 'success',
          message: '保存课程信息成功'
        })
        // 4. 获取课程的id, 保存给父组件的课程id
        this.$parent.courseId = response.data.courseId

        this.$parent.active = 1
      })
    },
    // 修改课程信息
    updateCourseInfo() {
      courseApi.updateCourseInfo(this.courseInfo).then(response => {
        // 提示信息
        this.$message({
          type: 'success',
          message: '修改课程信息成功'
        })
        this.$parent.active = 1
      })
    },

    // 上传成功回调
    handleCoverSuccess(res, file) {
      if (res.success) {
        // console.log(res)
        this.courseInfo.cover = res.data.url
        // 强制重新渲染
        this.$forceUpdate()
      } else {
        this.$message.error('上传失败1')
      }
    },

    // 上传校验
    beforeCoverUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    // 错误处理
    handleCoverError() {
      console.log('error')
      this.$message.error('上传失败2')
    }
  }
}
</script>
<style>
.tinymce-container {
  position: relative;
  line-height: normal;
}
.cover-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.cover-uploader .el-upload:hover {
  border-color: #409eff;
}
.cover-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 640px;
  height: 357px;
  line-height: 357px;
  text-align: center;
}
.cover-uploader img {
  width: 640px;
  height: 357px;
  display: block;
}
</style>
