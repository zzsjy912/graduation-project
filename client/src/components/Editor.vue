<template>
  <div id="Editor" v-show="show">
    <div class="mask"></div>
    <div class="Editor_main">
      <div class="top">
        <div>
          <img :src="info.img" alt>
          <p>{{info.name}}</p>
        </div>
        <el-rate style="    margin-right: 10px;
    width: 140px;    display: block;" v-model="rating" allow-half="true" show-score text-color="#ff9900"></el-rate>
      </div>
      <input type="text" v-model="title" placeholder="请输入标题">
      <div id="wangedit_toolbar" ref="wangedit_toolbar"></div>
      <div id="myWangEditor" class="myWangEditor" ref="myWangEditor">
        <p>请输入内容</p>
      </div>
      <el-button @click="add" type="primary">提交</el-button>
      <!-- <el-button @click="add2" type="primary">提交</el-button> -->
      <!-- <el-button @click="getinfo">查询</el-button> -->
      <!-- <div ref="cont" v-html="editorContent2"></div> -->
    </div>
    <div class="back" @click="back">X</div>
  </div>
</template>

<script>
import wangEditor from "wangeditor"; //引入刚npm安装的wangeditor插件

export default {
  name: "MyWangEditor",
  data() {
    return {
      editorContent: "", //内容
      editorContent2: "",
      rating: "",
      title: "",
      info:{
        name:'',
        img:''
      },
      show: false,
      userinfo:null,
      editorText:''
    };
  },
  created() {},
  mounted() {
    var _this = this;
    var editor = new wangEditor(
      this.$refs.wangedit_toolbar,
      this.$refs.myWangEditor
    ); //实例化wangeditor
    editor.customConfig = {
      onchange: html => {
        this.editorContent = html;
        this.editorText = editor.txt.text();
      },
      uploadImgMaxSize: 3 * 1024 * 1024, // 将图片大小限制为 3M
      uploadImgMaxLength: 1, // 限制一次最多上传 1 张图片
      uploadFileName: "myFileName", //设置上传图片文件的时候，后台接受的文件名，files.myFileName;
      withCredentials: true, //跨域上传中如果需要传递 cookie 需设置 withCredentials
      uploadImgTimeout: 3000, //自定义 timeout 时间，这里是设置的3秒
      uploadImgServer: "/api/article/upload" //上传到后台的接口
    }; /*editor.customConfig.uploadImgParams = {//如果要自定义传一些参数，就在这里；
			    　　　　　　　　// 如果版本 <=v3.1.0 ，属性值会自动进行 encode ，此处无需 encode
			    　　　　　　　　// 如果版本 >=v3.1.1 ，属性值不会自动 encode ，如有需要自己手动 encode
			    　　　　　　　　img_name:_this.img_name,
			    　　　　　　　　token: 'abcdef12345'
			　　　　　　};*/
    this.toListenUp(editor); //监听上传的各个阶段
    editor.create();
  },
  methods: {
    toListenUp: function(editor) {
      //监听上传图片的几个阶段，和做相应的处理
      var _this = this;
      editor.customConfig.uploadImgHooks = {
        before: function(xhr, editor, files) {
          // 图片上传之前触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
          // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
          // return {
          //     prevent: true,
          //     msg: '放弃上传'
          // }
        },
        success: function(xhr, editor, result) {
          // 图片上传并返回结果，图片插入成功之后触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        fail: function(xhr, editor, result) {
          // 图片上传并返回结果，但图片插入错误时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        error: function(xhr, editor) {
          // 图片上传出错时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },
        timeout: function(xhr, editor) {
          // 图片上传超时时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },

        // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
        // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
        customInsert: function(insertImg, result, editor) {
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果// 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          var url = result.data[0]; //获取后台返回的图片路径
          insertImg(url); //把图片路径展示在编辑器里面
          // result 必须是一个 JSON 格式字符串！！！否则报错
        }
      };
    },
    add() {

      let req = {
        movie_id: this.info.id,
        user_name: this.userinfo.name,
        user_avatar: this.userinfo.avatar,
        title: this.title,
        topic: this.editorText.slice(0,220),
        content: this.editorContent,
        rating: this.rating
      };
      console.log(this.editorContent);
      this.$axios.post("/api/article/add", req).then(res => {
        console.log(res);
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.$emit('ok');
        this.show = false;
      });
    },
    // add2() {
    //   console.log(this.editorText.slice(0,0));
      
    // },
    back() {
      this.show = false;
    },
    getinfo() {
      this.$axios.post("/api/article/details", { id: 0 }).then(res => {
        console.log(res.data);
        this.editorContent2 = res.data.data.content;
      });
    }
  },
  created() {
    this.info = this.$store.state.Movieinfo ;
    this.userinfo =JSON.parse(localStorage.getItem("setUserinfo")) ;
  },
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
#Editor {
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
  height: 130px;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  background-color: #f8f8f8;
}

.top img {
  height: 66px;
}
.top > div {
  display: flex;
}
.top > div p {
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
  /* max-height: calc(100vh - 140px); */
  height: 800px;
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
  width: 100%;
  height: 629px;
  /* height: calc(100vh - 248px); */
}
#myWangEditor img {
  width: 100%;
}
</style>