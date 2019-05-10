<template>
  <div class="login">
    <div class="form">
      <el-form status-icon ref="user" label-width="100px" class="demo-ruleForm">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="user.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button type="primary" @click="Register">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style>
.login {
  display: flex;
  justify-content: center;
  padding: 50px;
}
.form {
  max-width: 500px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  padding-right: 28px;
}
</style>

<script>
import jwt_decode from "jwt-decode";
export default {
  data() {
    return {
      user: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    submitForm() {
      this.$axios.post("api/users/login", this.user).then(res => {
        // 登陆成功
        console.log(res);
        const { token } = res.data;
        // 解析token
        const decoded = jwt_decode(token);

        localStorage.setItem("Token", token);
        if (res.data.data.isban == 1) {
          this.$message({
            message: "该账户被冻结",
            type: "error"
          });
          return
        }
        this.$message({
          message: "登陆成功",
          type: "success"
        });
        this.$store.commit("setUserinfo", res.data.data);
        window.localStorage.setItem(
          "setUserinfo",
          JSON.stringify(res.data.data)
        );
        this.$router.push("/home");
      });
    },
    Register() {
      this.$router.push({
        name: "Register"
      });
    }
  }
};
</script>