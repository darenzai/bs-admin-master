<template>
  <!-- 添加和修改章节表单 -->
  <el-dialog :visible="dialogVisible" :title="title?'修改章节':'添加章节'">
    <el-form :model="chapter" label-width="120px">
      <el-form-item label="章节标题">
        <el-input v-model="chapter.title" />
      </el-form-item>
      <el-form-item label="章节排序">
        <el-input-number v-model="chapter.sort" :min="0" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import chapterApi from '@/api/edu/chapter'

export default {
  data() {
    return {
      dialogVisible: false,
      chapter: {
        sort: 0
      },
      title: false
    }
  },
  methods: {
    open(chapterId) {
      // 如果存在id, 则进行数据的回显
      if (chapterId) {
        this.title = true
        chapterApi.getChapterById(chapterId).then(response => {
          this.chapter = response.data.chapter
        })
      } else {
        this.chapter = {}
      }
      this.dialogVisible = true
    },

    close() {
      // 1. 关闭对话框
      this.dialogVisible = false
      // 2. 重置表单
      this.chapter = { sort: 0 }
      // 3. 重置title的值
      this.title = false
    },

    saveOrUpdate() {
      if (!this.chapter.id) {
        this.save()
      } else {
        this.update()
      }
    },
    // 保存章节方法
    save() {
      console.log(this.$parent.courseId)
      this.chapter.courseId = this.$parent.courseId
      chapterApi.addChapter(this.chapter).then(response => {
        // 1. 提示信息
        this.$message({
          type: 'success',
          message: '添加章节成功'
        })
        // 2. 关闭对话框
        this.close()
        // 3. 刷新列表
        this.$parent.getChapterList()
      })
    },
    // 修改章节方法
    update() {
      chapterApi.updateChapter(this.chapter).then(response => {
        // 1. 提示信息
        this.$message({
          type: 'success',
          message: '修改章节成功'
        })
        // 2. 关闭对话框
        this.close()
        // 3. 刷新列表
        this.$parent.getChapterList()
      })
    }
  }
}
</script>
