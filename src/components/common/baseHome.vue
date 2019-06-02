<template>
  <el-container style="height:100%">
    <el-header>
      <base-header></base-header>
    </el-header>
    <el-container>
      <el-aside style="width:150px;">
        <base-sidebar></base-sidebar>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import baseHeader from "@/components/common/baseHeader";
import baseSidebar from "@/components/common/baseSidebar";
export default {
  components: {
    baseHeader,
    baseSidebar
  }
};
</script>
<style scoped>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  /* line-height: 160px; */
  padding-top: 50px;
}
</style>
