<template>
  <div class="personal-wrapper">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="70px"
      :labelPosition="labelPosition"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input type="password" v-model="ruleForm.oldPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    var checkUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error("用户名不能为空"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validateoldPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入旧密码"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      labelPosition: "left",
      ruleForm: {
        password: "",
        checkPass: "",
        username: "",
        oldPassword: ""
      },
      rules: {
        password: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        username: [{ validator: checkUsername, trigger: "blur" }],
        oldPassword: [{ validator: validateoldPass, trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.getUsername();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios
            .post("/updateUser", {
              username: this.ruleForm.username,
              password: this.ruleForm.password,
              oldPassword: this.ruleForm.oldPassword
            })
            .then(res => {
              if (res.data.statusCode == 1) {
                this.$message({
                  message: "信息修改成功",
                  type: "success"
                });
              } else {
                this.$message.warning("请输入正确的旧密码");
              }
              this.resetForm("ruleForm");
              this.getUsername();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getUsername() {
      axios
        .get("/getUsername")
        .then(res => {
          this.ruleForm.username = res.data["username"][0]["username"];
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
 <style scoped>
.personal-wrapper {
  width: 30%;
  margin: 0 auto;
}
</style>
  


