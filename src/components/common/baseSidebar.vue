<template>
  <el-menu
    router
    :default-active="$route.path"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    style="height:100%"
  >
    <el-menu-item index="/home/personal" style="padding-left:10px;">
      <i class="el-icon-view"></i>
      <span slot="title">用户管理</span>
    </el-menu-item>
    <el-menu-item index="/home/main" style="padding-left:10px;">
      <i class="el-icon-menu"></i>
      <span slot="title">房态展示</span>
    </el-menu-item>
    <el-menu-item index="/home/maintenance" style="padding-left:10px;">
      <i class="el-icon-setting"></i>
      <span slot="title">房间管理</span>
    </el-menu-item>
    <el-submenu index="/home/order" style="padding-left:0px;">
      <template slot="title">
        <i class="el-icon-document"></i>
        <span slot="title">订单管理</span>
      </template>
      <el-menu-item index="/home/order">订单列表</el-menu-item>
      <el-menu-item index="/home/orderCreate">新建订单</el-menu-item>
    </el-submenu>
    <el-menu-item index="/home/search" style="padding-left:10px;">
      <i class="el-icon-search"></i>
      <span slot="title">搜索详情</span>
    </el-menu-item>
  </el-menu>
</template>
<script>
export default {
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    }
  }
};
</script>
<style scoped>
.el-submenu__icon-arrow {
  position: absolute;
  top: 50%;
  right: 10px !important;
  margin-top: -7px;
  -webkit-transition: -webkit-transform 0.3s;
  transition: -webkit-transform 0.3s;
  transition: transform 0.3s;
  transition: transform 0.3s, -webkit-transform 0.3s;
  transition: transform 0.3s, -webkit-transform 0.3s;
  font-size: 12px;
}
</style>
