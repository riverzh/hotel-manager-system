<template>
  <div>
    <div v-for="(roomArray,key,index1) in roomObj" :key="index1">
      <p class="title_custom">{{key}}</p>
      <ul>
        <li
          v-for="(item,index2) in roomArray"
          :key="index2"
          :class="item.colorClass"
          @click="goSearch(item.room_code)"
        >
          <p class="room_info1">{{item.room_code}}</p>
          <div class="room_info2">
            <p>{{item.room_state}}</p>
            <p>￥{{item.room_univalent}}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      roomObj: {}
    };
  },
  mounted() {
    this.getPartOrderStatus();
  },
  watch: {
    roomObj: {
      handler: function(newName, oldName) {},
      deep: true,
      immediate: true
    }
  },
  methods: {
    //通过在订单表中查询，获取入住和预定状态的订单所对应的房间号
    //       入住>=今天  入住<=今天<=退房
    getPartOrderStatus() {
      var date = this.formatDate();
      axios
        .get("/getOrderStatus", {
          params: {
            date: date
          }
        })
        .then(res => {
          let roomStatus = res.data.roomStatusResult;
          let roomStatusObj = {};
          console.log("111", roomStatus);
          roomStatus.forEach((value, index) => {
            if (!roomStatusObj[value["room_code"]]) {
              roomStatusObj[value["room_code"]] = value;
            } else {
              // roomStatusObj[value["room_code"]] = value;
              console.log(roomStatusObj[value["room_code"]]);
              console.log(value["checkin_date"]);
              //如果一个房间中有多个预订和入住的订单，取时间最小的订单的房间状态，确保显示最近时间的订单
              if (
                value["checkin_date"] <
                roomStatusObj[value["room_code"]]["checkin_date"]
              ) {
                console.log("000", value["checkin_date"]);
                roomStatusObj[value["room_code"]] = value;
              }
            }
          });
          console.log("roomStatusObj", roomStatusObj);
          this.getRoomInfo(roomStatusObj);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取所有的房间，把订单中查到的预订和入住之外的其他房间置为空房
    getRoomInfo(partRoomStatusObj) {
      axios
        .get("/getRoomInfo")
        .then(res => {
          const roomData = res.data;
          const roomObj = {};
          console.log("roomData", roomData);
          roomData.forEach((value, index) => {
            roomData[index]["room_state"] = "空房";
          });
          roomData.forEach((value, index) => {
            for (var prop in partRoomStatusObj) {
              if (prop == value["room_code"]) {
                roomData[index]["room_state"] =
                  partRoomStatusObj[prop]["order_status"];
              }
            }
          });
          roomData.forEach((value, index, arr) => {
            if (!roomObj[value.room_type]) {
              roomObj[value.room_type] = [];
            }
            if (value.room_state == "空房") {
              value["colorClass"] = "success-color";
            } else if (value.room_state == "预订") {
              value["colorClass"] = "warning-color";
            } else if (value.room_state == "入住") {
              value["colorClass"] = "danger-color";
            } else if (value.room_state == "维护") {
              value["colorClass"] = "info-color";
            }
          });
          roomData.map((value, index, arr) => {
            for (let prop in roomObj) {
              if (prop == value.room_type) {
                roomObj[prop].push(value);
              }
            }
          });
          this.roomObj = roomObj;
        })
        .catch(err => {
          console.log(err);
        });
    },
    formatDate() {
      var formate = "";
      var date = new Date();
      var year = date.getFullYear();
      var mouth = date.getMonth() + 1;
      var day = date.getDate();
      if (day < 9 && day > 0) {
        day = "0" + day;
      }
      if (mouth < 9 && day > 0) {
        mouth = "0" + mouth;
      }
      formate = year + "-" + mouth + "-" + day;
      return formate;
    },
    goSearch(roomCode) {
      console.log(roomCode);
      this.$router.push({
        name: "searchDetail",
        params: { roomCode: roomCode }
      });
    }
  }
};
</script>
<style scoped>
ul {
  list-style: none;
  width: 100%;
  height: 60px;
  color: "#67C23A";
}
li {
  float: left;
  width: 100px;
  height: 60px;
  border: 1px solid black;
  border-radius: 4px;
  /* padding-left: 20px; */
  margin-bottom: 10px;
  margin-right: 25px;
  text-align: center;
  cursor: pointer;
}
.room_info1 {
  font-size: 18px;
  height: 18px;
  line-height: 18px;
  margin: 10px auto;
}
.room_info2 {
  display: flex;
  flex: space-between;
  margin-top: 5px;
}
.room_info2 p {
  height: 16px;
  line-height: 16px;
  font-size: 16px;
  margin: 0 auto;
}
.title_custom {
  padding: 20px 0 20px 40px;
  font-weight: 700;
  color: rgb(84, 92, 100);
}
.success-color {
  background-color: rgba(103, 194, 58, 0.1);
  border-color: rgba(103, 194, 58, 0.2);
  color: #67c23a;
}
.warning-color {
  background-color: rgba(230, 162, 60, 0.1);
  border-color: rgba(230, 162, 60, 0.2);
  color: #e6a23c;
}
.danger-color {
  background-color: rgba(245, 108, 108, 0.1);
  border-color: rgba(245, 108, 108, 0.2);
  color: #f56c6c;
}
.info-color {
  background-color: rgba(144, 147, 153, 0.1);
  border-color: rgba(144, 147, 153, 0.2);
  color: #909399;
}
</style>
