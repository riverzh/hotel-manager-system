const mysql = require('mysql');
const dbConf = require('./db');
const svgCaptcha = require('svg-captcha');

const pool = mysql.createPool({
  host: dbConf.mysql.host,
  user: dbConf.mysql.user,
  password: dbConf.mysql.password,
  database: dbConf.mysql.database,
  port: dbConf.mysql.port,
  multipleStatements: dbConf.mysql.multipleStatements
});

//管理员登录
const dbLogin = function (user, pwd) {
  return new Promise((resolve, reject) => {
    const sql = `select count(*) as result from user where username = '${user}' 
    and password = '${pwd}'`;
    pool.getConnection((err, connection) => {
      if (err) {
        console.log("数据库连接池连接失败");
      } else {
        connection.query(sql, (err, result) => {
          // console.log("sql2", sql);
          // console.log("result", result);
          resolve(result);
          connection.release();
        });
      }
    });
  });
}
//获取用户名
const dbGetUsername = function () {
  return new Promise((resolve, reject) => {
    const sql = `select username from user`;
    pool.getConnection((err, connection) => {
      if (err) {
        console.log("数据库连接池连接失败");
      } else {
        connection.query(sql, (err, result) => {
          resolve(result);
          connection.release();
        });
      }
    });
  });
}
//修改用户名或密码
const dbUpdateUser = function (user, pwd, oldPwd) {
  return new Promise((resolve, reject) => {
    // const sql = `update user set username = '${user}',password = '${pwd}'`;
    const sql = `update user set password = '${pwd}' where username = '${user}' and password = '${oldPwd}'`;
    pool.getConnection((err, connection) => {
      if (err) {
        console.log("数据库连接池连接失败");
      } else {
        connection.query(sql, (err, result) => {
          resolve(result);
          connection.release();
        });
      }
    });
  });
}
//获取房间信息
const dbGetRoomInfo = function () {
  return new Promise((resolve, reject) => {
    const sql = `select * from room`;
    pool.getConnection((err, connection) => {
      if (err) {
        console.log("数据库连接池连接失败");
      } else {
        connection.query(sql, (err, result) => {
          resolve(result);
          connection.release();
        });
      }
    });
  });
}
//修改房间信息
const dbUpdateRoomInfo = function (roomInfo) {
  return new Promise((resolve, reject) => {
    var sql = `update room set room_state = '${roomInfo.room_state}' ,room_univalent = '${roomInfo.room_univalent}' where room_code = '${roomInfo.room_code}'`;
    if (roomInfo.room_univalent == "" || roomInfo.room_univalent == null) {
      sql = `update room set room_state = '${roomInfo.room_state}' where room_code = '${roomInfo.room_code}'`;
    }
    if (roomInfo.room_state == "" || roomInfo.room_state == null) {
      sql = `update room set room_univalent = '${roomInfo.room_univalent}' where room_code = '${roomInfo.room_code}'`;
    }
    pool.getConnection((err, connection) => {
      if (err) {
        console.log("数据库连接池连接失败");
      } else {
        connection.query(sql, (err, result) => {
          resolve(result);
          connection.release();
        });
      }
    });
  });
}
//添加房间信息
const dbAddRoomInfo = function (roomInfo) {
  return new Promise((resolve, reject) => {
    var sql = `insert into room values('${roomInfo.room_code}','${roomInfo.room_type}','${roomInfo.room_state}','${roomInfo.room_univalent}');`;
    if (roomInfo.room_univalent == "" || roomInfo.room_univalent == null) {
      `insert into room values('${roomInfo.room_code}','${roomInfo.room_type}','${roomInfo.room_state}',null);`;
    }
    pool.getConnection((err, connection) => {
      if (err) {
        console.log("数据库连接池连接失败");
      } else {
        connection.query(sql, (err, result) => {
          resolve(result);
          connection.release();
        });
      }
    });
  });
}
//根据房间类型获取房间
const dbGetRoomCodeByType = function (room_type) {
  return new Promise((resolve, reject) => {
    const sql = `select room_code from room where room_type = '${room_type}'`;
    pool.getConnection((err, connection) => {
      if (err) {
        console.log("数据库连接池连接失败");
      } else {
        connection.query(sql, (err, result) => {
          resolve(result);
          connection.release();
        });
      }
    });
  });
}
//根据  入住(用户) <= 退房   &&  退房（用户） >= 入住,找出不满足条件的房间
const dbGetRoomCodeByDate = function (checkin_date, room_type, checkout_date) {
  return new Promise((resolve, reject) => {
    //  入住(用户) <= 退房   &&  退房（用户） >= 入住
    const sql = `select room_code from orders where  checkout_date >= '${checkin_date}' and checkin_date <= '${checkout_date}' and room_type = '${room_type}'`;
    pool.getConnection((err, connection) => {
      if (err) {
        console.log("数据库连接池连接失败");
      } else {
        connection.query(sql, (err, result) => {
          resolve(result);
          connection.release();
        });
      }
    });
  });
}
//获取订单数量
const dbGetOrdersCount = function () {
  return new Promise((resolve, reject) => {
    const sql = `select count(*) as result from orders`;
    pool.getConnection((err, connection) => {
      if (err) {
        console.log("数据库连接池连接失败");
      } else {
        connection.query(sql, (err, result) => {
          resolve(result);
          connection.release();
        });
      }
    });
  });
}
//获取分页订单数据(根据入住时间排序)
const dbGetOrdersInfo = function (currentPage, pageSize) {
  return new Promise((resolve, reject) => {
    let sql = `select * from orders order by checkin_date desc limit ${pageSize*(currentPage-1)},${pageSize}`;
    if (!currentPage && !pageSize) {
      sql = `select * from orders order by checkin_date desc`;
    }
    // if (currentPage && pageSize) {
    //   const sql = `select * from orders limit ${pageSize*(currentPage-1)},${pageSize}`;
    // } else {
    //   const sql = `select * from orders`;
    // }
    pool.getConnection((err, connection) => {
      if (err) {
        console.log("数据库连接池连接失败");
      } else {
        connection.query(sql, (err, result) => {
          resolve(result);
          connection.release();
        });
      }
    });
  });
}
//通过订单获取房间状态      入住>=今天  入住<=今天<=退房
const dbGetOrderStatus = function (date) {
  return new Promise((resolve, reject) => {
    const sql = `select * from orders where checkin_date >= '${date}' or (checkin_date <= '${date}' and checkout_date >= '${date}')`;
    // const sql = `select * from orders where order_id = ${order_id}`;
    console.log(sql);
    pool.getConnection((err, connection) => {
      if (err) {
        console.log("数据库连接池连接失败");
      } else {
        connection.query(sql, (err, result) => {
          console.log("status", result);
          resolve(result);
          connection.release();
        });
      }
    });
  });
}
//获取某个订单信息
const dbGetOrderInfo = function (order_id) {
  return new Promise((resolve, reject) => {
    const sql = `select * from orders where order_id = ${order_id}`;
    pool.getConnection((err, connection) => {
      if (err) {
        console.log("数据库连接池连接失败");
      } else {
        connection.query(sql, (err, result) => {
          resolve(result);
          connection.release();
        });
      }
    });
  });
}
//添加订单
const dbAddOrders = function (orderForm) {
  return new Promise((resolve, reject) => {
    // var sql = `insert into orders values('${Math.round(Math.random()*100000000)}','${orderForm.customer}','${orderForm.gender}','${orderForm.tele}','${orderForm.room_type}','${orderForm.room_code}','${orderForm.order_status}','${orderForm.checkin_date}','${orderForm.checkout_date}','${orderForm.total_date}','${orderForm.univalent}','${orderForm.remark}');update room set room_state = '${orderForm.order_status}' where room_code = '${orderForm.room_code}';`;
    var sql = `insert into orders values('${Math.round(Math.random()*100000000)}','${orderForm.customer}','${orderForm.gender}','${orderForm.tele}','${orderForm.room_type}','${orderForm.room_code}','${orderForm.order_status}','${orderForm.checkin_date}','${orderForm.checkout_date}','${orderForm.total_date}','${orderForm.univalent}','${orderForm.remark}');`;
    pool.getConnection((err, connection) => {
      if (err) {
        console.log("数据库连接池连接失败");
      } else {
        connection.query(sql, (err, result) => {
          resolve(result);
          connection.release();
        });
      }
    });
  });
}
//编辑后添加订单
const dbEditOrders = function (orderForm) {
  return new Promise((resolve, reject) => {
    // const sql = `update orders set customer = '${orderForm.customer}',gender = '${orderForm.gender}',tele = '${orderForm.tele}',room_type = '${orderForm.room_type}',room_code = '${orderForm.room_code}',order_status = '${orderForm.order_status}',checkin_date = '${orderForm.checkin_date}',checkout_date = '${orderForm.checkout_date}',total_date = '${orderForm.total_date}',univalent = '${orderForm.univalent}',remark = '${orderForm.remark}' where order_id = '${orderForm.order_id}';update room set room_state = '${orderForm.order_status}' where room_code = '${orderForm.room_code}';`;
    const sql = `update orders set customer = '${orderForm.customer}',gender = '${orderForm.gender}',tele = '${orderForm.tele}',room_type = '${orderForm.room_type}',room_code = '${orderForm.room_code}',order_status = '${orderForm.order_status}',checkin_date = '${orderForm.checkin_date}',checkout_date = '${orderForm.checkout_date}',total_date = '${orderForm.total_date}',univalent = '${orderForm.univalent}',remark = '${orderForm.remark}' where order_id = '${orderForm.order_id}';`;
    pool.getConnection((err, connection) => {
      if (err) {
        console.log("数据库连接池连接失败");
      } else {
        connection.query(sql, (err, result) => {
          resolve(result);
          connection.release();
        });
      }
    });
  });
}
//通过id删除某个订单
const dbDelOrderById = function (id) {
  return new Promise((resolve, reject) => {
    const sql = `delete from orders where order_id = '${id}'`;
    pool.getConnection((err, connection) => {
      if (err) {
        console.log("数据库连接池连接失败");
      } else {
        connection.query(sql, (err, result) => {
          resolve(result);
          connection.release();
        });
      }
    });
  });
}
//通过id批量删除订单
const dbDelOrderByBatch = function (idArr) {
  return new Promise((resolve, reject) => {
    let idStr = idArr.join(',');
    const sql = `delete from orders where order_id in (${idStr})`;
    pool.getConnection((err, connection) => {
      if (err) {
        console.log("数据库连接池连接失败");
      } else {
        connection.query(sql, (err, result) => {
          resolve(result);
          connection.release();
        });
      }
    });
  });
}
const dbSearchDetail = function (searchStr) {
  return new Promise((resolve, reject) => {
    const sql = `select * from orders where ${searchStr};`;
    pool.getConnection((err, connection) => {
      if (err) {
        console.log("数据库连接池连接失败");
      } else {
        connection.query(sql, (err, result) => {
          resolve(result);
          connection.release();
        });
      }
    });
  });
}
module.exports = {
  async login(req, res, next) {
    // let username = req.query.username;
    // let password = req.query.password;
    let loginData = await dbLogin(req.query.username, req.query.password);
    if (loginData[0].result == 1) {
      return res.json({
        statusCode: '1',
        message: '登录成功',
        // token: '4eea90fd-2752-481d-ae67-c75f8641a94a'
      })
    } else {
      return res.json({
        statusCode: '-1',
        message: '登录失败'
      })
    }
  },
  //修改用户名或密码
  async updateUser(req, res, next) {
    let user = req.body.username;
    let pwd = req.body.password;
    let oldPwd = req.body.oldPassword;
    let userResult = await dbUpdateUser(user, pwd, oldPwd);
    if (userResult.affectedRows == 1) {
      return res.json({
        statusCode: "1",
        message: "用户信息修改成功"
      });
    } else {
      return res.json({
        statusCode: "-1",
        message: "请输入正确的用户名或密码"
      });
    }
  },
  //获取用户名
  async getUsername(req, res, next) {
    let username = await dbGetUsername();
    return res.json({
      username: username
    });
  },
  //生成验证码
  getCaptcha(req, res, next) {
    var captcha = svgCaptcha.create({
      //反转颜色
      inverse: false,
      //字体大小
      fontSize: 36,
      //噪声线条数
      width: 80,
      height: 38
    });
    //captcha.text生成四位验证码，保存到session中，忽略大小写
    req.session = captcha.text.toLocaleLowerCase();
    //保存到cookie中，方便前端调用(安装了cookie-parser，可在项目中使用cookie)
    res.cookie('captcha', req.session);
    res.setHeader('Content-Type',
      'image/svg+xml');
    //captcha.data是svg图片
    res.write(String(captcha.data));
    res.end();
  },
  async getRoomInfo(req, res, next) {
    let roomList = await dbGetRoomInfo();
    return res.json(roomList);
  },
  async getOrdersInfo(req, res, next) {
    if (req.query.currentPage && req.query.pageSize) {
      var currentPage = JSON.parse(req.query.currentPage);
      var pageSize = JSON.parse(req.query.pageSize);
    } else {
      var currentPage = "";
      var pageSize = "";
    }
    // let currentPage = JSON.parse(req.query.currentPage);
    // let pageSize = JSON.parse(req.query.pageSize);
    let orderList = await dbGetOrdersInfo(currentPage, pageSize);
    return res.json(orderList);
  },
  async getOrderInfo(req, res, next) {
    let order_id = JSON.parse(req.query.order_id);
    let orderList = await dbGetOrderInfo(order_id);
    return res.json(orderList);
  },
  async addOrders(req, res, next) {
    // let orderForm = req.query.orderForm;
    // let orderForm = JSON.parse(req.query.orderForm);
    let orderForm = req.body;
    let addOrdersResult = await dbAddOrders(orderForm);
    return res.json({
      statusCode: 1,
      message: '添加成功',
      addOrdersResult: addOrdersResult
    });
  },
  async editOrders(req, res, next) {
    // let orderForm = JSON.parse(req.query.orderForm);
    let orderForm = req.body;
    let editOrdersResult = await dbEditOrders(orderForm);
    return res.json({
      statusCode: 1,
      message: '修改成功',
    });
  },
  async getOrdersCount(req, res, next) {
    let ordersCount = await dbGetOrdersCount();
    return res.json({
      totalCount: ordersCount[0]["result"]
    });
  },
  async delOrderById(req, res, next) {
    let id = JSON.parse(req.query.id);
    let delResult = await dbDelOrderById(id);
    return res.json({
      statusCode: 1,
      message: "删除成功"
    });
  },
  async delOrderByBatch(req, res, next) {
    let idArr = JSON.parse(req.query.idArr);
    let delResult = await dbDelOrderByBatch(idArr);
    return res.json({
      statusCode: 1,
      message: "批量删除成功"
    });
  },
  async searchDetail(req, res, next) {
    let searchStr = req.query.searchStr;
    let searchResult = await dbSearchDetail(searchStr);
    return res.json({
      searchResult: searchResult
    });
  },
  async updateRoomInfo(req, res, next) {
    let roomInfo = req.body;
    let updateResult = await dbUpdateRoomInfo(roomInfo);
    return res.json({
      statusCode: 1,
      message: "房间信息修改成功"
    });
  },
  async addRoomInfo(req, res, next) {
    let roomInfo = req.body;
    let addResult = await dbAddRoomInfo(roomInfo);
    return res.json({
      statusCode: 1,
      message: "房间信息添加成功"
    });
  },
  async getRoomCodeByType(req, res, next) {
    let room_type = req.query.room_type;
    let roomCodeResult = await dbGetRoomCodeByType(room_type);
    return res.json({
      roomCodeResult: roomCodeResult
    });
  },
  async getRoomCodeByDate(req, res, next) {
    let checkin_date = req.query.checkin_date;
    let checkout_date = req.query.checkout_date;
    let room_type = req.query.room_type;
    let roomCodeResult = await dbGetRoomCodeByDate(checkin_date, room_type, checkout_date);
    return res.json({
      roomCodeResult: roomCodeResult
    });
  },
  async getOrderStatus(req, res, next) {
    let date = req.query.date;
    let roomStatusResult = await dbGetOrderStatus(date);
    return res.json({
      roomStatusResult: roomStatusResult
    });
  },
}
