<template>
  <div class="order-wrapper">
    <!-- :data="tableData.filter(data => !search || data.customer.toLowerCase().includes(search.toLowerCase()))" -->
    <!-- :data="allTableData.filter(data => 
    !this.searchData || data.room_type.includes(this.searchData))"-->
    <el-table
      :data="tableData.filter(data => !searchData || data.checkin_date.includes(this.searchData) || data.checkout_date.includes(this.searchData)|| data.room_type.includes(this.searchData) ||
          data.customer.includes(this.searchData) ||  data.univalent.includes(this.searchData) || data.total_date.includes(this.searchData) || data.gender.includes(this.searchData) || data.room_code.includes(this.searchData) || data.order_status.includes(this.searchData) || data.remark.includes(this.searchData))"
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
          <div style="display: flex;justify-content: space-between;width:100%">
            <el-input
              v-model="searchData"
              prefix-icon="el-icon-search"
              size="mini"
              placeholder="输入当前页关键字搜索"
              style="padding-left:3px;"
            />
            <el-button
              size="mini"
              type="primary"
              plain
              @click="$router.push({name:'orderCreate'});"
              style="height:28px;margin-top: 9px;"
            >新建订单</el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              @click="handleBatchDelete(selectData)"
              style="height: 28px;margin-top: 9px;"
            >批量删除</el-button>
          </div>
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
      tableData: [],
      allTableData: [],
      searchData: "",
      searchResult: [],
      currentPage: 1, //初始页
      pageSize: 10, //每页的数据
      totalCount: 1,
      selectData: []
    };
  },
  //内存中的模板已挂载到页面中
  mounted() {
    this.getTotalCount();
    this.getOrdersInfo();
    this.getOrdersInfo(this.currentPage, this.pageSize);
  },
  methods: {
    // handleSearch() {
    //   if (this.searchData) {
    //     // debugger;
    //     this.tableData = this.allTableData.filter(
    //       data =>
    //         data.order_id.includes(this.searchData) ||
    //         data.room_type.includes(this.searchData) ||
    //         data.customer.includes(this.searchData) ||
    //         data.gender.includes(this.searchData) ||
    //         data.tele.includes(this.searchData) ||
    //         data.room_code.includes(this.searchData) ||
    //         data.order_status.includes(this.searchData) ||
    //         data.chenkin_date.includes(this.searchData) ||
    //         data.chenkout_date.includes(this.searchData) ||
    //         data.total_date.includes(this.searchData) ||
    //         data.univalent.includes(this.searchData) ||
    //         data.remark.includes(this.searchData)
    //     );
    //   } else {
    //     this.getOrdersInfo(this.currentPage, this.pageSize);
    //   }
    // },
    //每页显示数据变化
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getOrdersInfo(this.currentPage, this.pageSize);
    },
    //当前页变化
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getOrdersInfo(this.currentPage, this.pageSize);
    },
    //获取总记录数
    getTotalCount() {
      axios
        .get("/getOrdersCount")
        .then(res => {
          this.totalCount = res.data["totalCount"];
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取分页数据
    getOrdersInfo(currentPage, pageSize) {
      if (!currentPage) {
        currentPage = "";
      }
      if (!pageSize) {
        pageSize = "";
      }
      axios
        .get("/getOrdersInfo", {
          params: {
            currentPage: currentPage,
            pageSize: pageSize
          }
        })
        .then(res => {
          if (currentPage && pageSize) {
            // this.tableData = res.data;
            var dataArr = res.data;
            dataArr.forEach(function(value, index, arr) {
              value["total_price"] = value["univalent"] * value["total_date"];
            });
            this.tableData = dataArr;
          } else {
            // this.allTableData = res.data;
            var dataArr = res.data;
            dataArr.forEach(function(value, index, arr) {
              value["total_price"] = value["univalent"] * value["total_date"];
            });
            this.allTableData = dataArr;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //编辑订单
    handleEdit(index, row) {
      // console.log(index, row);
      this.$router.push({
        name: "orderEdit",
        params: {
          id: row.order_id,
          sourceFrom: "orderList"
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
          this.getOrdersInfo(this.currentPage, this.pageSize);
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
          this.getOrdersInfo(this.currentPage, this.pageSize);
          this.getTotalCount();
        })
        .catch(err => {
          console.log(err);
        });
    },
    //数据选中处理 将选中记录id存入数组
    handleSelectionChange(val) {
      //val是数组，存放了选中的订单，将数组中的订单替换为订单号
      val.forEach((value, index, arr) => {
        arr[index] = value.order_id;
      });
      this.selectData = val;
    }
  }
};
</script>
<style scoped>
.el-table th div {
  width: 200px;
}
.el-pagination {
  white-space: nowrap;
  padding: 2px 5px;
  color: #303133;
  font-weight: 700;
  margin-top: 20px;
}
.el-input__icon {
  height: 100%;
  width: 25px;
  text-align: center;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  line-height: 40px;
  padding-left: 10px;
}
</style>

