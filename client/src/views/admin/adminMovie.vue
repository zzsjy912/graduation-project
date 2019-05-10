<template>
  <div>
    <div class="table">
      <el-table :data="tableData.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))" border height="600" style="width: 100%">
        <el-table-column prop="date |time" label="添加日期" sortable width="130">
          <template slot-scope="scope">
            <span>{{ scope.row.date |time}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="电影ID" sortable width="130"></el-table-column>
        <el-table-column prop="title" label="电影名" sortable width="130"></el-table-column>
        <el-table-column prop="rating.average" label="评分" sortable width="80"></el-table-column>
        <el-table-column prop="rating_count" label="评分人数" width="80" sortable></el-table-column>
        <el-table-column prop="reviews_count" label="游览人数" width="80" sortable></el-table-column>
        <el-table-column align="center">
          <template slot="header" slot-scope="scope">
            <el-input v-model="search" size="mini" placeholder="输入关键字搜索"/>
          </template>
          <template slot-scope="scope">
            <el-button size="mini" @click="goMovieInfo(scope.row.id)">游览</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="新建公告" :visible.sync="dialogVisible" width="30%">
      <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="content"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changOK">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: "",
          user_name: "",
          content: ""
        }
      ],
      content: "",
      dialogVisible: false,
      search: ''
    };
  },
  methods: {
    newNotice() {
      this.dialogVisible = true;
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
      this.$axios.post("/api/movieinfo/list").then(res => {
        this.tableData = res.data.data;
      });
    },
    goMovieInfo(id) {
      this.$router.push({
        name: "movieinfo",
        params: { id }
      });
    },
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
