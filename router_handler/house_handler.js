const db = require('../db/index')
const nowtime = require('../utils/date')
// ["http://localhost:5000/public/avatar/file-1704717641376.jpg","http://localhost:5000/public/avatar/file-1704717669273.png","http://localhost:5000/public/avatar/file-1704717690441.jpeg","http://localhost:5000/public/avatar/file-1704717708863.jpg"]

// 将 img_url 字段从 JSON 格式的字符串转换为数组
function parseImgUrl(results) {
  results.forEach(item => {
    if (typeof item.img_url === 'string') {
      try {
        item.img_url = JSON.parse(item.img_url);
      } catch (error) {
        console.error('Error parsing img_url:', error);
      }
    }
  });
}

//添加新房源
exports.addHouse = (req, res) => {
  const houseInfo = req.body
  const info = {
    create_time: nowtime.getDate(),
    owner_id: houseInfo.ownerId,
    rent_type: houseInfo.rentType,
    title: houseInfo.title,
    content: houseInfo.content,
    city: houseInfo.city,
    address: houseInfo.address,
    img_url: houseInfo.imgUrl,
    month_rent: houseInfo.monthRent,
    certificate: houseInfo.certificate,
    toilet: houseInfo.toilet,
    kichen: houseInfo.kichen,
    livingroom: houseInfo.livingroom,
    bedroom: houseInfo.bedroom,
    conditioner: houseInfo.conditioner,
    area: houseInfo.area,
    floor: houseInfo.floor,
    maxfloor: houseInfo.maxfloor,
    elevator: houseInfo.elevator,
    buildyear: houseInfo.buildyear,
    direction: houseInfo.direction,
    longitude_latitude: houseInfo.longitudeLatitude,
    contact_name: houseInfo.contactName,
    contact_phone: houseInfo.contactPhone,
  }
  const sql = 'insert into house set ?'
  db.query(sql, info, (err, results) => {
    if (err) {
      return res.send({
        status: 404,
        message: err.message
      })
    }
    if (results.affectedRows !== 1) {
      return res.json({
        status: 400,
        message: '添加房源失败，请稍后重试'
      })
    }
    res.json({
      status: 200,
      message: '添加房源成功',
    })
  })
}

//编辑房源
exports.editHouse = (req, res) => {
  const houseInfo = req.body
  const info = {
    rent_type: houseInfo.rentType,
    title: houseInfo.title,
    content: houseInfo.content,
    city: houseInfo.city,
    address: houseInfo.address,
    img_url: houseInfo.imgUrl,
    month_rent: houseInfo.monthRent,
    certificate: houseInfo.certificate,
    toilet: houseInfo.toilet,
    kichen: houseInfo.kichen,
    livingroom: houseInfo.livingroom,
    bedroom: houseInfo.bedroom,
    conditioner: houseInfo.conditioner,
    area: houseInfo.area,
    floor: houseInfo.floor,
    maxfloor: houseInfo.maxfloor,
    elevator: houseInfo.elevator,
    buildyear: houseInfo.buildyear,
    direction: houseInfo.direction,
    longitude_latitude: houseInfo.longitudeLatitude,
    contact_name: houseInfo.contactName,
    contact_phone: houseInfo.contactPhone,
    status: -2
  }
  const sql = 'update house set ? where id=?'
  db.query(sql, [info, houseInfo.id], (err, results) => {
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      })
    }
    if (results.affectedRows !== 1) {
      return res.json({
        status: 400,
        message: '编辑房源失败，请稍后重试',
      })
    }
    res.json({
      status: 200,
      message: '编辑房源成功',
    })
  })
}

//获取房源列表
exports.getHouseList = (req, res) => {
  const sql = 'select * from house where status != -1 ORDER BY id DESC'
  db.query(sql, (err, results) => {
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      })
    }
    // 遍历查询结果，将 img_url 字段从 JSON 格式的字符串转换为数组
    parseImgUrl(results);
    res.send({
      status: 200,
      message: '获取房源列表成功',
      data: results
    })
  })
}


