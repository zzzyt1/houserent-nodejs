const db = require('../db/index')
const nowtime = require('../utils/date')

//获取用户反馈列表数据
exports.getFeedbackList = (req, res) => {
  const sql = `select * from feedback where is_delete=0 order by id desc`
  db.query(sql, (err, results) => {
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      })
    }
    res.json({
      status: 200,
      message: '获取用户反馈列表成功',
      data: results
    })
  });
}

//添加用户反馈
exports.addFeedback = (req, res) => {
  const feedbackInfo = req.body
  const feedbackmsg = {
    create_time: nowtime.getDate(),
    title: feedbackInfo.title,
    content: feedbackInfo.content,
    contact_name: feedbackInfo.name,
    contact_email: feedbackInfo.email,
    user_id: feedbackInfo.id
  }
  const sql = 'insert into feedback set ?'
  db.query(sql, feedbackmsg, (err, results) => {
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      })
    }
    if (results.affectedRows !== 1) {
      return res.send({
        status: 400,
        message: '添加用户反馈失败，请稍后重试'
      })
    }
    res.json({
      status: 200,
      message: '添加用户反馈成功',
      data: feedbackmsg
    })
  })
}

//回复用户反馈
exports.replyFeedback = (req, res) => {
  const feedbackInfo = req.body
  const sqlId = 'select status from feedback where id = ?';
  db.query(sqlId, feedbackInfo.id, (err, results) => {
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      })

    }
    if (results[0].status == 1) {
      return res.send({
        status: 400,
        message: '该反馈已回复，请勿重复回复'
      })
    }
    const sql = 'update feedback set status=1, reply=? where id=?'
    db.query(sql, [feedbackInfo.reply, feedbackInfo.id], (err, results) => {
      if (err) {
        return res.send({
          status: 400,
          message: err.message
        })
      }
      if (results.affectedRows !== 1) {
        return res.send({
          status: 400,
          message: '回复用户反馈失败，请稍后重试'
        })
      }
      res.json({
        status: 200,
        message: '回复用户反馈成功',
        data: feedbackInfo
      })
    })
  })
}

//删除用户反馈
exports.deleteFeedback = (req, res) => {
  const sql = 'update feedback set is_delete=1 where id=? '
  db.query(sql, req.params.id, (err, results) => {
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      })
    }
    if (results.affectedRows !== 1) {
      return res.send({
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
//根据用户id获取该用户的反馈信息
exports.getFeedbackInfo = (req, res) => {
  const sql = 'select * from feedback where is_delete=0 and user_id=? order by id desc'
  db.query(sql, req.params.id, (err, results) => {
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      })
    }
    res.json({
      status: 200,
      message: '获取用户反馈信息成功',
      data: results
    })
  })
}