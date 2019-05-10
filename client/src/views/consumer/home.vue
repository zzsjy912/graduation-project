<template>
  <div id="Home">
    <div class="left">
      <el-card class="summary el_card">
        <div class="summary_title clearfix" slot="header">
          <h3>正在热映...</h3>
        </div>
        <p class="summary_com">
          <el-carousel height="230px" indicator-position="outside" :autoplay="false">
            <el-carousel-item v-for="(item1,index1) in 4" :key="index1">
              <div class="theaters_list" v-for="(item2, index2) in 5" :key="index2">
                <div class="movie_card">
                  <img
                    :src="theatersList[index2+(index1*5)].images.large"
                    @click="clickCard(theatersList[index2+(index1*5)].id)"
                  >
                  <a @click="clickCard(theatersList[index2+(index1*5)].id)">
                    <p>{{theatersList[index2+(index1*5)].title}}</p>
                  </a>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </p>
      </el-card>
      <el-card class="summary el_card">
        <div class="summary_title clearfix" slot="header">
          <h3>最新影评...</h3>
        </div>
        <div class="summary_com">
          <div class="List-item" v-for="(item, index) in articleList" :key="index">
            <div class="List-itemMeta">
              <div class="user">
                <img :src="item.user_avatar" alt>
                <span @click="goToPeople(item.user_name)">
                  <a>{{item.user_name}}</a>
                </span>
                <span class="ActivityItem-metaTitle">写了影评</span>
              </div>

              <span>{{item.date |time}}</span>
            </div>
            <div>
              <div class="listType1">
                <div>
                  <a @click="clickCard(item.movie_id)">
                    <img :src="item.movie_image" alt srcset>
                  </a>
                </div>
                <div style="margin-left: 10px;">
                  <div>
                    <div class="ContentItem-title">
                      <div style="width:330px;margin-bottom: 5px;">
                        <a @click="rowClick(item.article_id)">{{item.title}}</a>
                      </div>
                      <el-rate v-model="item.rating" disabled show-score text-color="#ff9900"></el-rate>
                    </div>

                    <div class="RichContent">{{item.topic}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="right">
      <el-card class="summary el_card">
        <div class="summary_title clearfix" slot="header">
          <h4>公告</h4>
        </div>
        <p class="summary_com">{{notice}}</p>
      </el-card>

      <el-card class="summary el_card">
        <div class="summary_title clearfix flex" slot="header">
          <h4>实时内地票房</h4>
          <span class="danwei">单位：万(总计)</span>
        </div>
        <div>
          <ul>
            <li v-for="(item, index) in cnBoxList" :key="index">
              <div class="flex box_list">
                <span class="no">{{item.Irank}}</span>
                <span class="movie_name" @click="clickCard(item.id)">
                  <a>{{item.MovieName}}</a>
                </span>
                <div class="box_num">
                  {{item.BoxOffice}}
                  ({{item.sumBoxOffice}})
                </div>
              </div>
            </li>
          </ul>
        </div>
      </el-card>

      <el-card class="summary el_card">
        <div class="summary_title clearfix flex" slot="header">
          <h4>一周北美票房</h4>
          <span class="danwei">单位：万(美元)</span>
        </div>
        <div>
          <ul>
            <li v-for="(item, index) in usBoxList.subjects" :key="index">
              <div class="flex box_list">
                <span class="no">{{item.rank}}</span>
                <span class="movie_name" @click="clickCard(item.subject.id)">
                  <a>{{item.subject.title}}</a>
                </span>
                <div class="box_num">{{item.box}}</div>
              </div>
            </li>
          </ul>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      theatersList: [
        {
          images: {
            large: ""
          },
          title: ""
        },
        {
          images: {
            large: ""
          },
          title: ""
        }
      ],
      articleList: [],
      cnBoxList: [],
      usBoxList: [],
      notice:'',
      show: false
    };
  },
  methods: {
    show1() {
      this.show = true;
    },
    getTheatersList() {
      this.$axios.get("/api/movie/in_theaters").then(res => {
        console.log(res.data.data.subjects);

        this.theatersList = res.data.data.subjects;
      });
    },
    getNewArticle() {
      this.$axios.post("/api/article/new").then(res => {
        this.articleList = res.data.data;
      });
    },
    getCnBox() {
      this.$axios.get("/api/boxoffice/cn").then(res => {
        this.cnBoxList = res.data.data;
      });
    },
    getUsBox() {
      this.$axios.get("/api/boxoffice/us").then(res => {
        this.usBoxList = res.data.data;
      });
    },
    getNotice() {
      this.$axios.post("/api/notice/new").then(res => {
        this.notice = res.data.data.content;
      });
    },
    clickCard(id) {
      this.$router.push({
        name: "movieinfo",
        params: { id }
      });
    },
    rowClick(id) {
      this.$router.push({
        name: "article",
        params: { id }
      });
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
    }
  },
  created() {
    this.getCnBox();
    this.getUsBox();
    this.getTheatersList();
    this.getNewArticle();
    this.getNotice();
  }
};
</script>

<style scoped>
#main {
  width: 1008px;
  /* padding: 0; */
  padding-top: 66px;
}
#main .left {
  width: 650px;
}
#main .left .el_card {
  margin-bottom: 25px;
}
#main .right {
  width: 300px;
}
#main .right .el_card {
  margin-bottom: 15px;
}

#Home {
  display: flex;
  justify-content: space-between;
}
.movie_name {
  flex: 1;
}
.el-carousel__item {
  display: flex;
}
.theaters_list {
  /* display: flex; */
}
.movie_card {
  width: 120px;
  padding: 10px;
}
.movie_card img {
  width: 100px;
  cursor: pointer;
}
.movie_card p {
  margin-top: 10px;
  text-align: center;
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
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  /* justify-content: center; */
  /* height: 45px; */
  padding: 5px;
  /* margin-left: 50px; */
}
.user img {
  height: 20px;
  width: 20px;
  border-radius: 50%;
}
.user span {
  margin-left: 8px;
  font-size: 14px;
}

.box_list {
  border-bottom: 1px dashed #ddd;
  padding: 0 0 7px 0;
  margin-bottom: 7px;
  line-height: 14px;
  display: flex;
  justify-content: space-between;
}
.no {
  width: 20px;
  font-size: 9px;
  text-align: center;
}
.danwei {
  position: relative;
  bottom: -20px;
  right: -80px;
}
</style>