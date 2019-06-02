<template>
  <div id="app" style="height:100vh">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      appHeight: this.getHeight()
    };
  },
  methods: {
    getHeight() {
      return window.innerHeight;
    }
  }
};
</script>

<style>
#app {
  /* 
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
</style>
