const express = require('express');
const router = express.Router();
const dbApi = require('./dbapi');
//管理员登录
router.get('/login', (req, res, next) => {
  return dbApi.login(req, res, next);
});
//修改用户名或密码
router.post('/updateUser', (req, res, next) => {
  return dbApi.updateUser(req, res, next);
});
//获取用户名
router.get('/getUsername', (req, res, next) => {
  return dbApi.getUsername(req, res, next);
});
//获取验证码
router.get('/getCaptcha', (req, res, next) => {
  return dbApi.getCaptcha(req, res, next);
});
//添加房间信息
router.post('/addRoomInfo', (req, res, next) => {
  return dbApi.addRoomInfo(req, res, next);
});
//获取房间信息
router.get('/getRoomInfo', (req, res, next) => {
  return dbApi.getRoomInfo(req, res, next);
});
//修改房间信息
router.post('/updateRoomInfo', (req, res, next) => {
  return dbApi.updateRoomInfo(req, res, next);
});
//通过房间类型获取房间号
router.get('/getRoomCodeByType', (req, res, next) => {
  return dbApi.getRoomCodeByType(req, res, next);
});
//查询退房时间>入住时间的订单，找出不能使用的房间号（传入入住时间，与退房时间对比）  用户输入入住时间<退房时间 用户输入退房时间>入住时间
router.get('/getRoomCodeByDate', (req, res, next) => {
  return dbApi.getRoomCodeByDate(req, res, next);
});
//查询订单 入住状态 预订状态
router.get('/getOrderStatus', (req, res, next) => {
  return dbApi.getOrderStatus(req, res, next);
});
//获取订单数量
router.get('/getOrdersCount', (req, res, next) => {
  return dbApi.getOrdersCount(req, res, next);
});
//获取所有订单信息
router.get('/getOrdersInfo', (req, res, next) => {
  return dbApi.getOrdersInfo(req, res, next);
});
//获取某个订单信息
router.get('/getOrderInfo', (req, res, next) => {
  return dbApi.getOrderInfo(req, res, next);
});
//添加订单
router.post('/addOrders', (req, res, next) => {
  return dbApi.addOrders(req, res, next);
});
//编辑后添加订单
router.post('/editOrders', (req, res, next) => {
  return dbApi.editOrders(req, res, next);
});
//删除某个订单
router.get('/delOrderById', (req, res, next) => {
  return dbApi.delOrderById(req, res, next);
});
//批量删除订单
router.get('/delOrderByBatch', (req, res, next) => {
  return dbApi.delOrderByBatch(req, res, next);
});
//详细搜索
router.get('/searchDetail', (req, res, next) => {
  return dbApi.searchDetail(req, res, next);
});

module.exports = router;
