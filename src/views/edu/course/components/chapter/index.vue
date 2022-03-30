<template>
  <div class="app-container">
    <!-- 添加章节按钮 -->
    <div>
      <el-button type="primary" @click="addChapter()">添加章节</el-button>
    </div>
    <!-- 章节列表 -->
    <div>
      <ul class="chapterList">
        <li v-for="chapter in chapterList" :key="chapter.id">
          <p>
            {{ chapter.title }}
            <span class="acts">
              <el-button type="text" @click="addVideoSection(chapter.id)">添加课时</el-button>
              <el-button type="text" @click="editChapter(chapter.id)">编辑</el-button>
              <el-button type="text" @click="removeChapterById(chapter.id)">删除</el-button>
            </span>
          </p>
          <!-- 视频 -->
          <ul class="chapterList videoList">
            <li v-for="video in chapter.children" :key="video.id">
              <p>
                {{ video.title }}
                <el-tag v-if="!video.videoSourceId" size="mini" type="danger">{{ '尚未上传视频' }}</el-tag>
                <span class="acts">
                  <el-tag v-if="video.free" size="mini" type="success">{{ '免费观看' }}</el-tag>
                  <el-button type="text" @click="editVideoSection(chapter.id, video.id)">编辑</el-button>
                  <el-button type="text" @click="removeVideoSectionById(video.id)">删除</el-button>
                </span>
              </p>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <!-- 章节表单对话框 -->
    <chapter-form ref="chapterForm" />

    <!-- 课时表单对话框 -->
    <video-form ref="videoSectionForm" />

    <div style="text-align:center">
      <el-button type="primary" @click="prev()">上一步</el-button>
      <el-button type="primary" @click="next()">下一步</el-button>
    </div>
  </div>
</template>

<script>
import chapterApi from '@/api/edu/chapter'
import videoSectionApi from '@/api/edu/video'

// 添加表单组件
import ChapterForm from '@/views/edu/course/components/chapter/form'
import VideoForm from '@/views/edu/course/components/Video/form'

export default {
  // 注册组件
  components: { ChapterForm, VideoForm },

  data() {
    return {
      chapterList: [],
      courseId: ''
    }
  },
  created() {
    // 保存课程id
    this.courseId = this.$parent.courseId
    // 获取章节列表
    this.getChapterList()
  },

  methods: {
    // 根剧课时id, 删除课时
    removeVideoSectionById(id) {
      this.$confirm('此操作将永久删除该课时，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          videoSectionApi.deleteVideoSectionById(id).then(response => {
            // 1. 提示消息
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            // 2. 刷新页面
            this.getChapterList()
          })
        })
        .catch(() => {})
    },
    // 修改课时
    editVideoSection(chapterId, videoId) {
      this.$refs.videoSectionForm.open(chapterId, videoId)
    },
    // 添加课时
    addVideoSection(chapterId) {
      this.$refs.videoSectionForm.open(chapterId)
    },
    // 修改章节
    editChapter(chapterId) {
      this.$refs.chapterForm.open(chapterId)
    },
    // 添加章节
    addChapter() {
      this.$refs.chapterForm.open()
    },
    // 根剧章节id, 删除章节
    removeChapterById(id) {
      this.$confirm('此操作将永久删除该章节，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          chapterApi.deleteChapterById(id).then(response => {
            // 1. 提示消息
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            // 2. 刷新页面
            this.getChapterList()
          })
        })
        .catch(() => {})
    },
    // 获取章节列表
    getChapterList() {
      console.log('课程id', this.$parent.courseId)
      chapterApi
        .getChapterInfoByCourseId(this.$parent.courseId)
        .then(response => {
          this.chapterList = response.data.chapterList
          console.log(this.chapterList)
        })
    },
    // 上一步
    prev() {
      this.$parent.active = 0
    },

    // 下一步
    next() {
      this.$parent.active = 2
    }
  }
}
</script>
<style>
.chapterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chapterList li {
  position: relative;
}
.chapterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chapterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}
.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dashed #ddd;
}
</style>
