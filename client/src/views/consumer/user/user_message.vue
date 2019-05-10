<template>
  <div id="user_message">
    <h3 class="List-header">我的消息</h3>
    <a-skeleton :loading="loading" active :row="4">
      <div v-if="list.length !=0">
        <div class="List-item" v-for="(item, index) in list" :key="index">
          <div class="List-itemMeta">
            <span class="ActivityItem-metaTitle">
              <div class="user">
                <img :src="item.user_avatar" alt>
                <span @click="goToPeople(item.user_name)">
                  <a>{{item.user_name}}</a>
                </span>
                <span>回复了</span>
              </div>
            </span>
            <span>{{item.date |time}}</span>
          </div>
          <div>
            <div class="RichContent">{{item.content}}</div>
            <div class="foot">
              <div v-if="item.is_read==1">
                <el-tooltip content="已读" placement="top">
                  <el-button @click="readMessage(item)" type="info" icon="el-icon-message" circle></el-button>
                </el-tooltip>
              </div>
              <div v-if="item.is_read==0">
                <el-tooltip content="点击 已读" placement="top">
                  <el-button @click="readMessage(item)" type="primary" icon="el-icon-message" circle></el-button>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div  class="list_zero" v-else>暂无数据</div>
    </a-skeleton>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      list: [],
      userinfo: ""
    };
  },
  methods: {
    readMessage(item) {
      this.$axios.post('/api/message/read',{id:item.message_id})
      .then(res => {
        item.is_read=1;
        this.getMessageInfo();
      })
    },
    getDate() {
      this.$axios
        .post("/api/message/all")
        .then(res => {
          console.log(res.data);
          this.list = res.data.data;
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMessageInfo() {
      this.$axios.post('/api/message/dropdown')
        .then(res => {
          console.log(res.data);
          this.$store.commit("setMessageInfo", res.data);
          this.$message({
          message: "已阅读",
          type: "success"
        });
        })
    },
    goToPeople(userName) {
      var loginUser =
        this.$store.state.Userinfo ||
        JSON.parse(localStorage.getItem("setUserinfo"));
      if (userName == loginUser.name) {
        this.$router.push({
          name: "MyAll"
        });
      } else
        this.$router.push({
          name: "PeopleAll",
          params: { user: userName }
        });
    },
  },
  created() {
    this.userinfo =
      this.$store.state.Userinfo ||
      JSON.parse(localStorage.getItem("setUserinfo"));
    this.getDate();
    console.log(this.$parent.activeName);
    
  }
};
</script>

<style scoped>
#user_message {
  margin: 0 20px;
}
h3 {
  font-weight: bold;
}
.List-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  border-bottom: 1px solid #e4e7ed;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.List-item {
  position: relative;
  padding: 16px 20px;
  border-bottom: 1px solid #f6f6f6;
}
.List-itemMeta {
  margin-bottom: 10px;
  color: #8590a6;
  display: flex;
  justify-content: space-between;
}
.ActivityItem-metaTitle {
  -webkit-box-flex: 1;
  -ms-flex: 1 1;
  flex: 1 1;
}
.ContentItem-title {
  font-size: 18px;
  font-weight: 600;
  font-synthesis: style;
  line-height: 1.6;
  color: #1a1a1a;
  margin-top: -4px;
}
.listType1 {
  display: flex;
}
.listType1 img {
  width: 90px;
}
.foot {
  padding: 10px 20px 20px;
  text-align: right;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.user {
  display: flex;
  /* justify-content: center; */
  /* height: 45px; */
  /* margin-left: 50px; */
}
.user img {
  height: 20px;
  border-radius: 50%;
}
.user span {
  margin-left: 8px;
  font-size: 14px;
}
</style>
