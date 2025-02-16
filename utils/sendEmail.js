const nodemailer = require('nodemailer')
//租客邮箱，房东邮箱，状态，订单号，房源标题
const sendEmail = (customerEmail, ownerEmail, status, orderNumber, houseTitle ) => {

  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      host: 'smtp.qq.com',
      port: 465,
      // 开启安全连接，这个开不开都可以，对安全性有要求的话，最好开启
      secureConnection: true,
      auth: {
        user: '135@qq.com',
        pass: 'zbntlmmtebtgxxxx',
      },
      tls: {
        rejectUnauthorized: false, // 拒绝认证就行了， 不然会报证书问题
      },
    });
    
    let text1 = `<div style="padding: 1px 15px ;line-height: 1.7;">
    <p style=" font-size:22px;">尊敬的用户：</p>
    <p style=" font-size:16px;"> 您好！</p>
    <p style=" font-size:16px;"> 标题：${houseTitle} ,订单号：${orderNumber}</p>
    <p style=" font-size:14px;"> 感谢您选择 租好房
      和我们的房源。我们已经收到您的付款，并确认您的订单已完成。我们会尽快为您准
      备房屋并通知您入住时间。如果您需要进一步操作或有其他问题，请随时与我们联系
      。再次感谢您的使用，祝您生活愉快！</p>
    <strong style="font-size:14px;">租好房 团队</strong>
  </div>`
    let text2 = `<div style="padding: 1px 15px ;line-height: 1.7;">
  <p style=" font-size:22px;">尊敬的用户：</p>
  <p style=" font-size:16px;"> 您在 租好房 上的订单：${orderNumber}状态发生了变化。以下是您的订单更新信息：</p>
  <p style=" font-size:14px;"> 房子标题:${houseTitle} 订单状态：<strong> ${status == 1 ? '已退租' : '待审核'}</strong></p>
  <p style=" font-size:14px;"> 如果您需要进一步操作或有其他问题，请随时与我们联系。再次感谢您的使用，祝您生活愉快！</p>
  <strong style="font-size:14px;">租好房 团队</strong>
</div>`
    let sendText = ''
    // 0生效中 1已退租 2待审核
    if (status) {
      sendText = text2
    } else {
      sendText = text1
    }
    const mailOptions = {
      from: '1351466998@qq.com',
      to: customerEmail,
      subject: "租好房",
      html: sendText,
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info)
      }
    })
    let text3 = `<div style="padding: 1px 15px ;line-height: 1.7;">
    <p style=" font-size:22px;">尊敬的房东：</p>
    <p style=" font-size:16px;"> 您好！</p>
    <p style=" font-size:14px;"> 感谢您在 租好房
      的房源${houseTitle}。已有客户预定下单，订单号为：${orderNumber}.请您尽快准
      备房屋并联系客户。如果您需要进一步操作或有其他问题，请随时与我们联系
      。再次感谢您的使用，祝您生活愉快！</p>
    <strong style="font-size:14px;">租好房 团队</strong>
  </div>`
    let text4 = `<div style="padding: 1px 15px ;line-height: 1.7;">
  <p style=" font-size:22px;">尊敬的房东：</p>
  <p style=" font-size:16px;"> 您在 租好房 上的订单:${orderNumber}状态发生了变化。以下是您的订单更新信息：</p>
  <p style=" font-size:14px;"> 房子标题:${houseTitle} 订单状态：<strong> ${status == 1 ? '已退租' : '待审核'}</strong></p>
  <p style=" font-size:14px;"> 如果您需要进一步操作或有其他问题，请随时与我们联系。再次感谢您的使用，祝您生活愉快！</p>
  <strong style="font-size:14px;">租好房 团队</strong>
</div>`
    let sendText2 = ''
    // 0生效中 1已退租 2待审核
    if (status) {
      sendText2 = text4
    } else {
      sendText2 = text3
    }
    const mailOptions2 = {
      from: '1351466998@qq.com',
      to: ownerEmail,
      subject: "租好房",
      html: sendText2,
    }
    transporter.sendMail(mailOptions2, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info)
      }
    })
  })
}
module.exports = {
  sendEmail
}