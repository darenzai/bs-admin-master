<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <!-- <el-input v-model="conditionQuery.name" placeholder="讲师名" /> -->
        <el-autocomplete
          v-model="conditionQuery.name"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          class="inline-input"
          placeholder="讲师名称"
          value-key="name"
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="conditionQuery.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="首席讲师" />
          <el-option :value="2" label="高级讲师" />
          <el-option :value="3" label="中级讲师" />
          <el-option :value="4" label="初级讲师" />
          <el-option :value="5" label="见习讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间">
        <el-date-picker
          v-model="conditionQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="conditionQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="initData()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
      <el-button type="danger" @click="batchRemove()">批量删除</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" />
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">{{ (page - 1) * limit + scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="讲师头像" width="100" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" alt="scope.row.title" width="100%" >
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="80" />
      <el-table-column label="头衔" width="100">
        <template slot-scope="scope">
          <div v-if="scope.row.level === 1">首席讲师</div>
          <div v-else-if="scope.row.level === 2">高级讲师</div>
          <div v-else-if="scope.row.level === 3">中级讲师</div>
          <div v-else-if="scope.row.level === 4">初级讲师</div>
          <div v-else>见习讲师</div>
        </template>
      </el-table-column>
      <el-table-column prop="intro" label="简介" />
      <el-table-column prop="career" label="学历" width="120" />
      <el-table-column prop="gmtCreate" label="添加时间" width="160" />
      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页插件 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="initData"
    />
  </div>
</template>
<script>
import teacherApi from '@/api/edu/teacher.js'
export default {
  data() {
    return {
      listLoading: true, // 是否显示loading信息
      list: null, // 数据列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 10, // 每页记录数
      conditionQuery: {}, // 查询条件
      multipleSelection: [] // 多选框
    }
  },
  created() {
    this.initData()
  },
  methods: {
    // 1. 多条件组成分页查询
    initData(page = 1) {
      this.page = page
      this.listLoading = true
      teacherApi
        .getTeacherForPageLimit(this.page, this.limit, this.conditionQuery)
        .then(response => {
          if (response.success === true) {
            this.list = response.data.pages
            this.total = response.data.total
            this.listLoading = false
          }
        })
    },
    // 2. 清楚数据
    resetData() {
      // 1. 将查询条件置空
      this.conditionQuery = {}
      // 2. 调用多条件查询
      this.initData()
    },
    // 3. 删除讲师, 根据id
    removeDataById(id) {
      this.$confirm('此操作将删除该讲师, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          teacherApi.deleteTeacherById(id).then(response => {
            // 1. 刷新页面
            this.initData()
            // 2. 提示讲师删除成功
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        })
        .catch(() => {})
    },
    // 4. 批量删除
    batchRemove() {
      // 1. 提醒
      this.$confirm(`此操作将批量删除选择的讲师, 是否继续`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 1. 封装ids
          var ids = []
          this.multipleSelection.forEach(item => {
            ids.push(item.id)
          })
          // 2. 发送请求
          teacherApi.batchDeleteTeacher(ids).then(response => {
            // 1. 提示信息
            this.$message({
              type: 'success',
              message: '批量删除讲师成功'
            })
            // 2. 刷新页面
            this.initData()
          })
        })
        .catch(() => {})
    },
    // 选择框改变事件
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    // 根据key获取讲师名称列表
    querySearch(queryString, cb) {
      teacherApi.getTeacherNameListByKey(queryString)
        .then(response => {
          cb(response.data.teacherNameList)
        })
    }
  }
}
</script>
