<template>
  <!-- 添加和修改课时表单 -->
  <el-dialog :visible="dialogVisible" :title="title?'修改课时':'添加课时'" @close="close()">
    <el-form :model="videoSection" label-width="120px">
      <el-form-item label="课时标题">
        <el-input v-model="videoSection.title" />
      </el-form-item>
      <el-form-item label="课时排序">
        <el-input-number v-model="videoSection.sort" :min="0" />
      </el-form-item>
      <el-form-item label="是否免费">
        <el-radio-group v-model="videoSection.isFree">
          <el-radio :label="true">免费</el-radio>
          <el-radio :label="false">默认</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 上传视频
        ref(key)： 注册ref, 可以通过this.$ref.value 找到改元素
        auto-upload: 是否自动上传
        before-remove： 删除视频文件确认, 删除事情之前
        on-remove: 执行文件的删除
        on-success: 上传视频成功的回调
        on-error: 上传视频失败的回调
       -->
      <el-form-item label="上传视频">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :before-remove="handleBeforeRemove"
          :on-remove="handleOnRemove"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :on-exceed="handleUploadExceed"
          :file-list="fileList"
          :limit="1"
          :action="BASE_API + '/api/thirdparty/vod/update/file'"
        >
          <el-button slot="trigger" size="small" type="primary">选择视频</el-button>
          <el-button
            :disabled="uploadBtnDisabled"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload()"
          >上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import videoSectionApi from '@/api/edu/video'
// 导入vodApi
import vodApi from '@/api/thirdparty/vod'

export default {
  data() {
    return {
      BASE_API: process.env.BASE_API, // 请求路径
      dialogVisible: false, // 对话框控制
      videoSection: {
        // 视频小节
        sort: 0,
        free: false
      },
      title: false, // 控制对话框主题
      fileList: [], // 上传文件列表
      uploadBtnDisabled: false // 上传按钮控制
    }
  },

  methods: {
    // 删除视频文件确认
    handleBeforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 执行视频文件的删除
    handleOnRemove(file, fileList) {
      if (!this.videoSection.videoSourceId) {
        return
      }
      vodApi.deleteVideById(this.videoSection.videoSourceId).then(response => {
        // 初始化参数
        this.videoSection.videoSourceId = ''
        this.videoSection.videoOriginalName = ''
        // 发送请求更新章节列表
        videoSectionApi.updateVideoSectionById(this.videoSection).then(response => {
          this.$message({
            type: 'success',
            message: '移除视频成功'
          })
        })
      })
    },
    // 上传限制方法
    handleUploadExceed(files, fileList) {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },
    // 上传方法
    submitUpload() {
      this.uploadBtnDisabled = true
      this.$refs.upload.submit() // 提交上传请求
    },
    // 视频上传成功的回调
    handleUploadSuccess(response, file, fileList) {
      this.uploadBtnDisabled = false
      if (response.success) {
        this.videoSection.videoSourceId = response.data.videoId
        this.videoSection.videoOriginalName = file.name
      } else {
        this.$message.error('上传失败1')
      }
    },

    // 失败回调
    handleUploadError() {
      this.uploadBtnDisabled = false
      this.$message.error('上传失败2')
    },

    open(chapterId, videoId) {
      this.dialogVisible = true
      this.videoSection.chapterId = chapterId
      if (videoId) {
        // 1. 设置对话框主题
        this.title = true
        // 2. 发送请求回显数据
        videoSectionApi.getVideoSectionById(videoId).then(response => {
          this.videoSection = response.data.videoSection
          // 回显
          if (this.videoSection.videoOriginalName) {
            this.fileList = [{ 'name': this.videoSection.videoOriginalName }]
          }
          console.log('回显数据', this.videoSection)
        })
      }
    },
    close() {
      this.dialogVisible = false
      // 重置表单
      this.videoSection = {
        sort: 0,
        free: false
      }
      // 重置title
      this.title = false
    },
    saveOrUpdate() {
      if (!this.videoSection.id) {
        this.save()
      } else {
        this.update()
      }
    },
    save() {
      // 1. 拿到课程id
      this.videoSection.courseId = this.$parent.$parent.courseId
      // 2. ...
      videoSectionApi.addVideoSection(this.videoSection).then(response => {
        // 1. 提示信息
        this.$message({
          type: 'success',
          message: '添加课时成功'
        })
        // 2. 关闭组件
        this.close()
        // 3. 刷新列表
        this.$parent.getChapterList()
      })
    },
    update() {
      console.log('videoSection', this.videoSection)
      videoSectionApi
        .updateVideoSectionById(this.videoSection)
        .then(response => {
          // 1. 提示信息
          this.$message({
            type: 'success',
            message: '修改课时成功'
          })
          // 2. 关闭组件
          this.close()
          // 3. 刷新列表
          this.$parent.getChapterList()
        })
    }
  }
}
</script>
