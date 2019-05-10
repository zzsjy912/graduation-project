<template>
  <div>
    <el-button @click="newNotice">新建公告</el-button>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="date |time" label="时间" sortable width="130">
          <template slot-scope="scope">
            <span>{{ scope.row.date |time}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="发布者" width="130"></el-table-column>
        <el-table-column prop="content" label="内容"></el-table-column>
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
      dialogVisible: false
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
      this.$axios.post("/api/notice/list").then(res => {
        this.tableData = res.data.data;
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
