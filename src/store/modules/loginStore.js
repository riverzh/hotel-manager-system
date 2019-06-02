import axios from 'axios'
const state = {
  isLogin: ""
}
const getters = {
  isLogin: state => {
    return state.isLogin
  },
}
const mutations = {
  login(state, payload) {
    state.isLogin = payload;
  },
  logout(state, payload) {
    state.isLogin = payload;
  }
}
const actions = {
  login({
    commit
  }, params) {
    axios.get("/login", {
      params: {
        username: params.username,
        password: params.password
      }
    }).then((res) => {
      let payload = res.data.statusCode;
      // console.log("res1", res);
      // sessionStorage.setItem('token', JSON.stringify(res.data.token));
      //   sessionStorage.setItem('user', JSON.stringify(user));
      if (payload == 1) {
        commit("login", payload);
      } else {
        payload = new Date().getTime();
        commit("login", payload);
      }
    }).catch((err) => {
      console.log(err);
    });
  },
  // async login({
  //   commit
  // }, params) {
  //   let res = await axios.get("/login", {
  //     params: {
  //       username: params.username,
  //       password: params.password
  //     }
  //   });
  //   let payload = res.statusCode;
  //   console.log("resres", res);
  //   sessionStorage.setItem('token', JSON.stringify(res.token));
  //   //   sessionStorage.setItem('user', JSON.stringify(user));
  //   commit("login", payload);
  // },
  //登出 待验证
  logout({
    commit
  }) {
    sessionStorage.removeItem('user');
    // sessionStorage.removeItem('token');
    commit('logout', null);
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
