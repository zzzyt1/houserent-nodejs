const express = require("express")
//创建路由对象
const router = express.Router()

const collectHandler = require("../router_handler/collect_handler")

//获取当前用户收藏列表数据
router.get("/list/:id", collectHandler.getCollectList)
//添加收藏
router.post("/add", collectHandler.addCollect)
//删除收藏
router.get("/delete/:id", collectHandler.deleteCollect)

module.exports = router