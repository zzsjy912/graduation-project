<template>
  <div id="register">
    <el-upload
      class="avatar-uploader"
      action="123"
      :http-request="upload"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="register.avatar" :src="register.avatar" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>

    <el-form :model="register" status-icon label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="register.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="register.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="email" prop="email">
        <el-input v-model="register.email"></el-input>
      </el-form-item>
      <el-form-item label="用户类型">
        <el-select v-model="register.identity" placeholder="用户类型">
          <el-option label="用户" value="0"></el-option>
          <el-option label="管理员" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style >
#register {
    margin: 138px auto;
    display: flex;
    justify-content: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>


<script>
export default {
  data() {
    return {
      register: {
        name: "",
        password: "",
        email: "",
        identity: "",
        avatar: ""
      },
    };
  },
  methods: {
    submitForm() {
      this.$axios
        .post("api/users/register", this.register)
        .then(res => {
          // 注册成功
          console.log(res);
          this.$message({
            message: "账号注册成功",
            type: "success"
          });
          this.$router.push("/login");
        })
        .catch(err => {
          console.log(err);
        });
    },
    upload(file){
      console.log(file);
      const formData = new FormData();
      formData.append('avatar', file.file);
      this.$axios.post("api/users/addavatar",formData,{
        headers: { 'content-type': 'multipart/form-data' }})
        .then(res => {
        console.log(res);
        var url = res.data.data.url
        console.log(url);
        this.register.avatar = url;
      })
      .catch(err => {
        console.log(err);
        
      })
    },
    handleAvatarSuccess(res, file) {
      this.avatar = URL.createObjectURL(file.raw);
      // this.$axios.post("api/users/addavatar").then(res => {
      //   console.log(res);
        
      // })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>