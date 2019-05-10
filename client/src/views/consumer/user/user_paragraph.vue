<template>
  <div id="user_paragraph">
    <h3 class="List-header">我的留言</h3>
    <a-skeleton :loading="loading" active :row="4">
      <div v-if="list.length !=0">
        <div class="List-item" v-for="(item, index) in list" :key="index">
          <div class="List-itemMeta">
            <span class="ActivityItem-metaTitle">写了留言</span>
            <span>{{item.date |time}}</span>
          </div>
          <div>
            <div class="listType1">
              <div>
                <a @click="goToMovie(item)">
                  <img :src="item.movie_image" alt srcset>
                </a>
              </div>
              <div style="    margin-left: 10px;">
                <div>
                  <div class="RichContent">{{item.content}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="list_zero" v-else>暂无数据</div>
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
    getDate() {
      this.$axios
        .post("/api/usersactive/paragraph", { user_name: this.userinfo.name })
        .then(res => {
          console.log(res.data);
          this.list = res.data.data;
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    goToMovie(item) {
      this.$router.push({
        name: "movieinfo",
        params: { id: item.id }
      });
    }
  },
  created() {
    this.userinfo =
      this.$store.state.Userinfo ||
      JSON.parse(localStorage.getItem("setUserinfo"));
    this.getDate();
  }
};
</script>

<style scoped>
#user_paragraph {
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
.user {
  display: flex;
  /* justify-content: center; */
  height: 45px;
  margin-left: 50px;
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
