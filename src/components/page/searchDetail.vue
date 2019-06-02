<template>
  <div class="search-wrapper">
    <el-form ref="orderForm" :model="orderForm" label-width="80px" :label-position="labelPosition">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="姓名">
            <el-input v-model="orderForm.customer"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系电话">
            <el-input v-model="orderForm.tele"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="订单号">
            <el-input v-model="orderForm.order_id"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="房间类型">
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
          <el-form-item label="房间号">
            <el-input v-model="orderForm.room_code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="订单状态">
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
          <el-form-item label="入住时间">
            <el-date-picker
              v-model="orderForm.checkin_date"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            >type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="退房时间">
            <el-date-picker
              v-model="orderForm.checkout_date"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            >type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备注">
            <el-input type="textarea" autosize placeholder="请输入内容" v-model="orderForm.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20"></el-row>
      <el-form-item>
        <el-button type="primary" plain icon="el-icon-search" @click="onSubmit">搜索</el-button>
        <el-button
          type="info"
          plain
          icon="el-icon-circle-close-outline"
          @click="resetForm('orderForm')"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData && tableData.slice(pageSize*(currentPage-1),pageSize*currentPage)"
      border
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      >
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column label="订单号" prop="order_id" width="90px"></el-table-column>
      <el-table-column label="姓名" prop="customer" width="90px"></el-table-column>
      <el-table-column label="性别" prop="gender" width="70px"></el-table-column>
      <el-table-column label="电话" prop="tele" width="120px"></el-table-column>
      <el-table-column label="房间类型" prop="room_type" width="80px"></el-table-column>
      <el-table-column label="房间号" prop="room_code" width="80px"></el-table-column>
      <el-table-column label="订单状态" prop="order_status" width="80px"></el-table-column>
      <el-table-column label="入住时间" prop="checkin_date" width="110px"></el-table-column>
      <el-table-column label="退房时间" prop="checkout_date" width="110px"></el-table-column>
      <el-table-column label="入住天数" prop="total_date" width="80px" align="center"></el-table-column>
      <el-table-column label="房价/天" prop="univalent" width="80px"></el-table-column>
      <el-table-column label="总价" prop="total_price" width="70px"></el-table-column>
      <el-table-column label="备注" prop="remark" width="120px"></el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            plain
            @click="handleBatchDelete(selectData)"
            style="height: 28px;margin-top: 9px;"
          >批量删除</el-button>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
    ></el-pagination>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
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
        chenkin_data: "",
        checkout_data: "",
        total_data: "",
        remark: "",
        total_price: ""
      },
      // total_price: "",
      tableData: [],
      selectData: [],
      currentPage: 1, //初始页
      pageSize: 5, //每页的数据
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
      ]
    };
  },
  computed: {
    totalCount() {
      return this.tableData ? this.tableData.length : 0;
    },
    "orderForm.total_price"() {
      return this.orderForm.univalent * this.orderForm.total_date;
    },
    //拼接成sql语句进行搜索
    filter() {
      var that = this.orderForm;
      var searchList = "";
      if (that.customer != null && that.customer != "") {
        // searchList += "customer=" + that.customer;
        searchList += `customer like '%${that.customer}%' and `;
      }
      if (that.tele != null && that.tele != "") {
        searchList += `tele like '%${that.tele}%' and `;
      }
      if (that.room_type != null && that.room_type != "") {
        searchList += `room_type like '%${that.room_type}%' and `;
      }
      if (that.room_code != null && that.room_code != "") {
        searchList += `room_code like '%${that.room_code}%' and `;
      }
      if (that.order_status != null && that.order_status != "") {
        searchList += `order_status like '%${that.order_status}%' and `;
      }
      if (that.order_id != null && that.order_id != "") {
        searchList += `order_id like '%${that.order_id}%' and `;
      }
      if (that.checkin_date != null && that.checkin_date != "") {
        searchList += `checkin_date like '%${that.checkin_date}%' and `;
      }
      if (that.checkout_date != null && that.checkout_date != "") {
        searchList += `checkout_date like '%${that.checkout_date}%' and `;
      }
      if (that.remark != null && that.remark != "") {
        searchList += `remark like '%${that.remark}%' and `;
      }
      if (searchList.length > 0) {
        return searchList.slice(0, searchList.lastIndexOf("and"));
      }
      return "";
    }
  },
  created() {
    console.log("22", this.$route.params);
    if (this.$route.params && this.$route.params.roomCode) {
      console.log(this.$route.params.roomCode);
      this.orderForm["room_code"] = this.$route.params.roomCode;
      console.log(2, this.orderForm["room_code"]);
      this.onSubmit();
    }
  },
  methods: {
    onSubmit() {
      axios
        .get("/searchDetail", {
          params: {
            searchStr: this.filter
          }
        })
        .then(res => {
          //   this.$router.push({ name: "order" });
          // this.tableData = res.data["searchResult"];
          var dataArr = res.data["searchResult"];
          //空数组执行forEach方法会报错
          if (dataArr) {
            dataArr.forEach(function(value, index, arr) {
              value["total_price"] = value["univalent"] * value["total_date"];
            });
          }
          this.tableData = dataArr;
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
    },
    //数据选中处理 将选中记录id存入数组
    handleSelectionChange(val) {
      //val是所选中的记录组成的数组
      val.forEach((value, index, arr) => {
        arr[index] = value.order_id;
      });
      this.selectData = val;
    },
    //每页显示数据变化
    handleSizeChange: function(size) {
      this.pageSize = size;
    },
    //当前页变化
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
    },
    // //编辑订单
    handleEdit(index, row) {
      // console.log(index, row);
      this.$router.push({
        name: "orderEdit",
        params: {
          id: row.order_id,
          sourceFrom: "searchDetail"
        }
      });
    },
    //删除订单
    handleDelete(index, row) {
      console.log(index, row);
      axios
        .get("/delOrderById", {
          params: {
            id: row.order_id
          }
        })
        .then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          // console.log("del", res.data);
          // this.getOrdersInfo(this.currentPage, this.pageSize);
          this.onSubmit();
        })
        .catch(err => {
          console.log(err);
        });
    },
    //批量删除订单
    handleBatchDelete(idArr) {
      axios
        .get("/delOrderByBatch", {
          params: {
            idArr: JSON.stringify(idArr)
          }
        })
        .then(res => {
          this.$message({
            message: "批量删除成功",
            type: "success"
          });
          // this.getOrdersInfo(this.currentPage, this.pageSize);
          this.onSubmit();
        })
        .catch(err => {
          console.log(err);
        });
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
.search-wrapper {
  padding-top: 20px;
}
.el-row {
  /* margin-bottom: 25px; */
}
</style>
