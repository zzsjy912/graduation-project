<template>
  <div>
    <el-button @click="newUser">新建用户</el-button>
    <div class="table">
      <el-table
        :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        border
        height="600"
        style="width: 100%"
      >
        <el-table-column prop="name" label="用户名" width="130"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="130"></el-table-column>

        <el-table-column label="账户类型" width="130">
          <template slot-scope="scope">
            <span>{{ scope.row.identity == 0?'普通':'管理员'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="data |time" label="创建时间" sortable width="130">
          <template slot-scope="scope">
            <span>{{ scope.row.data |time}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot="header" slot-scope="scope">
            <el-input v-model="search" size="mini" placeholder="输入关键字搜索"/>
          </template>
          <template slot-scope="scope">
            <el-button
              @click="Userban(scope.row.name,scope.row.isban)" size="mini"
              :type="scope.row.isban == 0?'primary':'danger'"
              v-if="scope.row.identity == 0"
            >{{scope.row.isban == 0?'正常':'冻结'}}</el-button>
            <el-button
              :type="scope.row.isban == 0?'primary':'danger'" size="mini"
              disabled
              v-if="scope.row.identity == 1"
            >{{scope.row.isban == 0?'正常':'冻结'}}</el-button>
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
          name: "",
          email: "",
          identity: "",
          data: "",
          isban: 0
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
          name:'Register'
      })
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
      this.$axios.post("/api/users/list").then(res => {
        console.log(res.data.data);
        this.tableData = res.data.data;
      });
    },
    Userban(name,current){
        this.$axios.post("/api/users/ban",{name,current}).then(res => {
            console.log(res);
            
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.tableData.forEach(item => {
            if (item.name == name) {
                item.isban = !item.isban;
            }
        })
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
