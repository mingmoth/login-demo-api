const jwt = require('jsonwebtoken')
const { User } = require('../models')

const userController = {
  signIn: async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.json({ status: 'error', message: '請輸入帳號及密碼登入' })
    }
    try {
      const user = await User.findOne({ where: { email: req.body.email } })
      if (!user) return res.status(401).json({ status: 'error', message: '找不到此使用者帳號' })
      if (!bcrypt.compareSync(req.body.password, user.password)) return res.status(401).json({ status: 'error', message: '密碼輸入不正確' })
      // 簽發token
      let payload = { id: user.id }
      let token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.status(200).json({
        status: 'success',
        message: '登入成功',
        token: token,
        user: {
          id: user.id, name: user.name, email: user.email, avatar: user.avatar,
        }
      })
    } catch (error) {
      return res.json({ status: 'error', message: '無法登入，請稍後再試' })  
    }
    
  },
}

module.exports = userController