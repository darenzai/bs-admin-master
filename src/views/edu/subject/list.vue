<template>
  <div class="custom-tree-container">
    <div class="block">
      <el-input v-model="filterText" placeholder="搜索学科" style="margin-bottom:30px;" />
      <el-switch v-model="draggable" active-text="开启拖拽" inactive-text="关闭拖拽"></el-switch>
      <el-button v-if="draggable" @click="batchSave">批量保存</el-button>
      <el-button type="danger" @click="batchDelete">批量删除</el-button>
      <el-button type="primary" @click="add">添加学科</el-button>
      <!-- 
        ref: 给el-tree绑定元素, 引用信息将会注册在父组件的 $refs 对象上。相当于id
        data: 展示数据
        props： 配置选项，具体看下表	
        expand-on-click-node: 点击节点元素会展开或者关闭列表，我们赋值为false，选择选项框才能展开或者关闭。
        show-checkbox: 节点是否可被选择
        default-expand-all: 	是否默认展开所有节点
        node-key: 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
        default-expanded-keys: 	默认展开的节点的 key 的数组	array
        draggable: 是否开启拖拽节点功能
        allow-drop: 拖拽时判定目标节点能否被放置。type 参数有三种情况：'prev'、'inner' 和 'next'，
        分别表示放置在目标节点前、插入至目标节点和放置在目标节点后 Function(draggingNode, dropNode, type)
        node-drop(事件): 拖拽成功完成时触发的事件...共四个参数，依次为：被拖拽节点对应的 Node、
        结束拖拽时最后进入的节点、被拖拽节点的放置位置（before、after、inner）、event 
        filter: 对树节点进行筛选操作	接收一个任意类型的参数，该参数会在 filter-node-method 中作为第一个参数
        filter-node-method：对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
       
       :allow-drop="allowDrop"
        @node-drop="handleDrop"
      -->
      <el-tree
        ref="subjectTree"
        :data="subjectList"
        :props="defaultProps"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        show-checkbox
        node-key="id"
        :default-expanded-keys="expandedKey"
        :draggable="draggable"
        :allow-drop="allowDrop"
        @node-drop="handleDrop"
      >
        <!--
          slot-scope: 读取该树的每行数据
          append(): 添加节点方法，(data, parentNode) 接收两个参数，
          1. 要追加的子节点的 data 2. 子节点的 parent 的 data、key 或者 node
          edit(): 追加子节点大data
          remove(): 要删除的节点的 data 或者 node
        -->
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              type="text"
              v-if="node.level <= 1"
              size="mini"
              @click="() => append(data)"
            >Append</el-button>
            <el-button type="text" size="mini" @click="edit(data)">Edit</el-button>
            <el-button type="text" size="mini" @click="() => remove(node, data)">Delete</el-button>
          </span>
        </span>
      </el-tree>
      <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="30%"
        :close-on-click-modal="false"
      >
        <el-form :model="subject">
          <el-form-item label="学科名称">
            <el-input v-model="subject.title" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitData">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import subjectAPI from "@/api/edu/subject";

