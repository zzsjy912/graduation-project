<template>
  <div id="SearchBar">
    <a-input-search
      placeholder="输入搜索 电影"
      v-model="keywords"
      @search="onSearch"
      enterButton
      @change="change"
    />
    <div id="search_suggest" v-if="search_suggest">
      <ul>
        <li v-for="(item, index) in data" :key="index">
          <a @click="clickRow(item)">
            <img :src="item.img" alt>
            <p>
              <em>{{item.title}}</em>
              <span>{{item.year}}</span>
              <br>
              <span>{{item.sub_title}}</span>
            </p>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import keys from "@/config/keys.js";
var options = {
  url: keys.doubanOptions.searchUrl,
  headers: keys.doubanOptions.headers
};
var timer = false;
export default {
  data() {
    return {
      keywords: "",
      data: [],
      search_suggest : false
    };
  },
  methods: {
    getSearch(keywords) {
      this.$axios
        .get("/api/search/subject_suggest", { params: { q: keywords } })
        .then(res => {
          console.log(res.data);
          this.data = res.data.data;
          this.search_suggest = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    onSearch() {
      console.log(this.keywords);
    },
    change() {
      console.log(this.keywords + "!");
      if (this.keywords == "") {
        return;
      }
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        this.getSearch(this.keywords);
        clearInterval(timer);
      }, 600);
    },
    clickRow(item) {
      this.$router.push({
        name: 'movieinfo',
        params: {id:item.id}
      });
      this.keywords = '';
      this.search_suggest = false;
    }
  }
};
</script>

<style scoped>
input {
  background: #f6f6f6 !important;
}
#search_suggest {
  width: 324px;
  position: absolute;
  /* top: 78px; */
  left: 319.406px;
  background: #fff;
  border: 1px solid #ddd;
  position: absolute;
  z-index: 99;
  top: 42px;
  /* width: 302px; */
  border-top: 0 none;
}
#search_suggest li {
  border-bottom: 1px solid #eee;
  overflow: hidden;
}
#search_suggest li a {
  color: #999;
  display: block;
  overflow: hidden;
  padding: 6px;
  zoom: 1;
}
#search_suggest li img {
  float: left;
  height: 40px;
  margin-right: 8px;
  margin-top: 3px;
}
#search_suggest li p {
  margin: 0;
  zoom: 1;
  overflow: hidden;
}
#search_suggest li a {
  color: #999;
  display: block;
  overflow: hidden;
  padding: 6px;
  zoom: 1;
}
#search_suggest li a em {
  font-style: normal;
  color: #369;
}
</style>
