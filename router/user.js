const express = require("express")
//创建路由对象
const router = express.Router()
//导入登录注册处理函数模块
const userHandler = require("../router_handler/user_handler")
//导入上传头像处理模块
const upload = require("../utils/upload")

//注册
router.post("/register", userHandler.register)

//登录
router.post("/login", userHandler.login)

//根据ID获取用户信息
router.get("/info/:id", userHandler.Info)

//获取全部用户信息
router.get("/all", userHandler.All)

//更改用户状态
router.post("/status", userHandler.Status)

//更改用户身份
router.post("/role", userHandler.Role)

//修改密码
router.post("/updatepwd", userHandler.UpdatePwd)

//更改用户信息
router.post("/updateinfo", userHandler.UpdateInfo)

// 上传头像
router.post('/upload', upload.single('file'), userHandler.upload);

//删除图片
router.post('/deleteimg', userHandler.deleteImg);



module.exports = router