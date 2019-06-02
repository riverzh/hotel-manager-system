<template>
  <div class="create-wrapper">
    <p class="tips">请选择房间类型、入住时间、退房时间，系统将自动为您筛选可使用的房间号</p>
    <el-form
      ref="orderForm"
      :rules="rules"
      :model="orderForm"
      label-width="80px"
      :label-position="labelPosition"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="房间类型" prop="room_type">
            <el-select v-model="orderForm.room_type" placeholder="请选择">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入住时间" prop="checkin_date" required @click="typeValid">
            <el-date-picker
              v-model="orderForm.checkin_date"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="退房时间" prop="checkout_date" required>
            <el-date-picker
              v-model="orderForm.checkout_date"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="房间号" prop="room_code">
            <el-select v-model="orderForm.room_code" placeholder="请选择" @click="checkinValid">
              <el-option
                v-for="(item,index) in codeOptions"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入住天数" prop="total_date">
            <el-input v-model="orderForm.total_date"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="订单状态" prop="order_status">
            <el-select v-model="orderForm.order_status" placeholder="请选择">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="姓名" prop="customer">
            <el-input v-model="orderForm.customer"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系电话" prop="tele" required>
            <el-input v-model="orderForm.tele"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="orderForm.gender">
              <el-radio label="男"></el-radio>
              <el-radio label="女"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="单价/天" prop="univalent">
            <el-input v-model="orderForm.univalent"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备注">
            <el-input type="textarea" autosize placeholder="请输入内容" v-model="orderForm.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('orderForm')">保存</el-button>
        <el-button @click="resetForm('orderForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    var validateTele = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("联系电话不能为空"));
      }
      setTimeout(() => {
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(value)) {
          callback(new Error("联系电话格式有误"));
        } else {
          callback();
        }
      }, 1000);
    };
    return {
      labelPosition: "left",
      orderForm: {
        order_id: "",
        customer: "",
        tele: "",
        gender: "",
        room_code: "",
        order_status: "",
        room_type: "",
        univalent: "",
        checkin_date: "",
        checkout_date: "",
        total_date: "",
        remark: ""
      },
      tempCode: "",
      //不满足条件的房间号码
      uncodeRoom: "",
      //同一类型的房间号
      codeOptionsByType: "",
      //房间号选项
      codeOptions: "",
      //房间状态选项
      statusOptions: [
        {
          value: "预订",
          label: "预订"
        },
        {
          value: "入住",
          label: "入住"
        },
        {
          value: "空房",
          label: "退房"
        }
      ],
      //房间类型选项
      typeOptions: [
        {
          value: "单人间",
          label: "单人间"
        },
        {
          value: "标准间",
          label: "标准间"
        },
        {
          value: "豪华间",
          label: "豪华间"
        },
        {
          value: "商务间",
          label: "商务间"
        },
        {
          value: "豪华套间",
          label: "豪华套间"
        }
      ],
      //校验规则
      rules: {
        customer: [
          { required: true, message: "请输入客人姓名", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        tele: [{ validator: validateTele, trigger: "blur" }],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        room_type: [
          { required: true, message: "请选择房间类型", trigger: "change" }
        ],
        room_code: [
          { required: true, message: "请选择房间号", trigger: "change" }
        ],
        order_status: [
          { required: true, message: "请选择订单状态", trigger: "change" }
        ],
        checkin_date: [
          {
            type: "string",
            required: true,
            message: "请选择入住时间",
            trigger: "change"
          }
        ],
        checkout_date: [
          {
            type: "string",
            required: true,
            message: "请选择退房时间",
            trigger: "change"
          }
        ],
        total_date: [
          { required: true, message: "请输入入住天数", trigger: "blur" }
        ],
        univalent: [
          { required: true, message: "请输入房间单价/天", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    //编辑订单
    if (this.$route.params && this.$route.params.id) {
      axios
        .get("/getOrderInfo", {
          params: {
            order_id: this.$route.params.id
          }
        })
        .then(res => {
          // this.orderForm = res.data[0];
          this.orderForm.order_id = res.data[0]["order_id"];
          this.orderForm.customer = res.data[0]["customer"];
          this.orderForm.tele = res.data[0]["tele"];
          this.orderForm.gender = res.data[0]["gender"];
          this.orderForm.room_code = res.data[0]["room_code"];
          this.orderForm.order_status = res.data[0]["order_status"];
          this.orderForm.room_type = res.data[0]["room_type"];
          this.orderForm.univalent = res.data[0]["univalent"];
          this.orderForm.checkin_date = res.data[0]["checkin_date"];
          this.orderForm.checkout_date = res.data[0]["checkout_date"];
          this.orderForm.total_date = res.data[0]["total_date"];
          this.orderForm.remark = res.data[0]["remark"];
          this.tempCode = res.data[0]["room_code"];
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {
    //监听房间类型
    "orderForm.room_type": {
      handler(newVal, oldVal) {
        if (newVal != "" && oldVal != "") {
          this.orderForm.room_code = "";
          this.orderForm.checkin_date = "";
          this.orderForm.checkout_date = "";
          this.codeOptions = "";
        }
        //获取当前所选房间类型的所有房间
        this.getRoomCodeByType(newVal);
      },
      deep: true,
      immediate: true
    },
    //监听入住时间，获取房间号
    "orderForm.checkin_date": {
      handler(newVal, oldVal) {
        if (newVal != "" && oldVal != "") {
          this.orderForm.room_code = "";
          this.codeOptions = "";
          //通过房间类型、入住时间、退房时间获取空闲的房间号
          this.getRoomCodeByDate(
            this.orderForm.checkout_date,
            this.orderForm.room_type,
            newVal
          );
          return;
        }
        if (newVal !== "" && oldVal == "") {
          this.orderForm.room_code = "";
          this.codeOptions = "";
          console.log("bnew", newVal);
          this.getRoomCodeByDate(
            this.orderForm.checkout_date,
            this.orderForm.room_type,
            newVal
          );
          this.orderForm.room_code = this.tempCode;
        }
      },
      deep: true,
      immediate: true
    },
    //监听退房时间，获取房间号
    "orderForm.checkout_date": {
      handler(newVal, oldVal) {
        if (newVal != "" && oldVal != "") {
          this.orderForm.room_code = "";
          this.codeOptions = "";
          //通过房间类型、入住时间、退房时间获取空闲的房间号
          this.getRoomCodeByDate(
            newVal,
            this.orderForm.room_type,
            this.orderForm.checkin_date
          );
          return;
        }
        if (newVal !== "" && oldVal == "") {
          this.orderForm.room_code = "";
          this.codeOptions = "";
          console.log("bnew", newVal);
          this.getRoomCodeByDate(
            newVal,
            this.orderForm.room_type,
            this.orderForm.checkin_date
          );
          this.orderForm.room_code = this.tempCode;
          return;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    checkinValid() {
      if (this.orderForm.checkin_date == "") {
        this.$message({
          showClose: true,
          message: "请先选择入住日期！",
          type: "warning"
        });
      }
    },
    typeValid() {
      if (this.orderForm.room_type == "") {
        this.$message({
          showClose: true,
          message: "请先选择房间类型！",
          type: "warning"
        });
      }
    },
    getRoomCodeByType(room_type) {
      axios
        .get("/getRoomCodeByType", {
          params: {
            room_type: room_type
          }
        })
        .then(res => {
          var arr = [];
          res.data["roomCodeResult"].forEach(ele => {
            arr.push(ele["room_code"]);
          });
          this.codeOptionsByType = arr;
          console.log("this.codeOptionsByType", this.codeOptionsByType);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //通过在订单中找出被预定或入住的订单所对应的房间，将其排除在外    退房 >= 入住(用户) && 入住 <=退房（用户）
    getRoomCodeByDate(checkout_date, room_type, checkin_date) {
      console.log(room_type);
      if (!checkout_date) {
        return;
      }
      if (!checkin_date) {
        return;
      }
      if (checkout_date <= checkin_date) {
        return;
      }
      axios
        .get("/getRoomCodeByDate", {
          params: {
            checkin_date: checkin_date,
            room_type: room_type,
            checkout_date: checkout_date
          }
        })
        .then(res => {
          var arr = [];
          res.data["roomCodeResult"].forEach(ele => {
            arr.push(ele["room_code"]);
          });
          this.uncodeRoom = arr;
          console.log("被预订或入住的房间", this.uncodeRoom);
          console.log("该房间类型下的所有房间", this.codeOptionsByType);
          this.getRoomCodeByType(this.orderForm.room_type);
          //两个数组，去重
          setTimeout(() => {
            this.codeOptions = this.handleRoomCode(
              this.uncodeRoom,
              this.codeOptionsByType
            );
          }, 0);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取筛选出的符合条件的房间号  两数组去重
    handleRoomCode(arr1, arr2) {
      console.log("arr211", arr2);
      var obj = new Object();
      //arr1数组去重
      for (var i = 0; i < arr1.length; i++) {
        if (!obj[arr1[i]]) {
          //没有这个属性，第一次出现，未重复
          obj[arr1[i]] = arr1[i]; //给对象添加属性
        }
      }
      console.log("ooj", obj);
      //arr2去除arr1中的内容
      for (var prop in obj) {
        console.log("arr2for", arr2);
        for (var j = 0; j < arr2.length; j++) {
          if (arr2[j] == prop) {
            arr2.splice(j, 1);
            j--;
          }
        }
      }
      console.log("arr2", arr2);
      return arr2;
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.orderForm.order_id) {
            this.editOrders();
          } else {
            this.addOrders();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addOrders() {
      axios
        .post("/addOrders", this.orderForm)
        .then(res => {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.$router.push({ name: "order" });
        })
        .catch(err => {
          console.log(err);
        });
    },
    editOrders() {
      axios
        .post("/editOrders", this.orderForm)
        .then(res => {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          if (this.$route.params.sourceFrom == "orderList") {
            this.$router.push({ name: "order" });
          } else {
            this.$router.push({ name: "searchDetail" });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    resetForm(formName) {
      // this.$refs[formName].resetFields();
      for (var prop in this.orderForm) {
        if (prop != "order_id") {
          this.orderForm[prop] = "";
        }
      }
    }
  }
};
</script>
<style scoped>
.el-select {
  width: 100%;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
.create-wrapper {
  padding-top: 50px;
}
.el-row {
  margin-bottom: 25px;
}
.tips {
  margin-bottom: 50px;
}
</style>
