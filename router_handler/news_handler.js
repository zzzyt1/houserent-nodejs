const db = require('../db/index')
const nowtime = require('../utils/date')

// 获取新闻列表
exports.getNewsList = (req, res) => {
  const sql = 'select * from news where is_delete=0 order by id desc'
  db.query(sql, (err, results) => {
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      })
    }
    res.json({
      status: 200,
      message: '获取消息列表成功',
      data: results
    })
  })
}

// 添加消息
exports.addNews = (req, res) => {
  const newsInfo = req.body
  const newsmsg = {
    create_time: nowtime.getDate(),
    title: newsInfo.title,
    content: newsInfo.content,
    houseid: newsInfo.houseid,
  }
  const sql = 'insert into news set ?'
  db.query(sql, newsmsg, (err, results) => {
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      })
    }
    if (results.affectedRows !== 1) {
      return res.send({
        status: 400,
        message: '添加消息失败，请稍后重试'
      })
    }
    res.json({
      status: 200,
      message: '添加消息成功',
      data: newsmsg
    })
  })
}

// 删除消息
exports.deleteNews = (req, res) => {
  const sql = 'update news set is_delete=1 where id=?'
  db.query(sql, req.params.id, (err, results) => {
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      })
    }
    if (results.affectedRows !== 1) {
      return res.json({
        status: 400,
        message: '删除失败，请稍后重试'
      })
    }
    res.json({
      status: 200,
      message: '删除成功'
    })
  })
}

//编辑消息 
exports.editNews = (req, res) => {
  const sql = 'update news set ? where id=?'
  db.query(sql, [req.body, req.body.id], (err, results) => {
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      })
    }
    if (results.affectedRows !== 1) {
      return res.json({
        status: 400,
        message: '编辑失败，请稍后重试'
      })
    }
    res.json({
      status: 200,
      message: '编辑成功'
    })
  })
}