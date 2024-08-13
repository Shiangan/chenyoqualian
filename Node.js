const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// 连接到MongoDB
mongoose.connect('mongodb://localhost:27017/commentsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// 定义留言Schema
const commentSchema = new mongoose.Schema({
    name: String,
    message: String,
    userId: String // 用于识别留言的用户ID
});

const Comment = mongoose.model('Comment', commentSchema);

// 获取所有留言
app.get('/comments', (req, res) => {
    Comment.find({}, (err, comments) => {
        if (err) {
            res.status(500).send(err);
        } else {
            // 将每个留言是否可删除的信息传回前端
            const userId = req.user.id; // 从会话中获取用户ID
            const commentsWithPermissions = comments.map(comment => ({
                ...comment._doc,
                canDelete: comment.userId === userId || req.user.isAdmin
            }));
            res.json(commentsWithPermissions);
        }
    });
});

// 添加新留言
app.post('/comments', (req, res) => {
    const newComment = new Comment({
        name: req.body.name,
        message: req.body.message,
        userId: req.user.id // 将用户ID存入留言中
    });

    newComment.save((err, comment) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).json(comment);
        }
    });
});

// 删除留言
app.delete('/comments/:id', (req, res) => {
    const commentId = req.params.id;

    Comment.findById(commentId, (err, comment) => {
        if (err) {
            return res.status(500).send(err);
        }
        // 仅允许管理员或留言本人删除留言
        if (comment.userId === req.user.id || req.user.isAdmin) {
            Comment.deleteOne({ _id: commentId }, err => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json({ success: true });
                }
            });
        } else {
            res.status(403).json({ success: false, message: "你無權刪除此留言" });
        }
    });
});

// 启动服务器
app.listen(3000, () => {
    console.log('服务器正在端口3000运行...');
});
