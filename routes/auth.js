// routes/auth.js
const express = require('express');
const passport = require('passport');
const User = require('../models/User');

const router = express.Router();

// 用户注册路由
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username, password });
        await user.save();
        res.status(201).send('用户注册成功');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// 用户登录路由
router.post('/login', passport.authenticate('local', {
    successRedirect: '/comments',
    failureRedirect: '/login'
}));

module.exports = router;

// 在 routes/auth.js 文件中添加
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const isAdmin = (await User.countDocuments()) === 0; // 第一个注册的用户为管理员
        const user = new User({ username, password, isAdmin });
        await user.save();
        res.status(201).send('用户注册成功');
    } catch (error) {
        res.status(400).send(error.message);
    }
});
