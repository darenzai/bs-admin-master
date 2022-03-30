<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" :min="0" controls-position="right" />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="首席讲师" />
          <el-option :value="2" label="高级讲师" />
          <el-option :value="3" label="中级讲师" />
          <el-option :value="4" label="初级讲师" />
          <el-option :value="5" label="见习讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师学历">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像</el-button>

        <!--
          v-show：是否显示上传组件
          :key：类似于id，如果一个页面多个图片上传控件，可以做区分
          :url：后台上传的url地址
          @close：关闭上传组件
        @crop-upload-success：上传成功后的回调-->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/api/thirdparty/oss/get/url'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacherApi from '@/api/edu/teacher.js'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      teacher: {
        name: '',
        sort: 0,
        level: 1,
        career: '',
        intro: '',
        avatar: ''
      },
      BASE_API: process.env.BASE_API, // 接口API地址
      imagecropperShow: false, // 是否显示上传组件
      imagecropperKey: 0, // 上传组件id
      saveBtnDisabled: false // 保存按钮是否禁用,
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
    // 因为这个添加讲师页面是和修改页面一起用的
    // 如果是添加, 则created()方法不执行任何内容
    // 如果是修改, 则需要根据路由id进行查询内容, 进行回显
    // 如何判断是添加还是修改呢, 通过页面路由是否包含id来进行判断
    // 1. 获取路由id
    this.initForm()
  },

  methods: {
    close() {
      this.imagecropperShow = false
      // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1
    },
    cropSuccess(data) {
      this.imagecropperShow = false
      this.teacher.avatar = data.url
      // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1
    },
    saveOrUpdate() {
      // 1. 该表单是添加讲师和修改讲师并存的
      // 所有需要判断, 当前teacher的id是否存在。。
      // 如果存在, 在是更新操作
      // 如果不存在, 则是添加操作
      this.saveBtnDisabled = true

      console.log(this.teacher.id)

      if (!this.teacher.id) {
        // 不存在id, 添加操作
        this.saveData()
      } else {
        // 存在id, 更新
        this.updateTeacher()
      }
    },

    // 监听到路由器发生改变执行该方法
    initForm() {
      // 1. 判断, 当前页面路由中是否有参数
      // 如果有, 就根据讲师id去查询讲师
      // 如果没有, 则清空teacher数据
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        this.getTeacher(id)
      } else {
        this.teacher = {}
        this.teacher.avatar = 'https://xueliedu.oss-cn-beijing.aliyuncs.com/avatar/1.jpg'
      }
    },

    // 更新讲师
    updateTeacher() {
      teacherApi
        .updateTeacher(this.teacher)
        .then(response => {
          // 1. 清空teacher
          this.teacher = {}
          // 2. 提示信息
          this.$message({
            type: 'success',
            message: '修改讲师成功'
          })
          // 3. 路由到讲师列表页面
          this.$router.push({
            path: '/teacher/table'
          })
        })
        .catch()
    },
    // 根据id获取讲师
    getTeacher(id) {
      teacherApi
        .getTeacherById(id)
        .then(response => {
          // 1. 获取讲师
          this.teacher = response.data.teacher
        })
        .catch(response => {
          // 1. 提示信息
          this.$message({
            type: 'warning',
            message: '该讲师不存在, 请重新创建'
          })
          // 2. 路由到添加讲师页面
          this.$roter.push({
            path: '/teacher/save'
          })
        })
    },

    // 1. 添加讲师
    saveData() {
      teacherApi
        .addTeacher(this.teacher)
        .then(response => {
          // 1. 提示消息保存成功
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          // 2. 跳转到list页面
          this.$router.push({
            path: '/teacher/table'
          })
        })
        .catch()
    }
  }
}
</script>
