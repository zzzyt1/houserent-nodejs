const express = require("express")
//创建路由对象
const router = express.Router()

const feedbackHandler = require("../router_handler/feedback_handler")

//获取用户反馈列表数据
router.get("/list", feedbackHandler.getFeedbackList)
//添加用户反馈
router.post("/add", feedbackHandler.addFeedback)
//回复用户反馈
router.post("/reply", feedbackHandler.replyFeedback)
//删除用户反馈
router.get("/delete/:id", feedbackHandler.deleteFeedback)
//根据id获取该用户的反馈信息
router.get("/info/:id", feedbackHandler.getFeedbackInfo)


module.exports = router
