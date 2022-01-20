const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('supernova', 'root', '123456', {
    host: '',
    dialect: 'mysql',
    dialectOptions: {
      // 你的 mysql2 参数
    }
  })
  // 创建USER 模型
class User extends Model {}

// 初始化 USER
User.init({
  username: DataTypes.STRING,
  birthday: DataTypes.DATE
}, { sequelize, modelName: 'user' });

(async () => {
    // 同步到数据库
  await sequelize.sync();
  // 创建一条记录
  const jane = await User.create({
    username: 'janedoe',
    birthday: new Date(1980, 6, 20)
  });
  console.log(jane.toJSON());
})();