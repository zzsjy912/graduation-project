<template>
  <div id="user_all">
    <h3 class="List-header">我的动态</h3>
    <a-skeleton :loading="loading" active :row="4">
      <div>
        <div class="List-item" v-for="(item, index) in list" :key="index">
          <div class="List-itemMeta">
            <span class="ActivityItem-metaTitle">{{type[item.type]}}</span>
            <span>{{item.date |time}}</span>
          </div>
          <div v-if="item.type == 'paragraph' ||item.type == 'article'">
            <div class="listType1">
              <div>
                <a @click="goToMovie(item)">
                  <img :src="item.movie_image" alt srcset>
                </a>
              </div>
              <div style="    margin-left: 10px;">
                <div v-if="item.type == 'paragraph'">
                  <!-- <div v-if="item.childDate.title" class="ContentItem-title"></div> -->
                  <div class="RichContent">{{item.childDate.content}}</div>
                </div>
                <div v-if="item.type == 'article'">
                  <div class="ContentItem-title article">
                    <a @click="getDetails(item.childDate.article_id)">{{item.childDate.title}}</a>
                    <el-rate
                      v-model="item.childDate.rating"
                      disabled
                      show-score
                      text-color="#ff9900"
                    ></el-rate>
                  </div>
                  <div class="RichContent">{{item.childDate.topic}}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="item.type == 'paragraphReply' ||item.type == 'articleReply'">
            <div class="ContentItem-title user">
              <img :src="item.childDate.reply_avatar" alt>
              <span>
                <a>{{item.childDate.reply_name}}</a>
              </span>
            </div>
            <div class="RichContent">{{item.childDate.content}}</div>
          </div>
        </div>
      </div>
    </a-skeleton>

    <!-- <article-details ref="child" :details="articleDetails"></article-details> -->
  </div>
</template>

<script>
// import ArticleDetails from "@c/ArticleDetails.vue";
export default {
  // components: {
  //   ArticleDetails
  // },
  data() {
    return {
      loading: true,
      type: {
        article: "写了影评",
        paragraph: "写了留言",
        paragraphReply: "回复了",
        articleReply: "回复了"
      },
      list: [],
      userinfo: "",
      articleDetails: {
        rating: 0,
        content: "",
        title: ""
      }
    };
  },
  methods: {
    getDate() {
      this.$axios
        .post("/api/usersactive/all", { user_name: this.userinfo.name })
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
      if (item.title == "article") {
        this.$router.push({
          name: "movieinfo",
          params: { id: item.childDate.movie_id }
        });
      } else {

      }this.$router.push({
          name: "movieinfo",
          params: { id: item.childDate.id }
      })
    },
    getDetails(id) {
      this.$axios.post("/api/article/details", { id }).then(res => {
        console.log(res.data);
        this.articleDetails = res.data.data;
        this.$refs.child.show = true;
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
#user_all {
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
.article {
  display: flex;
  justify-content: space-between;
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
