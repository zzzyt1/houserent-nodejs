const db = require('../db/index')
const nowtime = require('../utils/date')
const { sendEmail } = require("../utils/sendEmail"); //发送邮件
// 添加订单
exports.Add = (req, res) => {
  const orderInfo = req.body
  const sql = `insert into orders set ?`
  const nowt = new Date();
  const ordermsg = {
    customer_id: orderInfo.customerid,
    owner_id: orderInfo.ownerid,
    house_id: orderInfo.houseid,
    o_status: orderInfo.status,
    month_rent: orderInfo.monthrent,
    day_num: orderInfo.daynum,
    total_amount: orderInfo.totalamount,
    start_date: orderInfo.startdate,
    end_date: orderInfo.enddate,
    create_time: nowtime.getDate(),
    order_number: nowt.toISOString().slice(0, 19).replace(/\D/g, ''),
  }
  db.query(sql, ordermsg, async (err, results) => {
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      })
    }
    if (results.affectedRows !== 1) {
      return res.json({
        status: 400,
        message: '添加订单失败，请稍后重试'
      })
    }
    res.json({
      status: 200,
      message: '添加订单成功',
      data: ordermsg
    })
  })
}

//获取订单列表
exports.GetList = (req, res) => {
  const sql = `select * from orders ORDER BY id DESC`
  db.query(sql, (err, results) => {
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      })
    }
    res.json({
      status: 200,
      message: '获取订单列表成功',
      data: results
    })
  })
}

//根据房东id获取订单详情
exports.GetOrderByownerId = (req, res) => {
  const sql = `select * from orders where owner_id=? ORDER BY id DESC`
  db.query(sql, req.params.id, (err, results) => {
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      })
    }
    res.json({
      status: 200,
      message: '获取订单详情成功',
      data: results
    })
  })
}

//根据租客id获取订单详情
exports.GetOrderBycustomerId = (req, res) => {
  const sql = `select * from orders where customer_id=? ORDER BY id DESC`
  db.query(sql, req.params.id, (err, results) => {
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      })
    }
    res.json({
      status: 200,
      message: '获取订单详情成功',
      data: results
    })
  })
}

//修改订单状态
exports.UpdateOrderStatus = (req, res) => {
  const sql = `update orders set o_status=? where id=?`
  db.query(sql, [req.body.status, req.body.id], async (err, results) => {
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      })
    }
    if (results.affectedRows !== 1) {
      return res.json({
        status: 400,
        message: '修改订单状态失败，请稍后重试'
      })
    }
    // 确保 customerEmail 和 ownerEmail 是有效的电子邮件地址
    try {
      if (!validateEmail(req.body.customerEmail) || !validateEmail(req.body.ownerEmail)) {
        throw new Error('无效的电子邮件地址');
      }
      //发送邮件
      if (req.body.status >= 0 && req.body.houseTitle) { // 0生效中 1已退租 2待审核
        //租客邮箱，房东邮箱，状态，订单号，房源标题
        await sendEmail(req.body.customerEmail, req.body.ownerEmail, req.body.status, req.body.orderNumber, req.body.houseTitle)
      }
    } catch (error) {
      console.error(error.message);
      // 处理错误，例如返回一个错误响应
      return res.json({
        status: 200,
        message: '修改订单状态成功，但租客或房东的电子邮件地址无效，邮件发送失败'
      })
    }
    res.json({
      status: 200,
      message: '修改订单状态成功'
    })
  })
}
// 验证电子邮件地址的函数
function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

//根据订单号获取订单详情
exports.GetOrderByorderNo = (req, res) => {
  const sql = `select * from orders where order_number=?`
  db.query(sql, req.params.id, (err, results) => {
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      })
    }
    res.json({
      status: 200,
      message: '获取订单详情成功',
      data: results
    })
  })
}

//获取生效中的订单
exports.GetEffectOrder = (req, res) => {
  const sql = `select * from orders where o_status= 0`;
  db.query(sql, (err, results) => {
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      })
    }
    res.json({
      status: 200,
      message: '获取生效中的订单成功',
      data: results
    })
  })
}