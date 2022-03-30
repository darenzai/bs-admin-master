<template>
  <div class="app-container">
    <!-- 输入表单 -->
    <el-form label-width="120px">
      <el-form-item label="轮播图主题">
        <el-input v-model="banner.title" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="banner.sort" :min="0"/>
      </el-form-item>
      <!-- 轮播图图片 -->
      <el-form-item label="轮播图图片">
        <el-upload
          :on-success="handleImageSuccess"
          :before-upload="beforeImageUpload"
          :on-error="handleImageError"
          :action="BASE_API+'/api/thirdparty/oss/get/url'"
          class="cover-uploader"
        >
          <img v-if="banner.imageUrl" :src="banner.imageUrl" >
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import bannerApi from '@/api/edu/banner'

export default {
  data() {
    return {
      BASE_API: process.env.BASE_API,
      banner: {},
      saveBtnDisabled: false // 保存按钮是否禁用，防止表单重复提交
    }
  },
  watch: {
    $route(to, from) {
      this.initForm()
    }
  },
  // 页面渲染成功
  created() {
    this.initForm()
  },
  methods: {
    initForm() {
      if (this.$route.params.id && this.$route.params) {
        this.fetchDataById(this.$route.params.id)
      } else {
        this.banner = {}
      }
    },
    saveOrUpdate() {
      // 禁用保存按钮
      this.saveBtnDisabled = true
      if (!this.banner.id) {
        this.saveData()
      } else {
        this.updateData()
      }
    },

    // 新增
    saveData() {
      // debugger
      bannerApi.addBanner(this.banner).then(response => {
        // 1. 提示消息
        this.$message({
          type: 'success',
          message: '新增成功'
        })
        // 2. 路由到banner列表
        this.$router.push({ path: '/banner/table' })
      })
    },

    // 根据id更新记录
    updateData() {
      // teacher数据的获取
      bannerApi.updateBanner(this.banner).then(response => {
        // 1. 提示消息
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        // 2. 路由到banner列表
        this.$router.push({ path: '/banner/table' })
      })
    },
    // 根据id查询记录
    fetchDataById(id) {
      bannerApi.getBannerById(id).then(response => {
        this.banner = response.data.banner
      })
    },
    // 上传校验
    beforeImageUpload(file) {
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

    // 上传成功回调
    handleImageSuccess(res, file) {
      console.log(res)
      if (res.success) {
        // console.log(res)
        this.banner.imageUrl = res.data.url
        // 强制重新渲染
        this.$forceUpdate()
      } else {
        this.$message.error('上传失败1')
      }
    },

    // 错误处理
    handleImageError() {
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
