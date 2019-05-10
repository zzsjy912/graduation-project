<template>
  <div id="ArticleDetails" v-if="show">
    <div class="mask"></div>
    <div class="Editor_main">
      <div class="top">
        <div>
          <img :src="moviceInfo.img" alt>
          <b>
            <a>{{moviceInfo.name}}</a>
          </b>
        </div>
        <el-rate v-model="details.rating" disabled show-score text-color="#ff9900"></el-rate>
      </div>
      <h1>{{details.title}}</h1>
      <div class="user">
        <img :src="details.user_avatar" alt>
        <span @click="goToPeople(details.user_name)">
          <a>{{details.user_name}}</a>
        </span>
        <span>{{details.date}}</span>
      </div>
      <div class="content" v-html="details.content"></div>
    </div>
    <div class="back" @click="back">X</div>
  </div>
</template>

<script>
export default {
  name: "ArticleDetails",
  props: ["details"],
  data() {
    return {
      editorContent: "", //内容
      editorContent2: "",
      rating: "",
      title: "",
      moviceInfo: {
        name: "",
        img: ""
      },
      show: false,
      userinfo: null,
      editorText: ""
    };
  },
  created() {},
  mounted() {},
  methods: {
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
    back() {
      this.show = false;
    }
  },
  created() {
    this.moviceInfo = this.$store.state.Movieinfo;
    this.userinfo = JSON.parse(localStorage.getItem("setUserinfo"));
  }
};
</script>

<style scoped>
.mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 0;
  background-color: rgba(26, 26, 26, 0.65);
}
#ArticleDetails {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 203;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-transition: opacity 0.3s ease-out;
  transition: opacity 0.3s ease-out;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  padding: 7px 15px;
  background-color: #f8f8f8;
}

.top img {
  height: 66px;
}
.top > div {
  display: flex;
}
.top > div b {
  margin: auto;
  margin-left: 15px;
}
.back {
  position: fixed;
  right: 127px;
  color: #fff;
  font-size: 30px;
  top: 62px;
  cursor: pointer;
}
h1 {
  padding: 10px;
  margin-bottom: 0px;
}
.user {
  display: flex;
  justify-content: center;
  height: 45px;
}
.user img {
  height: 30px;
  border-radius: 50%;
}
.user span {
  margin-left: 8px;
}
.content {
  height: 804px;
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 15px;
}
input {
  resize: none;
  overflow: hidden;
  height: 30px;
  border: 0;
  background: #fff;
  -webkit-appearance: none;
  width: 100%;
  padding: 10px 20px;
  outline: none;
  font-size: 30px;
  font-weight: 600;
  line-height: 1.42;
  border: 0;
  height: 70px;
}
.w-e-toolbar {
  padding: 5px 5px;
}
.Editor_main {
  z-index: 999;
  background-color: #fff;
  position: relative;
  z-index: 1;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  width: 800px;
  max-height: calc(100vh - 140px);
  margin-right: auto;
  margin-left: auto;
  -webkit-box-shadow: 0 5px 20px rgba(26, 26, 26, 0.1);
  box-shadow: 0 5px 20px rgba(26, 26, 26, 0.1);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-transition: max-height 0.8s ease;
  transition: max-height 0.8s ease;
}
.myWangEditor {
  /* width: 688px; */
  height: calc(100vh - 248px);
}
</style>