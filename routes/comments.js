// routes/comments.js
const express = require('express');
const Comment = require('../models/Comment');

const router = express.Router();

// 创建留言
router.post('/comments', (req, res) => {
    const comment = new Comment({
        content: req.body.content,
        userId: req.user._id // 当前登录用户的 ID
    });

    comment.save(err => {
        if (err) return res.status(500).send(err);
        res.status(201).json(comment);
    });
});

// 获取所有留言
router.get('/comments', (req, res) => {
    Comment.find()
        .populate('userId', 'username')
        .exec((err, comments) => {
            if (err) return res.status(500).send(err);
            res.render('comments', { comments, user: req.user });
        });
});

// 删除留言
router.delete('/comments/:id', (req, res) => {
    const commentId = req.params.id;

    Comment.findById(commentId, (err, comment) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (comment.userId.toString() === req.user._id.toString() || req.user.isAdmin) {
            Comment.deleteOne({ _id: commentId }, err => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json({ success: true });
                }
            });
        } else {
            res.status(403).json({ success: false, message: "你无权删除此留言" });
        }
    });
});

module.exports = router;
