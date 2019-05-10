<template>
  <div id="My">
    <div class="ProfileHeader">
      <el-card class="el_card">
        <div class="ProfileHeader-userCover">
          <div class="UserCover UserCover--colorBlock"></div>
        </div>
        <div class="ProfileHeader-wrapper">
          <div class="ProfileHeader-main">
            <div class="UserAvatar">
              <img :src="userinfo.avatar" alt srcset>
            </div>
            <div class="ProfileHeader-content">
              <div class="ProfileHeader-contentHead">
                <h1 class="ProfileHeader-title">
                  <span class="ProfileHeader-name">{{userinfo.name}}</span>
                </h1>
              </div>
              <div class="ProfileHeader-contentBody">
                <div class="ProfileHeader-info">
                  <span>个人简介</span>
                  <div class="ProfileHeader-introduce">dahiodhauihi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <div class="Profile-main">
      <div class="Profile-mainColumn">
        <el-card class="el_card">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane :label="'动态'+allLength.all" name="MyAll"></el-tab-pane>
            <el-tab-pane :label="'影评'+allLength.article" name="MyArticle"></el-tab-pane>
            <el-tab-pane :label="'留言'+allLength.paragraph" name="MyParagraph"></el-tab-pane>
            <el-tab-pane :label="'回复'+allLength.reply" name="MyReply"></el-tab-pane>
            <!-- <el-tab-pane label="点赞" name="like"></el-tab-pane> -->
            <el-tab-pane :label="'消息'+allLength.message" name="MyMessage"></el-tab-pane>
          </el-tabs>
          <div class="ListShortcut">
            <router-view></router-view>
          </div>
        </el-card>
      </div>
      <div class="Profile-sideColumn">
        <el-card>
          <ul>
            <li>
              <a @click="changePass">修改密码</a>
            </li>
          </ul>
        </el-card>
      </div>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="30%">
      <el-form :model="form">
        <el-form-item label="原密码" label-width="80px">
          <el-input v-model="form.passWord" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="80px">
          <el-input v-model="form.newPassWord" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
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
      userinfo: {
        avatar: "",
        name: ""
      },
      activeName: "",
      allLength: {
        all: 0,
        article: 0,
        paragraph: 0,
        reply: 0
      },
      dialogVisible: false,
      form: {
        passWord: "",
        newPassWord: ""
      }
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
      this.$router.push({
        name: this.activeName
      });
    },
    getNum() {
      this.$axios
        .post("/api/usersactive/allLength", { user_name: this.userinfo.name })
        .then(res => {
          this.allLength = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    changePass() {
      this.dialogVisible = true;
    },
    changOK() {
      this.$axios
        .post("/api/users/changePassWord", {
          email: this.userinfo.email,
          password: this.form.passWord,
          newPassWord: this.form.newPassWord
        })
        .then(res => {
          this.$message({
            message: "修改成功",
            type: "success"
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.userinfo =
      this.$store.state.Userinfo ||
      JSON.parse(localStorage.getItem("setUserinfo"));
    this.getNum();
  }
};
</script>

<style scoped>
.UserCover--colorBlock {
  height: 132px;
  /* background: #999; */
}
.ProfileHeader-main {
  position: relative;
  margin: 0 20px 24px;
}
.ProfileHeader-wrapper {
  height: 145px;
}
.UserCover {
  background: url("http://47.94.194.153:5000/img/my-bg.jpg") no-repeat;
  background-size: 100%;
}
.UserAvatar {
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
  background-color: #fff;
  border: 4px solid #fff;
  border-radius: 8px;
  position: absolute;
  top: -45px;
  left: 0;
  z-index: 1;
}
.UserAvatar img {
  width: 160px;
  height: 160px;
}
.ProfileHeader-content {
  padding-top: 4px;
  padding-left: 32px;
  border-left: 164px solid transparent;
}
.ProfileHeader-contentHead {
  position: relative;
  padding-right: 106px;
  margin-bottom: 16px;
}
.ProfileHeader-name {
  font-size: 26px;
  font-weight: 600;
  font-synthesis: style;
  line-height: 30px;
}
.Profile-main {
  margin: 10px auto;
  display: flex;
  justify-content: space-between;
}
.Profile-mainColumn {
  width: 694px;
}
.Profile-sideColumn {
  width: 296px;
  color: #646464;
}
.Profile-sideColumn {
  height: 45px;
  line-height: 45px;
  table-layout: c;
  text-align: center;
}
.Profile-sideColumn li {
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
  margin-top: 12px;
}
.Profile-sideColumn li a {
  color: #303133;
}
</style>
