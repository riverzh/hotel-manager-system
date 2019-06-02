<template>
  <div class="header-wrapper">
    <div class="header-title">酒店管理系统</div>
    <div class="header-msg">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          <img class="user-logo" src="@/assets/logo.png" alt>
          {{username}}
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="personal">个人中心</el-dropdown-item>
          <el-dropdown-item command="exit">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      username: ""
    };
  },
  created() {
    this.getUsername();
  },
  methods: {
    handleCommand(command) {
      // this.$message("click " + command);
      if (command == "personal") {
        this.$router.push({ name: "userManage" });
      } else if (command == "exit") {
        this.$store.commit("loginStore/logout", "");
        this.$router.push({ name: "login" });
        this.$message("退出登录成功");
      }
    },
    getUsername() {
      axios
        .get("/getUsername")
        .then(res => {
          // console.log("resl.data", res.data["username"][0]["username"]);
          this.username = res.data["username"][0]["username"];
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style>
.header-wrapper {
  display: flex;
  justify-content: space-between;
  /* background-color: #545c64; */
}
.user-logo {
  /* margin-top: 10px; */
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding-right: 10px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  /* justify-content: center; */
}
.header-title {
  font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
  font-size: 25px;
  color: #fff;
}
</style>
