const express = require("express")
//创建路由对象
const router = express.Router()

const newsHandler = require("../router_handler/news_handler")

// 获取消息列表
router.get("/list", newsHandler.getNewsList)
// 添加消息
router.post("/add", newsHandler.addNews)
// 删除消息
router.get("/delete/:id", newsHandler.deleteNews)
//编辑消息  
router.post("/edit", newsHandler.editNews)


module.exports = router
