<template>
  <div>
    <Header></Header>
    <div class="main">
      <div class="menu">
        <el-menu default-active="1-4-1" class="el-menu-vertical-demo">
          <template v-for="(item, index) in menuDate">
            <el-menu-item
              v-if="item.isgroup == false"
              @click="clickRow(item.path)"
              :key="index"
              :v-cloak="index"
            >
              <i :class="item.ico"></i>
              <span slot="title">{{item.title}}</span>
            </el-menu-item>
            <el-submenu :index="index" :key="index" v-if="item.isgroup == true">
              <template slot="title">
                <i :class="item.ico"></i>
                <span slot="title">{{item.title}}</span>
              </template>
              <el-menu-item-group>
                <template v-for="(child, index) in item.children">
                  <el-menu-item :key="index" @click="clickRow(child.path)">
                    <i :class="item.ico"></i>
                    {{child.title}}
                  </el-menu-item>
                </template>
              </el-menu-item-group>
            </el-submenu>
          </template>
          <template></template>
        </el-menu>
      </div>
      <div class="page">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>

    <div class="foot">光影 ©2019 Created by Jianyu Zhu</div>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
import Header from "@/components/Header.vue";

export default {
  components: {
    Header
  },
  data() {
    return {
      menuDate: [
        {
          title: "首页",
          ico: "el-icon-attract",
          path: "/admin/home",
          isgroup: false
        },
        {
          title: "公告管理",
          ico: "el-icon-attract",
          path: "/admin/notice",
          isgroup: false
        },
        {
          title: "用户管理",
          ico: "el-icon-attract",
          path: "/admin/userinfo",
          isgroup: false
        },
        {
          title: "电影条目管理",
          ico: "el-icon-attract",
          path: "/admin/movie",
          isgroup: false
        },
        {
          title: "文章管理",
          ico: "el-icon-attract",
          path: "/admin/article",
          isgroup: false
        }
      ]
    };
  },
  methods: {
    token() {
      var token = localStorage.getItem("Token");
      const decoded = jwt_decode(token);
      console.log(decoded);
    },
    clickRow(path) {
      this.$router.push({
        path
      });
    },
    isAdmin() {
      var loginUser =
        this.$store.state.Userinfo.identity ? this.$store.state.Userinfo.length :
        JSON.parse(localStorage.getItem("setUserinfo"));
        debugger
      if (loginUser.identity == 0) {
        this.$message({
          message: "无权限",
          type: "error"
        });
        this.$router.push({
          name:'home'
        })
      } 
    }
  },
  created() {
    // this.isAdmin()
  }
};
</script>

<style scoped>
.main {
  display: flex;
  padding-top: 100px;
  margin-left: 50px;
}
.foot {
  /* background: #f0f2f5; */
  padding: 24px 50px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 12px;
  text-align: center;
  margin-top: 50px;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
.menu {
  width: 200px;
}
.page {
  margin-left: 50px;
  width: 70%;
}
.fade-enter-active,
.fade-leave-active {
  /* transform: translateX(10px); */
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to
/* .fade-leave-active for below version 2.1.8 */ {
  opacity: 0;
}
</style>
