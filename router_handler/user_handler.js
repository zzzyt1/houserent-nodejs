/**
 * 在这里定义和用户相关的路由处理函数
 * 供/router/user.js模块进行调用
 */
const multer = require("multer");
const fs = require('fs');
const path = require("path");
const db = require('../db/index')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const config = require('../config')
const nowtime = require('../utils/date')
// 注册用户的处理函数
exports.register = (req, res) => {
  const userInfo = req.body
  if (!userInfo.user || !userInfo.password || !userInfo.role || !userInfo.email || !userInfo.phone) {
    return res.json({ status: 400, message: '用户名、密码、邮箱或电话为空' })
  }
  const sql = `select * from user where user=?`
  db.query(sql, [userInfo.user], (err, results) => {
    if (err) {
      return res.send({
        status: 404,
        message: err.message
      })
    }
    if (results.length > 0) {
      return res.json({
        status: 400,
        message: '用户名已被注册，请更改后重新注册'
      })
    }
    //对用户的密码进行 bcrypt 加密，返回值是加密后的密码字符串
    userInfo.password = bcrypt.hashSync(userInfo.password, 10)
    const sqlStr = `insert into user set ?`
    const usermsg = {
      user: userInfo.user,
      password: userInfo.password,
      role: userInfo.role,
      phone: userInfo.phone,
      email: userInfo.email,
      name: userInfo.name,
      create_time: nowtime.getDate()
    }
    db.query(sqlStr, usermsg, (err, results) => {
      if (err) {
        return res.send({
          status: 400,
          message: err.message
        })
      }
      if (results.affectedRows !== 1) {
        return res.json({
          status: 400,
          message: '注册用户失败，请稍后重试'
        })
      }
      res.json({
        status: 200,
        message: '注册成功',
        data: usermsg
      })
    })
  })
}

// 登录的处理函数
exports.login = (req, res) => {
  const userInfo = req.body
  const sql = `select * from user where user=?`
  db.query(sql, userInfo.user, (err, results) => {
    if (err) {
      return res.json({
        status: 400,
        message: err.message

      })
    }
    if (results.length !== 1) {
      return res.json({
        status: 400,
        message: '用户不存在，请重新输入'

      })
    }
    if (results[0].status == 0) {
      return res.json({
        status: 400,
        message: '用户已被禁用，请联系管理员'
      })
    }
    const compareResult = bcrypt.compareSync(userInfo.password, results[0].password)
    if (!compareResult) {
      return res.json({
        status: 400,
        message: '用户名或密码输入错误，请重新输入'
      })
    }

    const user = {
      id: results[0].id,
      name: results[0].user,
    }
    //jwt.sign(规则，加密名字，过期时间)
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: '12h' })
    //将生成的Token字符串响应给客户端
    res.json({
      status: 200,
      message: '登录成功!',
      id: results[0].id,
      //返回身份
      role: results[0].role,
      //为方便客户端使用，在服务器端凭借上 Bearer前缀
      token: 'Bearer ' + tokenStr
    })
  })
}

//根据ID获取用户信息
exports.Info = (req, res) => {
  const sql = `select * from user where id=?`
  db.query(sql, req.params.id, (err, results) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        message: err.message
      })
    }
    if (results.length !== 1) {
      return res.status(400).json({
        status: 400,
        message: '获取用户信息失败'
      })
    }
    res.json({
      status: 200,
      message: '获取用户信息成功!',
      data: results[0]
    })
  })
}

//获取全部用户信息
exports.All = (req, res) => {
  const sql = `select * from user order by id desc`
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        message: err.message
      })
    }
    if (results.length < 1) {
      return res.json({
        status: 400,
        message: '获取用户信息失败'
      })
    }
    res.json({
      status: 200,
      message: '获取用户信息成功!',
      data: results
    })
  })
}

//更改用户状态
exports.Status = (req, res) => {
  const sql = `update user set status=? where id=?`
  db.query(sql, [req.body.status, req.body.id], (err, results) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        message: err.message
      })
    }
    if (results.affectedRows !== 1) {
      return res.json({
        status: 400,
        message: '更改用户状态失败'
      })
    }
    res.json({
      status: 200,
      message: '更改用户状态成功!',
    })
  })
}

//更改用户身份
exports.Role = (req, res) => {
  const sql = `update user set role=? where id=?`
  db.query(sql, [req.body.role, req.body.id], (err, results) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        message: err.message
      })
    }
    if (results.affectedRows !== 1) {
      return res.json({
        status: 400,
        message: '更改用户身份失败'
      })
    }
    res.json({
      status: 200,
      message: '更改用户身份成功!',
    })
  })
}

//修改密码
exports.UpdatePwd = (req, res) => {
  const sql = `update user set password=? where id=?`
  const password = bcrypt.hashSync(req.body.password, 10)
  db.query(sql, [password, req.body.id], (err, results) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        message: err.message
      })
    }
    if (results.affectedRows !== 1) {
      return res.json({
        status: 400,
        message: '修改密码失败'
      })
    }
    res.json({
      status: 200,
      message: '修改密码成功!',
    })
  })
}

//更改用户信息
exports.UpdateInfo = (req, res) => {
  const sql = `update user set ? where id=?`
  const info = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    idcard: req.body.idcard,
    sex: req.body.sex,
    job: req.body.job,
    hobby: req.body.hobby,
    desc: req.body.desc,
    avatar: req.body.avatar
  }
  //如果没有上传头像，就删除avatar属性
  if (!info.avatar) {
    delete info.avatar
  }
  db.query(sql, [info, req.body.id], (err, results) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        message: err.message
      })
    }
    if (results.affectedRows !== 1) {
      return res.json({
        status: 400,
        message: '更改用户信息失败'
      })
    }
    res.json({
      status: 200,
      message: '更改用户信息成功!',
    })
  })
}

// 上传头像
exports.upload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '请上传文件' });
  }
  // 将文件路径转换为 URL 路径
  const urlPath = req.file.path.replace(/\\/g, '/');
  res.status(200).json({
    message: '文件上传成功',
    file: req.file,
    url: 'http://localhost:5000/' + urlPath
  });
};

//删除图片
exports.deleteImg = (req, res) => {
  const url = req.body.url
  //获取文件名
  const filename = url.split('/').pop()
  //拼接路径
  const filepath = path.join(__dirname, '../public/avatar/' + filename)
  //删除文件
  fs.unlinkSync(filepath)
  res.json({
    status: 200,
    message: '删除图片成功'
  })
}