//修改房源状态
exports.changeHouseStatus = (req, res) => {
  const id = req.body.id
  const status = req.body.status
  const sql = 'update house set status=? where id=?'
  db.query(sql, [status, id], (err, results) => {
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      })
    }
    if (results.affectedRows !== 1) {
      return res.json({
        status: 400,
        message: '修改房源状态失败，请稍后重试'
      })
    }
    res.json({
      status: 200,
      message: '修改房源状态成功',
    })
  })
}

//根据ID获取房源信息
exports.getHouseById = (req, res) => {
  const id = req.params.id
  const sql = 'select * from house where id=?'
  db.query(sql, id, (err, results) => {
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      })
    }
    if (results.length !== 1) {
      return res.json({
        status: 400,
        message: '获取房源信息失败，请稍后重试'
      })
    }
    // 遍历查询结果，将 img_url 字段从 JSON 格式的字符串转换为数组
    parseImgUrl(results);
    res.json({
      status: 200,
      message: '获取房源信息成功',
      data: results[0]
    })
  })
}

// 我的家列表
exports.getMyHouseList = (req, res) => {
  const userId = req.body.id;
  const sql = `
    SELECT * 
    FROM house 
    WHERE id IN (
      SELECT house_id 
      FROM orders 
      WHERE o_status = 0 AND customer_id = ? 
    ) ORDER BY id DESC
  `;
  const sql2 = `SELECT * FROM orders WHERE o_status=0 AND customer_id=?  ORDER BY id DESC`;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      });
    }
    // 如果需要，将 img_url 字段从 JSON 格式的字符串转换为数组
    parseImgUrl(results);

    db.query(sql2, [userId], (err, results2) => {
      if (err) {
        return res.send({
          status: 400,
          message: err.message
        });
      }

      res.send({
        status: 200,
        message: '获取我的房源列表成功',
        data: results,
        orders: results2
      });
    });
  });
}

//根据名称、城市、类型、价格区间查询房源(个别值为空时，不查询该条件)
exports.searchHouse = (req, res) => {
  const houseInfo = req.body
  const info = {
    title: houseInfo.title,
    city: houseInfo.city,
    rent_type: houseInfo.rentType,
    min_price: houseInfo.minPrice,
    max_price: houseInfo.maxPrice,
    min_area: houseInfo.minArea,
    max_area: houseInfo.maxArea,
  }
  const sql = 'SELECT * FROM house WHERE title LIKE ? AND city LIKE ? AND rent_type LIKE ? AND month_rent BETWEEN ? AND ? AND status = 1 AND area BETWEEN ? AND ? ORDER BY id DESC';
  db.query(sql, ['%' + info.title + '%', '%' + info.city + '%', '%' + info.rent_type + '%', info.min_price, info.max_price, info.min_area, info.max_area], (err, results) => {
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      });
    }
    // 遍历查询结果，将 img_url 字段从 JSON 格式的字符串转换为数组
    parseImgUrl(results);
    res.send({
      status: 200,
      message: '查询房源成功',
      data: results
    })
  })
}

//根据房东ID获取房源信息
exports.getHouseByOwnerId = (req, res) => {
  const id = req.params.id
  const sql = 'select * from house where owner_id=? and status != -1 ORDER BY id DESC'
  db.query(sql, id, (err, results) => {
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      })
    }
    // 遍历查询结果，将 img_url 字段从 JSON 格式的字符串转换为数组
    parseImgUrl(results);
    res.json({
      status: 200,
      message: '获取房源信息成功',
      data: results
    })
  })
}

// 查询未租出的房子
exports.getUnrentedHouse = (req, res) => {
  const sql = 'select * from house where status = 1 ORDER BY id DESC'
  db.query(sql, (err, results) => {
    if (err) {
      return res.send({
        status: 400,
        message: err.message
      });
    }
    // 遍历查询结果，将 img_url 字段从 JSON 格式的字符串转换为数组
    parseImgUrl(results);
    res.json({
      status: 200,
      message: '获取未租出的房子成功',
      data: results
    })
  })
}
