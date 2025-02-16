const multer = require('multer');
const path = require('path');

// 设置 multer 的存储方式为 diskStorage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 设置上传后文件路径，uploads 文件夹会自动创建。
    cb(null, './public/avatar');
  },
  filename: function (req, file, cb) {
    // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// 添加配置文件到 multer 对象。
var upload = multer({
  storage: storage,
  // 其他 multer 配置项
  limits: {
    fileSize: 5000000, // 限制文件大小 5MB
  },
  fileFilter: (req, file, cb) => {
    // 只接受 jpg, png, jpeg, gif 格式的图片
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: File upload only supports the following filetypes - " + filetypes);
  }
});

module.exports = upload;