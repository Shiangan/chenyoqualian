// 引入依赖
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// 使用中间件
app.use(bodyParser.json());
app.use(express.static('public')); // 提供静态文件服务，例如前端的 HTML、CSS 和 JavaScript 文件

// 伪数据库，实际应用中应使用真正的数据库
let comments = [];

// 基础路由
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// 获取评论
app.get('/api/comments', (req, res) => {
    res.json(comments);
});

// 添加评论
app.post('/api/comments', (req, res) => {
    const { name, message } = req.body;
    const newComment = { id: comments.length + 1, name, message, timestamp: new Date() };
    comments.push(newComment);
    res.json({ success: true, comment: newComment });
});

// 编辑评论
app.put('/api/comments/:id', (req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    const comment = comments.find(c => c.id === parseInt(id));
    if (comment) {
        comment.message = message;
        res.json({ success: true, comment });
    } else {
        res.status(404).json({ success: false, message: 'Comment not found' });
    }
});

// 删除评论
app.delete('/api/comments/:id', (req, res) => {
    const { id } = req.params;
    comments = comments.filter(c => c.id !== parseInt(id));
    res.json({ success: true });
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
