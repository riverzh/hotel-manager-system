<template>
  <div class="login-wrapper">
    <div class="login-container">
      <h2 style="text-align:center;">欢迎登录酒店管理系统</h2>
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
        label-width="100px"
        class="demo-ruleForm"
        :label-position="labelPosition"
      >
        <el-form-item label="用户名" prop="username" placeholder="请输入用户名">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item type="password" label="密码" prop="password" placeholder="请输入密码">
          <el-input v-model="loginForm.password" show-password></el-input>
        </el-form-item>
        <!-- required -->
        <el-form-item
          label="验证码"
          prop="identifying"
          placeholder="请输入验证码"
          style="position:relative;"
        >
          <el-input v-model="loginForm.identifying" width="70%"></el-input>
          <div
            @click="refreshIdentifying"
            style="position:absolute;top:0px;right:0px;border:1px solid black;width:80px;height:38px;"
          >
            <!-- style="display:inline-block;width:82px;height:38px;border:1px solid black" -->
            <img src="/getCaptcha" alt ref="imgIdentifying">
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm',loginForm)">登录</el-button>
          <el-button @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from "vuex";
export default {
  name: "login",
  data() {
    return {
      labelPosition: "left",
      loginForm: {
        username: "",
        password: "",
        identifying: ""
      },
      rules: {
        identifying: [
          { required: true, message: "请输入验证码", trigger: "blur" }
        ],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.refreshIdentifying();
  },
  computed: {
    // ...mapGetters(["loginStore/isLogin"])
    ...mapGetters("loginStore", {
      isLogin: "isLogin"
    })
  },
  watch: {
    isLogin(val, oldVal) {
      if (val == 1) {
        this.$message.success("登录成功");
        //  this.$store.commit("loginStore/logout", 0);
        this.$router.push({ name: "main" });
      } else {
        this.$message.warning("请输入正确的用户名或密码");
        this.resetForm("loginForm");
        this.refreshIdentifying();
        this.loginForm.identifying = "";
      }
    }
  },
  methods: {
    submitForm(formName, formObj) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let captcha = document.cookie.split("=")[2];
          console.log("captcha11", document.cookie);
          if (this.loginForm.identifying != captcha) {
            this.$message.warning("验证码错误");
            return;
          }
          this.$store.dispatch("loginStore/login", formObj);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //获取验证码
    refreshIdentifying() {
      this.$refs.imgIdentifying.src = "/getCaptcha?d=" + Math.random();
    }
  }
};
</script>
<style scoped>
.login-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  background: url("../../assets/loginbg4.jpeg") no-repeat;
  background-size: cover;
}
.login-container {
  width: 400px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -50px;
  margin-top: -190px;
  /* border: 2px solid #409eff; */
  padding: 10px 30px;
  border-radius: 5px;
  background-color: #fff;
}
</style>

