<template>
  <div id="articleDetails">
    <div class="left">
      <el-card class="el_card">
        <h1>{{articleDetails.title}}</h1>
        <div class="user">
          <img :src="articleDetails.user_avatar" alt>
          <div class @click="goToPeople(articleDetails.user_name)">
            <a>{{articleDetails.user_name}}</a>
          </div>
          <div class="special_text">评论</div>
          <div class="movie_name" @click="goToMovie(articleDetails.movie_id)">
            <a>{{articleDetails.movieInfo.title}}</a>
          </div>
          <div class="rating">
            <el-rate v-model="articleDetails.rating" disabled show-score text-color="#ff9900"></el-rate>
          </div>
          <div class="special_text">{{articleDetails.date |time}}</div>
        </div>
        <div class="content" v-html="articleDetails.content"></div>
      </el-card>

      <a-skeleton :loading="loading" active>
        <el-card class="el_card">
          <div class="summary_title clearfix" slot="header">
            <span>留言 </span>
            <span class="total">全部 {{total}} 条</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="paragraph">写留言</el-button>
          </div>
          <div class="paragraph_main">
            <div class="paragraph_add" v-if="isparagraph_add">
              <a-comment>
                <a-avatar slot="avatar" :src="userinfo.avatar" alt="Han Solo"/>
                <div slot="content">
                  <a-form-item>
                    <a-textarea v-model="new_paragraph.content" :rows="4"></a-textarea>
                  </a-form-item>
                  <a-form-item>
                    <a-button htmlType="submit" type="primary" @click="postNewParagraph">提交</a-button>
                  </a-form-item>
                </div>
              </a-comment>
            </div>
            <div class="paragraph_list">
              <art-comment-list
                :userinfo="userinfo"
                v-on:click-page="getPage"
                :list="paragraphList"
                :total="total"
              ></art-comment-list>
            </div>
          </div>
        </el-card>
      </a-skeleton>
    </div>
    <div class="right">
      <el-card class="summary el_card">
        <div class="summary_title clearfix flex" slot="header">
          <h3>
            <a>{{articleDetails.movieInfo.title}}</a>
          </h3>
        </div>
        <div class="movie_info">
          <img :src="articleDetails.movieInfo.img" alt>
          <ul>
            <li>
              <div class="flex">
                <span class="special_text">导演</span>
                <span>{{articleDetails.movieInfo.directors[0].name}}</span>
              </div>
            </li>
            <li>
              <div class="flex">
                <span class="special_text">主演</span>
                <span
                  v-for="(item, index) in articleDetails.movieInfo.casts"
                  :key="index"
                >{{item.name}} &nbsp;</span>
              </div>
            </li>
            <li>
              <div class="flex">
                <span class="special_text">类型</span>
                <span
                  v-for="(item, index) in articleDetails.movieInfo.genres"
                  :key="index"
                >{{item}} &nbsp;</span>
              </div>
            </li>
            <li>
              <div class="flex">
                <span class="special_text">地区</span>
                <span
                  v-for="(item, index) in articleDetails.movieInfo.countries"
                  :key="index"
                >{{item}} &nbsp;</span>
              </div>
            </li>
          </ul>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import ArtCommentList from "@c/ArtCommentList.vue";

export default {
  components: {
    ArtCommentList
  },
  data() {
    return {
      article_id: "",
      movie_id:"",
      userinfo: {},
      articleDetails: {
        title: "",
        rating: 0,
        movieInfo: {
          title: "",
          img: ""
        }
      },
      editorContent: "", //内容
      editorContent2: "",
      rating: "",
      moviceInfo: {
        name: "",
        img: ""
      },
      show: false,
      editorText: "",

      loading: false,
      isparagraph_add: false,
      total: 0,
      paragraphList: [],
      new_paragraph: {
        content: ""
      }
    };
  },
  methods: {
    getDetails(article_id) {
      this.$axios.post("/api/article/details", { id:article_id }).then(res => {
        console.log(res.data);
        this.articleDetails = res.data.data;
      });
    },
    goToMovie(movie_id) {
      this.$router.push({
        name: "movieinfo",
        params: { id :movie_id}
      });
    },
    getParagraph() {
    //   console.log(item);
    //   this.currenID = item.article_id;
    //   this.replyItem = item;
    //   this.placeholder = "回复:" + item.user_name;
    //   this.loading = true;
      this.$axios.get("/api/articlereply/" + this.article_id).then(res => {
        this.paragraphList = res.data.data;
        this.total = res.data.totalnum;
        console.log(res.data);
        this.loading = false;
      });
    },
    paragraph() {
      this.isparagraph_add = !this.isparagraph_add;
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

    
    postNewParagraph() {
      var req = {
        article_id: this.article_id,
        user_name: this.userinfo.name,
        user_avatar: this.userinfo.avatar,
        content: this.new_paragraph.content
      };
      this.$axios.post("/api/articlereply/add", req).then(res => {
        console.log(res);
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.new_paragraph.content = "";
        this.getParagraph();
      });
    },
    // postNewParagraph() {
    //   this.new_paragraph.movie_id = this.movie_id;
    //   this.new_paragraph.user_avatar = this.userinfo.avatar;
    //   this.new_paragraph.user_name = this.userinfo.name;

    //   this.$axios.post("/api/paragraph/add", this.new_paragraph).then(res => {
    //     console.log(res);
    //     this.$message({
    //       message: "添加成功",
    //       type: "success"
    //     });
    //     this.new_paragraph.content = "";
    //     this.getParagraph();
    //   });
    // },


    getPage(page) {
      var req = {
        movie_id: this.movie_id,
        page: page
      };
      this.$axios.post("/api/paragraph/page", req).then(res => {
        this.paragraphList = res.data.data;
      });
    }
  },
  created() {
    this.article_id = this.$route.params.id;
    this.userinfo =
      this.$store.state.Userinfo ||
      JSON.parse(localStorage.getItem("setUserinfo"));
    this.getDetails(this.article_id);
    this.getParagraph();
  }
};
</script>

<style scoped>
.user {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 15px;
}
.user img {
  height: 20px;
  border-radius: 50%;
}
.user div {
  margin-left: 8px;
}
.pinglun {
  color: #999;
  font-size: 12px;
}
.movie_info {
}
.movie_info img {
  width: 100%;
}
.movie_info ul {
  margin-top: 15px;
}
.movie_info .special_text {
  margin-right: 15px;
}
.movie_info .flex {
  align-items: center;
  flex-wrap: wrap;
}
.content img {
  width: 100% !important;
}
</style>
