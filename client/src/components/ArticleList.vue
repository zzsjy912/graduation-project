<template>
  <div id="ArticleList">
    <div v-if="total !=0">
      <div v-for="(item, index) in list" :key="index">
        <div class="comment_li">
          <div class="avatar">
            <img :src="item.user_avatar" alt>
          </div>
          <div class="main">
            <div class="top">
              <span  @click="goToPeople(item.user_name)" class="name">{{item.user_name}}</span>
              <el-rate
                style="margin-left:5px;"
                v-model="item.rating"
                disabled
                show-score
                text-color="#ff9900"
              ></el-rate>
              <span class="date">{{item.date |time}}</span>
            </div>
            <div class="title" @click="rowClick(item.article_id)">
              <a>{{item.title}}</a>
            </div>
            <div class="contont">
              <p>{{item.topic}}...</p>
            </div>
            <div class="active">
              <!-- <span>
                <a-icon type="like-o"/>
                点赞({{item.like_num}})
              </span>-->
              <span @click="showReply(item)">
                <a-ico type="message"/>查看评论
              </span>
            </div>
          </div>
        </div>
        <a-skeleton v-if="item.article_id == currenID" :loading="loading" active>
          <div class="replylist">
            <div v-for="(item, index) in replyList" :key="index" class="reply_li">
              <div class="avatar">
                <img :src="item.user_avatar" alt>
              </div>
              <div class="main">
                <div class="top">
                  <span @click="goToPeople(item.user_name)" class="name">{{item.user_name}}</span>
                  <span class="date">{{item.date |time}}</span>
                </div>
                <div class="comment">{{item.content}}</div>
                <div class="active2">
                  <span @click="replylistClick(item)">
                    <a-ico type="message" style="margin-right: 8px"/>回复
                  </span>
                </div>
              </div>
            </div>
          </div>
        </a-skeleton>

        <div v-if="item.article_id == currenID" class="edit">
          <a-comment>
            <a-avatar slot="avatar" :src="userinfo.avatar" alt="Han Solo"/>
            <div slot="content">
              <a-form-item>
                <a-textarea v-model="content" content :placeholder="placeholder" :rows="4"></a-textarea>
              </a-form-item>
              <a-form-item>
                <a-button htmlType="submit" @click="replyRaragraph(item)" type="primary">提交</a-button>
              </a-form-item>
            </div>
          </a-comment>
        </div>
      </div>
    </div>
    <div v-if="total== 0" class="list_zero">暂无数据</div>
    <div v-if="total>5" class="list_pagination">
      <a-pagination
        simple
        v-model="current"
        :hideOnSinglePage="hideOnSinglePage"
        :defaultPageSize="pagesize"
        :total="total"
        @change="change"
      />
    </div>
    <!-- <article-details ref="child" :details="articleDetails"></article-details> -->
  </div>
</template>

<script>
// import ArticleDetails from "@c/ArticleDetails.vue";

export default {
  // components: {
  //   ArticleDetails
  // },
  props: {
    list: {
      type: Array
    },
    total: {
      type: Number
    },
    movie_id: {
      type: String
    },
    userinfo: {
      type: Object
    }
  },
  data() {
    return {
      showreply: false,
      current: 1,
      pagesize: 5,
      hideOnSinglePage: true,
      placeholder: "",
      replyItem: null,
      content: "",
      replyList: [],
      currenID: -1,
      rating: 2,
      loading: true,
      articleDetails: {
        rating: 0,
        content: "",
        title: ""
      }
    };
  },
  methods: {
    showReply(item) {
      console.log(item);
      this.currenID = item.article_id;
      this.replyItem = item;
      this.placeholder = "回复:" + item.user_name;
      this.loading = true;
      this.$axios.get("/api/articlereply/" + item.article_id).then(res => {
        this.replyList = res.data.data;
        console.log(this.replyList);
        this.loading = false;
      });
      this.showreply = !this.showreply;
    },
    reply() {
      // this.isedit = !this.isedit;
    },
    replylistClick(item) {
      this.placeholder = "回复:" + item.user_name;
    },
    replyRaragraph(item) {
      var req = {
        article_id: this.replyItem.article_id,
        user_name: this.userinfo.name,
        user_avatar: this.userinfo.avatar,
        reply_name: this.replyItem.user_name,
        reply_avatar: this.replyItem.user_avatar,
        content: this.content
      };
      this.$axios.post("/api/articlereply/add", req).then(res => {
        console.log(res);
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.content = "";
        this.showReply(item);
      });
    },
    change(current, size) {
      // console.log(currents, size);'
      this.$emit("click-page", current);
    },
    getDetails(id) {
      this.$axios.post("/api/article/details", { id }).then(res => {
        console.log(res.data);
        this.articleDetails = res.data.data;
      });
    },
    rowClick(id) {
      this.$router.push({
        name:'article',
        params:{id}
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
  }
};
</script>

<style scoped>
#ArticleList {
  font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI",
    "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue",
    Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol";
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.65);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style: none;
  position: relative;
}
#ArticleList a {
  display: inline;
}
.ant-list-split .ant-list-header {
}
.ant-pagination-simple {
  text-align: right;
}
.list_pagination {
  margin-top: 15px;
}
.avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.comment_li {
  padding: 10px 0;
  display: flex;
  border-bottom: 1px solid #e8e8e8;
}
.reply_li {
  padding: 10px 0;
  display: flex;
  margin: 12px 35px;
  border-bottom: 1px solid #e8e8e8;
}
.edit {
  margin: 12px 35px;
}
.main {
  margin-left: 10px;
}
.top {
  height: 28px;
  display: flex;
}
.name {
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 4px;
  font-size: 14px;
  line-height: 22px;
  font-weight: bold;
  cursor: pointer;
}
.name:hover {
  color: #1890ff;
}
.date {
  font-size: 12px;
  line-height: 18px;
  padding-left: 8px;
}
.title {
  margin-bottom: 10px;
  margin-top: 0;
}
.comment {
  color: #303133;
  margin-bottom: 12px;
}
.active {
  display: flex;
  justify-content: flex-end;
  padding-right: 27px;
}
.active span,
.active2 span {
  cursor: pointer;
}
.active2 {
  display: flex;
  justify-content: flex-end;
  padding-right: 27px;
}

.active span:hover {
  color: #1890ff;
}
.main {
  width: 100%;
}
</style>
