<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download" />
          <a
            href="https://xueliedu.oss-cn-beijing.aliyuncs.com/excel/%E8%AF%BE%E7%A8%8B%E5%88%86%E7%B1%BB%E5%88%97%E8%A1%A8%E6%A8%A1%E6%9D%BF.xlsx"
          >点击下载模版</a>
        </el-tag>
      </el-form-item>

      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API+'/api/edu/subject/analysis/data'"
          name="file"
          accept="application/vnd.ms-excel"
        >
          <el-button slot="trigger" size="small" type="primary" @click="openImportBtn">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload"
          >{{ fileUploadBtnText }}</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      BASE_API: process.env.BASE_API, // 请求后端接口API的前缀
      fileUploadBtnText: '上传到服务器',
      loading: false, // 上传按钮
      importBtnDisabled: false
    }
  },
  methods: {
    // 打开导入文件框
    openImportBtn() {
      this.importBtnDisabled = true
      this.importBtnDisabled = false
    },
    // 上传文件到服务器方法, 其目的是请求后端接口, 传入excel文件进行处理
    submitUpload() {
      this.fileUploadBtnText = '正在上传'
      this.loading = true
      this.$refs.upload.submit()
    },
    // 文件上传成功的回调
    fileUploadSuccess(response) {
      if (response) {
        this.fileUploadBtnText = '导入成功'
        this.loading = false
        this.$message({
          type: 'success',
          message: '上传成功'
        })
        // 路由到学科分类列表
        this.$router.push({
          path: '/subject/list'
        })
      }
    },
    // 文件上传失败的回调
    fileUploadError(response) {
      this.fileUploadBtnText = '导入失败'
      this.loading = false
      this.$message({
        type: 'error',
        message: '导入失败'
      })
    }
  }
}
</script>
<style>
</style>
