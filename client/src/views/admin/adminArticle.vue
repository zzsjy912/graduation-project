<template>
  <div>
    <el-button @click="newUser">新建用户</el-button>
    <div class="table">
      <el-table
        :data="tableData.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
        border
        height="600"
        style="width: 100%"
      >
        <el-table-column prop="title" label="文章名" ></el-table-column>
        <el-table-column prop="user_name" label="作者" width="80"></el-table-column>

        <el-table-column prop="topic" label="简介"></el-table-column>
        <el-table-column prop="date |time" label="创建时间" sortable >
          <template slot-scope="scope">
            <span>{{ scope.row.data |time}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot="header">
            <el-input v-model="search" size="mini" placeholder="输入关键字搜索"/>
          </template>
          <template slot-scope="scope">
            <el-button size="mini" @click="goTo(scope.row.article_id)">查看</el-button>
            <el-button size="mini" type="danger" @click="del(scope.row.article_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- <el-dialog title="新建公告" :visible.sync="dialogVisible" width="30%">
      <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="content"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changOK">确 定</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          title: "",
          user_name: "",
          topic: "",
          date: ""
        }
      ],
      content: "",
      dialogVisible: false,
      search: ""
    };
  },
  methods: {
    newUser() {
      this.$router.push({
        name: "Register"
      });
    },
    changOK() {
      console.log(this.content);
      var content = this.content;
      this.$axios.post("/api/notice/add", { content }).then(res => {
        this.dialogVisible = false;
        this.getDate();
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.content = "";
      });
    },
    getDate() {
      this.$axios.post("/api/article/list").then(res => {
        console.log(res.data.data);
        this.tableData = res.data.data;
      });
    },
    del(id) {
      this.$axios.post("/api/article/del", { id }).then(res => {
        console.log(res);

        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.getDate();
      });
    },
    goTo(id) {
      this.$router.push({
        name: "article",
        params: { id }
      });
    }
  },
  created() {
    this.getDate();
  }
};
</script>


<style scoped>
.table {
  margin-top: 15px;
}
</style>
