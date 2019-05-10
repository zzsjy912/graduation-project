<template>
  <div>
    <Header></Header>
    <div id="main">
      <router-view  v-if="$route.name == 'movieinfo'" :key="$route.fullPath" ></router-view>
      <router-view v-else></router-view>
    </div>
  <div class="foot">
    
        光影 ©2019 Created by Jianyu Zhu
      
  </div>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
import Header from '@/components/Header.vue'

export default {
  components:{
    Header
  },
  data() {
    return {
      userinfo:null,
    };
  },
  methods: {
    token() {
      var token = localStorage.getItem("Token");
      const decoded = jwt_decode(token);
      console.log(decoded);
    }
  },
  

};
</script>

<style scoped>
#main {
  width: 1008px;
  padding-top: 66px;
  margin: 0 auto;
}
.foot {
  /* background: #f0f2f5; */
    padding: 24px 50px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 12px;
    text-align: center;
    margin-top: 50px;
}
</style>
