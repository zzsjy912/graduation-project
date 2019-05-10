<template>
  <div id="header">
    <div class="header_inner">
      <a href="#" id>光影</a>
      <nav class="header_nav">
        <a class="header-navItem" @click="goIndex">首页</a>
        <a class="header-navItem" v-if="userinfo.identity == 1" @click="goAdmin" >后台</a>
      </nav>
      <div class="SearchBar">
        <search-bar></search-bar>
      </div>
      <div class="header_userInfo">
        <div class="popover">
          <a-badge :count="MessageInfo.noReadLength">
            <i class="el-icon-bell"></i>
          </a-badge>

          <div class="dropdown-message menu">
            <div class="Popover-content">
              <div class="PushNotifications-list">
                <div class="PushNotifications-item" v-for="(item, index) in MessageInfo.data" :key="index" @click="readMessage(item)">
                  <div>
                    <a>{{item.user_name  }} </a>
                  </div>
                  <div style="margin-left: 5px;">回复了你：</div>
                  <div class="message-content">{{item.content}}</div>
                </div>
                <div class="zero" v-if="MessageInfo.data.length == 0">暂无数据</div>
              </div>
              <div @click="goToMyMessage" class="foot">查看更多</div>
            </div>
          </div>
        </div>
        <div class="header_profile">
          <div class="popover2">
          <img :src="userinfo.avatar" width="45px" alt>

          <div class="dropdown-user menu">
            <div class="Popover-content">
              <div class="PushNotifications-list">
                <div class="PushNotifications-item" @click="goToMy">
                  我的主页
                </div>
                <div class="PushNotifications-item" @click="LoginOut" >
                  退出登陆
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
    <el-dialog :modal="false" :visible.sync="dialogVisible" width="30%">
       <template slot="title">
          <h3 style="display:flex;">
        <a @click="goToPeople(messageContent.user_name)">{{messageContent.user_name }}</a> &nbsp;回复了</h3>
        </template>
      
      <div style="min-height:100px;">{{messageContent.content}}</div>
      <div style="text-align: right;">{{messageContent.date |time }}</div>
      <span slot="footer" class="dialog-footer">
        
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <div class="mask" v-if="dialogVisible"></div>
  </div>
</template>

<style scoped>
.mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
z-index: 1986;
  background-color: rgba(26, 26, 26, 0.65);
}
#header {
  /* position: relative;
    min-width: 1032px;
    overflow: hidden; */
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(26, 26, 26, 0.1);
  background-clip: content-box;
  position: fixed;
  /* overflow: hidden; */
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
}
#header i {
  font-size: 22px;
}
.zero {
  text-align: center;
    height: 200px;
    line-height: 200px;
}
.header_inner {
  position: relative;
  display: flex;
  width: 1000px;
  height: 52px;
  padding: 0 16px;
  margin: 0 auto;
  align-items: center;
  transition: -webkit-transform 0.3s;
  transition: transform 0.3s;
  transition: transform 0.3s, -webkit-transform 0.3s;
}
.header_nav {
  display: flex;
  justify-content: space-between;
  height: 30px;
  margin-right: 18px;
  margin-left: 27px;
  color: #999999;
}
.SearchBar {
  width: 372px;
}
.header-navItem {
  padding: 0 15px;
  font-size: 15px;
  line-height: 30px;
  color: #8590a6;
}
.header-navItem.is-active {
  color: #444444;
}

.header_userInfo {
  flex: 1 1;
  justify-content: flex-end;
  display: flex;
  align-items: center;
}
.popover {
  margin-right: 40px;
  height: 50px;
  line-height: 60px;
}
.SearchBar {
  margin-left: 110px;
}

.menu {
  
  background: #ffffff;
  padding: 6px 0;
  position: absolute;
  box-shadow: 0 5px 20px rgba(26, 26, 26, 0.1);
  
}
.dropdown-message {
  left: 66%;
  width: 360px;
  height: 310px;
  overflow-y: scroll;
  top: -550px;
  opacity: 0;
  transition: opacity 0.15s, top 0.05s;
}
.dropdown-user {
      left: 89%;
    width: 100px;
    height: 115px;
  top: -550px;
  opacity: 0;
  transition: opacity 0.15s, top 0.05s;
}
.popover a {
  display: inline-block;
}
.popover:hover .dropdown-message {
  opacity: 1;
  top: 48px;
}
.popover:hover html {
  overflow: hidden;
  padding-right: 17px;
}
.popover2:hover .dropdown-user {
  opacity: 1;
  top: 48px;
}
.popover2 img{
  height: 40px;
  border-radius: 50%;
}
.dropdown-user .PushNotifications-item:hover,.PushNotifications-item:hover {
  background: #f6f6f6;
}
.popover .foot {
  text-align: center;
  position: relative;
  bottom: 0;
  left: 0;
  right: 0;
  cursor: pointer;
}
.PushNotifications-item {
  padding: 15px;
  line-height: 24px;
  border-bottom: 1px solid #ebebeb;
  cursor: pointer;
  height: 60px;
  display:flex;
}

.message-content {
      width: 190px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>

<script>
import SearchBar from "@c/SearchBar.vue";
export default {
  components: {
    SearchBar
  },
  data() {
    return {
      userinfo: {
        avatar: ""
      },
      messageList:[],
      noReadLenght:0,
      messageContent:{},
      dialogVisible: false,
    };
  },
  computed: {
    MessageInfo(){
     return this.$store.state.MessageInfo;
    }
  },
  // watch: {
  //   MessageInfo:function (newVal) {
  //     this.messageList = MessageInfo.data;
  //     this.noReadLenght = MessageInfo.noReadLength;
  //   }
  // },
  methods: {
    readMessage(item) {
      this.messageContent = item;
      this.dialogVisible = true;
      this.$axios.post('/api/message/read',{id:item.message_id})
      .then(res => {
        console.log(res.data);
        this.getMessageInfo();
      })
    },
    goIndex() {
      this.$router.push({
        name: "home"
      });
    },
    goAdmin() {
      this.$router.push({
        name: "adminHome"
      });
    },
    getMessage() {
      this.$axios.post('/api/message/dropdown')
      .then(res => {
        console.log(res.data);
        this.noReadLenght = res.data.noReadLength;
        this.messageList = res.data.data;
      })
    },
     getMessageInfo() {
      this.$axios.post('/api/message/dropdown')
        .then(res => {
          console.log(res.data);
          this.$store.commit("setMessageInfo", res.data);
        })
    },
    goToMy() {
      this.$router.push({
        name:'MyAll'
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
    goToMyMessage() {
      this.$router.push({
        name: 'MyMessage',
      });
    },
    LoginOut(){
      localStorage.Token='';
      this.$router.push({
        name:'Login'
      })
    }
  },
  created() {
    this.userinfo = JSON.parse(localStorage.getItem("setUserinfo"));
    this.$store.commit("setUserinfo", this.userinfo);
    // this.getMessage();
  }
};
</script>