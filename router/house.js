const express = require("express")
//创建路由对象
const router = express.Router()
const houseHandler = require("../router_handler/house_handler")

//添加新房源
router.post("/add", houseHandler.addHouse)
//获取房源列表
router.get("/list", houseHandler.getHouseList)
//查询未租出的房子
router.get("/unrented", houseHandler.getUnrentedHouse);
//编辑房源
router.post("/edit", houseHandler.editHouse)
//修改房源状态
router.post("/status", houseHandler.changeHouseStatus)
//根据ID获取房源信息
router.get("/:id", houseHandler.getHouseById)
// 我的家列表
router.post("/my", houseHandler.getMyHouseList)
//根据名称、城市、类型、价格和面积区间查询房源
router.post("/search", houseHandler.searchHouse)
//根据房东ID获取房源信息
router.get("/owner/:id", houseHandler.getHouseByOwnerId)

module.exports = router