const cron = require('node-cron');
const axios = require('axios');

// 取消订单的函数
async function cancelOrder(order) {
  // 在此处编写取消订单的逻辑
  console.log(`订单 ${order.id} 已过期.`);
  // 修改房子状态为未出租
  await axios.post('http://127.0.0.1:5000/api/house/status', {
    id: order.house_id,
    status: 1 //未出租
  })
  // 修改订单状态为已退租
  await axios.post('http://127.0.0.1:5000/api/order/status', {
    id: order.id,
    status: 1, //已退租
  })
}

// 导出函数，用于启动定时任务
module.exports.startOrderScheduler = function () {
  // 定义定时任务，每隔1分钟检查订单是否到期
  cron.schedule('*/60 * * * * *', async () => {
    const { data } = await axios.get('http://127.0.0.1:5000/api/order/effective');
    const orders = data.data;
    // 遍历订单列表，检查订单是否到期
    orders.forEach(order => {
      const currentDate = new Date();
      let expireDate = new Date(order.end_date);
      if (expireDate <= currentDate) {
        // 调用取消订单函数
        cancelOrder(order);
      }
    });
  });
};
