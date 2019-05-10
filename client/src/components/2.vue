<template>
  <div id="header">
    <div class="header_inner">
      <a href="#" id>光影</a>
      <nav class="header_nav">
        <a class="header-navItem" @click="goIndex">首页</a>
        <a class="header-navItem" href="#" id>后台</a>
      </nav>
      <div class="SearchBar">
        <search-bar></search-bar>
      </div>
      <div class="header_userInfo">
        <div class="popover">
          <i class="el-icon-bell"></i>
        </div>
        <div class="header_profile">
          <img :src="userinfo.avatar" width="45px" alt>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
}
.SearchBar {
  margin-left: 110px;
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
      }
    };
  },
  methods: {
    goIndex() {
      this.$router.push({
        name: "home"
      });
    }
  },
  created() {
    this.userinfo = JSON.parse(localStorage.getItem("setUserinfo"));
    this.$store.commit("setUserinfo", this.userinfo);
  }
};
</script>