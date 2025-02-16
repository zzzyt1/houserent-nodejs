const db = require('../db/index')
const nowtime = require('../utils/date')


//获取当前用户收藏列表数据
exports.getCollectList = (req, res) => {
  //查询语句
  const sqlStr = 'select * from collect where user_id = ? order by id desc'
  //执行sql语句
  db.query(sqlStr, req.params.id, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      })
    }
    // 执行 SQL 语句成功
    res.send({
      status: 200,
      message: '获取收藏列表成功！',
      data: results
    })
  })
}

//添加收藏
exports.addCollect = (req, res) => {
  const collectmsg = req.body
  const msg = {
    user_id: collectmsg.userid,
    house_id: collectmsg.houseid,
    create_time: nowtime.getDate(),
    title: collectmsg.title,
    address: collectmsg.address,
    month_rent: collectmsg.monthrent,
    img: collectmsg.img,
  }
  //查询语句
  const sqlStr = 'select * from collect where user_id = ? and house_id = ?'
  //执行sql语句
  db.query(sqlStr, [msg.user_id, msg.house_id], (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      })
    }
    // 执行 SQL 语句成功
    if (results.length > 0) {
      //收藏过了
      return res.send({
        status: 201,
        message: '该商品已收藏！'
      })
    }
    //没有收藏过
    //添加收藏
    const sqlStr = 'insert into collect set ?'
    //执行sql语句
    db.query(sqlStr, msg, (err, results) => {
      // 执行 SQL 语句失败
      if (err) {
        return res.send({
          status: 400,
          message: err.message
        })
      }
      // 执行 SQL 语句成功
      res.send({
        status: 200,
        message: '收藏成功！'
      })
    })
  })
}

//删除收藏
exports.deleteCollect = (req, res) => {
  //删除语句
  const sqlStr = 'delete from collect where id = ?'
  //执行sql语句
  db.query(sqlStr, req.params.id, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      })
    }
    // 执行 SQL 语句成功
    res.send({
      status: 200,
      message: '取消收藏成功！'
    })
  })
}