<template>
  <div class="roomMaintenance-wrapper">
    <el-form
      :rules="rules"
      :model="roomForm"
      ref="roomForm"
      label-width="80px"
      :label-position="labelPosition"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="房间类型" prop="room_type">
            <el-select v-model="roomForm.room_type" placeholder="请选择房间类型" style="width:100%;">
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
          <el-form-item label="房间号" prop="room_code">
            <!-- <el-select v-model="roomForm.room_code" placeholder="请输入房间号码" style="width:100%;">
              <el-option
                v-for="item in codeOptions"
                :key="item['room_code']"
                :label="item['room_code']"
                :value="item['room_code']"
              ></el-option>
            </el-select>-->
            <el-input v-model="roomForm.room_code" placeholder="请输入房间号码" style="width=80%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="房间状态" prop="room_state">
            <el-select v-model="roomForm.room_state" placeholder="房间状态" style="width:100%;">
              <el-option
                v-for="option in stateOptions"
                :key="option.label"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="单价/天" prop="room_univalent">
            <el-input v-model="roomForm.room_univalent" placeholder="单价/天" style="width=80%;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="(onAddSubmit('roomForm'))">添加</el-button>
        <el-button type="primary" @click="(onUpdateSubmit('roomForm'))">修改</el-button>
        <el-button @click="resetForm('roomForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      labelPosition: "left",
      roomForm: {
        room_type: "",
        room_code: "",
        room_state: "",
        room_univalent: ""
      },
      //房间号选项
      codeOptions: "",
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
      //房间状态选项
      stateOptions: [
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
          label: "空房"
        }
        // {
        //   value: "维护",
        //   label: "维护"
        // }
      ],
      rules: {
        room_type: [
          { required: true, message: "请选择房间类型", trigger: "change" }
        ],
        room_code: [
          { required: true, message: "请输入房间号码", trigger: "blur" }
        ],
        room_state: [
          { required: true, message: "请选择房间状态", trigger: "change" }
        ],
        room_univalent: [
          { required: true, message: "请输入单价/天", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    // "roomForm.room_type": {
    //   handler(newVal, oldVal) {
    //     if (newVal != "" && oldVal != "") {
    //       this.roomForm.room_code = "";
    //     }
    //     this.getRoomCodeByType(newVal);
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  methods: {
    //获取不同房间类型对应的房间号
    getRoomCodeByType(room_type) {
      axios
        .get("/getRoomCodeByType", {
          params: {
            room_type: room_type
          }
        })
        .then(res => {
          console.log("type", res.data["roomCodeResult"]);
          this.codeOptions = res.data["roomCodeResult"];
        })
        .catch(err => {
          console.log(err);
        });
    },
    onUpdateSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateRoomInfo();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    onAddSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addRoomInfo();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //添加房间
    addRoomInfo() {
      axios
        .post("/addRoomInfo", this.roomForm)
        .then(res => {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.$router.push({ name: "main" });
        })
        .catch(err => {
          console.log(err);
        });
    },
    //修改房间
    updateRoomInfo() {
      // axios
      //   .get("/updateRoomInfo", {
      //     params: {
      //       roomInfo: this.roomForm
      //     }
      //   })
      //   .then(res => {
      //     //   console.log(res.data);
      //     this.$message({
      //       message: "修改成功",
      //       type: "success"
      //     });
      //     this.$router.push({ name: "main" });
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
      axios
        .post("/updateRoomInfo", this.roomForm)
        .then(res => {
          //   console.log(res.data);
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.$router.push({ name: "main" });
        })
        .catch(err => {
          console.log(err);
        });
    },
    resetForm(formName) {
      //   this.$refs[formName].resetFields();
      for (var prop in this.roomForm) {
        this.roomForm[prop] = "";
      }
    }
  }
};
</script>
<style scoped>
</style>
