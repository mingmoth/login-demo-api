const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userController = {
  signIn: async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.json({ status: 'error', message: '請輸入帳號及密碼登入' })
    }
    try {
      const user = await User.findOne({ where: { email: req.body.email } })
      if (!user) return res.json({ status: 'error', message: '找不到此使用者帳號' })
      if (!bcrypt.compareSync(req.body.password, user.password)) return res.json({ status: 'error', message: '密碼輸入不正確' })

      // 簽發token
      let payload = { id: user.id }
      let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })
      return res.status(200).json({
        status: 'success',
        message: '登入成功',
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar
        },
      })
    } catch (error) {
      console.log(error)
      return res.json({ status: 'error', message: '無法登入，請稍後再試' })
    }

  },
  loginByFacebook: async (req, res) => {
    try {
      let payload = { id: req.user.id }
      let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })
      return res.redirect(`${process.env.CLIENT_URL
        }/#/_=_?FacebookId=${req.user.id}&token=${token}` || `http://localhost:8080/#/_=_?FacebookId=${req.user.id}&token=${token}`)
    } catch (error) {
      console.log(error)
      return res.redirect(`${process.env.CLIENT_URL
        }/#/signin` || 'http://localhost:8080/#/signin')
    }
  },
  loginByGoogle: (req, res) => {
    try {
      let payload = { id: req.user.id }
      let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })
      return res.redirect(`${process.env.CLIENT_URL
        }/#/_=_?FacebookId=${req.user.id}&token=${token}` || `http://localhost:8080/#/_=_?GoogleId=${req.user.id}&token=${token}`)
    } catch (error) {
      console.log(error)
      return res.redirect(`${process.env.CLIENT_URL
        }/#/signin` || 'http://localhost:8080/#/signin')
    }
  },
  getCurrentUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id)
      if (!user) return res.status(401).json({ status: 'error', message: '找不到此使用者帳號' })
      return res.status(200).json({
        status: 'success',
        message: '成功取得取用者資料',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar
        },
      })
    } catch (error) {
      console.log(error)
      return res.json({ status: 'error', message: '無法取得取用者資料' })
    }

  },
}

module.exports = userController