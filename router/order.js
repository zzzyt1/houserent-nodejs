const express = require("express")
//创建路由对象
const router = express.Router()

const orderHandler = require("../router_handler/order_handler")

//添加订单
router.post("/add", orderHandler.Add)
//获取订单列表
router.get("/list", orderHandler.GetList)
//根据房东id获取订单详情
router.get("/ownerid/:id", orderHandler.GetOrderByownerId)
//根据租客id获取订单详情
router.get("/customerid/:id", orderHandler.GetOrderBycustomerId)
//修改订单状态
router.post("/status", orderHandler.UpdateOrderStatus)
//根据订单号获取订单详情
router.get("/orderNo/:id", orderHandler.GetOrderByorderNo)
//获取生效中的订单
router.get("/effective", orderHandler.GetEffectOrder)
module.exports = router