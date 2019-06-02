<template>
  <div class="main-wrapper">
    <el-tag type="success" class="tag-margin">空&nbsp;房</el-tag>
    <el-tag type="warning" class="tag-margin">预&nbsp;订</el-tag>
    <el-tag type="danger" class="tag-margin">入&nbsp;住</el-tag>
    <!-- <el-tag type="info" class="tag-margin">维&nbsp;护</el-tag> -->
    <!-- <el-tag>标签一</el-tag> -->
    <roomList></roomList>
  </div>
</template>
<script>
import roomList from "@/components/common/roomList";
export default {
  data() {
    return {};
  },
  components: {
    roomList
  }
};
</script>
<style>
.main-wrapper {
  text-align: left;
  line-height: 0px;
}
.tag-margin {
  margin-left: 40px;
}
</style>