export default {
  data() {
    return {
      updateNodes: [], // 更新的节点
      parentId: [], // 父id
      deep: 0, // 计算待拖动节点的深度, 应该是计算级别, 然后算出深度, 因为这是二级分类则直接计算深度即可,
      filterText: "", // 索引文本
      subjectList: [], // 树展开的数据
      dialogVisible: false, // 绑定对话框
      draggable: false, // 绑定tree是否可被拖拽
      title: "", // 对话框的标题，如果是add就是添加节点，如果是edit就是修改节点
      subject: {
        // 定义的学科对象
        id: "",
        parentId: "",
        title: ""
      },
      dialogType: "", //edit,add, 对话框的type, 根据type判断是什么操作
      expandedKey: [], // 展开数的id, 是一个数据的形式
      defaultProps: {
        // tree数据属性
        children: "childs",
        label: "title"
      }
    };
  },
  // 监听, filterText文件是否发生变化, 如果改变, 找到subjectTree执行filter方法, 将val传过去
  watch: {
    filterText(val) {
      this.$refs.subjectTree.filter(val);
    }
  },
  created() {
    // 初始化数据
    this.fetchNodeList();
  },
  methods: {
    batchSave() {
      subjectAPI.batchSaveSubject(this.updateNodes)
        .then(response => {
          // 1. 提示消息
          this.$message({
            type: 'success',
            message: '批量修改菜单保存成功'
          })
          // 2. 刷新菜单
          this.fetchNodeList()
          // 3. 设置需要展开的菜单
          this.expandedKey = this.parentId;
          this.updateNodes = [];
          this.deep = 0;
        })
    },
    /**
     * 批量删除
     */
    batchDelete() {
      console.log("选中的元素", this.$refs.subjectTree.getCheckedNodes());
      // 声明数组
      let sIds = [];
      // 选中的节点
      let checkedNodes = this.$refs.subjectTree.getCheckedNodes();
      // 遍历选中的节点, 封装到数组中
      for (var i = 0; i < checkedNodes.length; i++) {
        sIds.push(checkedNodes[i].id);
      }
      //
      this.$confirm(`该操作将批量删除选中的菜单`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          subjectAPI.batchDeleteSubject(sIds).then(reponse => {
            // 1. 提示删除成功
            this.$message({
              type: "success",
              message: "批量删除成功"
            });
            // 2. 刷新页面
            this.fetchNodeList();
          });
        })
        .catch(() => {});
    },
    /**
     * 拖拽完成时触发的方法
     */
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log("handleDrop", draggingNode, dropNode, dropType);
      // 1. 当前父节点最新的id
      let parentId = 0;
      let siblings = null;
      if (dropType == "before" || dropType == "after") {
        parentId = dropNode.parent.data.id == undefined ? 0 : dropNode.parent.data.id;
        siblings = dropNode.parent.childNodes;
      } else {
        parentId = dropNode.data.id;
        siblings = dropNode.childNodes;
      }
      // console.log("pId", pId);
      this.parentId.push(parentId);

      //2、当前拖拽节点的最新顺序，
      for (let i = 0; i < siblings.length; i++) {
        if (siblings[i].data.id == draggingNode.data.id) {
          //如果遍历的是当前正在拖拽的节点
          let level = draggingNode.level;
          if (siblings[i].level != draggingNode.level) {
            //当前节点的层级发生变化
            level = siblings[i].level;
            //修改他子节点的层级
            this.updateChildNodeLevel(siblings[i]);
          }
          this.updateNodes.push({
            id: siblings[i].data.id,
            sort: i,
            parentId: parentId,
            // level: level
          });
        } else {
          this.updateNodes.push({ id: siblings[i].data.id, sort: i });
        }
      }
      //3、当前拖拽节点的最新层级
      console.log("updateNodes", this.updateNodes);
    },
    updateChildNodeLevel(node) {
      if (node.childNodes.length > 0) {
        for (let i = 0; i < node.childNodes.length; i++) {
          var cNode = node.childNodes[i].data;
          this.updateNodes.push({
            id: cNode.id,
            // level: node.childNodes[i].level
          });
          this.updateChildNodeLevel(node.childNodes[i]);
        }
      }
    },
    /**
     * draggingNode: 源节点
     * dropNode: 目标节点
     * type: 类型
     * return: 如果返回为false 表示该节点不能拖动, 如果是true则可以
     */
    allowDrop(draggingNode, dropNode, type) {
      // 1. 被拖拽的当前节点以及所在的父节点总层数不能大于2
      //1）、被拖动的当前节点总层数
      console.log("allowDrop:", draggingNode, dropNode, type);
      this.countNodeLevel(draggingNode.data);
      if (type == "inner") {
        // 该节点的深度 + 移动节点深度 <= 2 因为是二级分类则小于2，三级分类小于三
        return this.deep + dropNode.level <= 2;
      } else {
        return this.deep + dropNode.parent.level <= 2;
      }
    },
    // 统计节点的最大级别
    // 由于是二级分类, 知道最大级别，直接计算深度，
    // 算法是：最大级别 - 当前级别 + 1;
    // 如果是三级分类, 则最大级别需要遍历加递归
    countNodeLevel(node) {
      if (node.parentId == "0") {
        this.deep = 2 - 1 + 1;
      } else {
        this.deep = 2 - 2 + 1;
      }
    },

    /**
     * 添加节点方法.
     * 1. 父节点添加子节点，进行判断是否为父节点, 如果是进行相应的处理
     * 2. 如果不是父节点, 提醒不允许插入.
     */
    append(data) {
      console.log("append", data);
      this.subject = {};
      // 弹框
      this.dialogVisible = true;
      // 设置标题
      this.title = " 追加学科";
      // 设置弹框类型
      this.dialogType = "append";
      // 设置学科的父id
      this.subject.parentId = data.id;
    },
    /**
     * 修改节点：
     * 1. 根据节点信息，查询该节点数据，进行回显
     * 2. 然后进行修改
     */
    edit(data) {
      console.log("edit", data);
      this.subject = {};
      // 设置对话框类型
      this.dialogType = "edit";
      // 对话框标题
      this.title = "修改学科";
      // 弹出对话框
      this.dialogVisible = true;
      // 根据当前修改的节点id查询数据
      this.subject.id = data.id;
      this.subject.title = data.title;
      this.subject.parentId = data.parentId;
      // subjectAPI.getSubjectById(data.id)
      //   .then(response => {
      //     this.subject.id = response.data.subject.id
      //     this.subject.parentId = response.data.subject.parentId
      //     this.subject.title = response.data.subject.title
      //     console.log("subject", this.subject)
      //   })
      // console.log("subject", this.subject)
    },
    // 添加一级学科
    add() {
      this.subject = {};
      // 1. 设置对话框类型
      this.dialogType = "add";
      // 2. 对话框标题
      this.title = "添加学科";
      // 3. 弹出对话框
      this.dialogVisible = true;
    },
    /**
     * 提交对话框
     */
    submitData() {
      if (this.dialogType == "append") {
        this.appendSubject();
      }
      if (this.dialogType == "edit") {
        this.editSubject();
      }
      if (this.dialogType == "add") {
        this.addSubject();
      }
    },
    /**
     * 添加父节点
     */
    addSubject() {
      subjectAPI.addSubject(this.subject).then(response => {
        // 1. 提示信息
        this.$message({
          type: "success",
          message: "添加成功"
        });
        // 2. 关闭对话框
        this.dialogVisible = false;
        // 3. 刷新页面
        this.fetchNodeList();
      });
    },
    /**
     * 追加学科
     */
    appendSubject() {
      subjectAPI.appendSubject(this.subject).then(response => {
        // 1. 提示消息
        this.$message({
          type: "success",
          message: "追加成功"
        });
        // 2. 关闭对话框
        this.dialogVisible = false;
        // 3. 刷新页面
        this.fetchNodeList();
        console.log("subject", this.subject);
        // 4. 设置展开的菜单
        this.expandedKey = [this.subject.parentId];
      });
    },
    editSubject() {
      subjectAPI.editSubject(this.subject).then(response => {
        // 1. 提示信息
        this.$message({
          type: "success",
          message: "修改成功"
        });
        // 2. 关闭对话框
        this.dialogVisible = false;
        // 3. 属性页面
        this.fetchNodeList();
        // 4. 设置展开的菜单
        console.log("subject", this.subject);
        if (this.subject.parentId == 0) {
          this.expandedKey = [this.subject.id];
        } else {
          this.expandedKey = [this.subject.parentId];
        }
      });
    },
    /**
     * 删除学科节点
     * 1. 如果删除的节点是叶子节点, 则直接根据节点的id进行删除即可
     * 2. 如果删除的节点是非叶子节点, 则直接删除整个子树
     */
    remove(node, data) {
      console.log("node", node);
      console.log("data", data);
      this.$confirm(
        `此操作将删除 "${
          data.parentId == 0 ? data.title + " 以及以下所有学科" : data.title
        }", 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          subjectAPI.deleteSubject(data.id).then(response => {
            // 1. 提示信息
            this.$message({
              type: "success",
              message: "删除成功"
            });
            // 2. 刷新页面
            this.fetchNodeList();
            // 3. 展开菜单
            if (data.parentId != "0") {
              this.expandedKey = [data.parentId];
            }
          });
        })
        .catch(() => {});
    },
    // 初始化节点数据方法。
    fetchNodeList() {
      subjectAPI.getAllSubjects().then(response => {
        if (response.success === true) {
          this.subjectList = response.data.subjects;
        }
      });
    },
    // 过滤方法, 如果为 true就是可以显示, false这个节点会被隐藏
    filterNode(value, data) {
      if (!value) return true; // 没值则直接返回
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1; // 适应大小写, 进行判断, 有值都会显示
    }
  }
};
</script>
<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style