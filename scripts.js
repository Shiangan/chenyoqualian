document.addEventListener("DOMContentLoaded", function () {
    // 背景音乐自动播放
    const backgroundMusic = document.getElementById("background-music");
    if (backgroundMusic) {
        function playMusic() {
            backgroundMusic.play().catch(error => {
                console.warn("自动播放被阻止:", error);
            });
        }
        // 自动播放
        playMusic();
        // 用户第一次点击页面时播放音乐
        document.addEventListener("click", playMusic, { once: true });
    }

    // 时间轴动画
    let isAnimating = false;

    function animateTimeline() {
        if (isAnimating) return;
        isAnimating = true;
        requestAnimationFrame(() => {
            const timelineBlocks = document.querySelectorAll(".VivaTimeline .event");
            timelineBlocks.forEach(block => {
                const rect = block.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.75 && rect.bottom >= 0) {
                    block.classList.add("animate");
                } else {
                    block.classList.remove("animate");
                }
            });
            isAnimating = false;
        });
    }

    window.addEventListener("scroll", animateTimeline);
    animateTimeline();

    // 评论表单处理
    const commentForm = document.getElementById("comment-form");
    const commentsContainer = document.getElementById("comments-container");

    // 从服务器获取评论
    async function fetchComments() {
        try {
            const response = await fetch('/api/comments');
            const comments = await response.json();
            displayComments(comments);
        } catch (error) {
            console.error("获取评论失败:", error);
        }
    }

    function escapeHtml(html) {
        const text = document.createTextNode(html);
        const div = document.createElement('div');
        div.appendChild(text);
        return div.innerHTML;
    }

    function displayComments(comments) {
        commentsContainer.innerHTML = comments
            .map(comment => `
                <div class="comment">
                    <strong>${escapeHtml(comment.name)}</strong>: ${escapeHtml(comment.message)}
                    ${comment.username === getCurrentUsername() || isAdmin() ? `
                    <button class="edit-comment" data-id="${comment.id}">编辑</button>
                    <button class="delete-comment" data-id="${comment.id}">删除</button>` : ''}
                </div>`)
            .join("");
    }

    async function handleCommentSubmit(e) {
        e.preventDefault();
        const name = escapeHtml(document.getElementById("comment-name").value.trim());
        const message = escapeHtml(document.getElementById("comment-message").value.trim());
        if (name && message) {
            const comment = { name, message, username: getCurrentUsername(), isAdmin: isAdmin() };
            try {
                await fetch('/api/comments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(comment)
                });
                fetchComments();
                commentForm.reset();
            } catch (error) {
                console.error("添加评论失败:", error);
            }
        } else {
            alert("姓名和留言不能为空！");
        }
    }

    async function handleCommentAction(e) {
        const id = e.target.dataset.id;
        if (e.target.classList.contains("edit-comment")) {
            const newMessage = prompt("编辑留言:", e.target.parentElement.querySelector('div').textContent);
            if (newMessage !== null) {
                try {
                    await fetch(`/api/comments/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: escapeHtml(newMessage) })
                    });
                    fetchComments();
                } catch (error) {
                    console.error("编辑评论失败:", error);
                }
            }
        } else if (e.target.classList.contains("delete-comment")) {
            if (confirm("确定要删除此留言吗？")) {
                try {
                    await fetch(`/api/comments/${id}`, { method: 'DELETE' });
                    fetchComments();
                } catch (error) {
                    console.error("删除评论失败:", error);
                }
            }
        }
    }

    commentForm.addEventListener("submit", handleCommentSubmit);
    commentsContainer.addEventListener("click", handleCommentAction);

    function getCurrentUsername() {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.username : null;
    }

    function isAdmin() {
        const user = JSON.parse(localStorage.getItem('user'));
        return user && user.role === 'admin';
    }

    fetchComments();

    // 显示花篮区
    const flowerBasketGallery = document.getElementById("flower-basket-gallery");
    document.getElementById("show-flower-baskets").addEventListener("click", function () {
        flowerBasketGallery.style.display = flowerBasketGallery.style.display === "block" ? "none" : "block";
    });

    // 显示地图
    document.getElementById("show-map").addEventListener("click", function () {
        try {
            window.open("https://www.google.com/maps/dir/?api=1&destination=懷愛館（第二殯儀館）景行樓3F［至仁二廳］", "_blank");
        } catch (error) {
            console.error("打开地图失败:", error);
        }
    });

    // 滚动到顶部按钮
    const scrollToTopButton = document.getElementById("scroll-to-top");
    window.addEventListener("scroll", () => {
        scrollToTopButton.style.display = window.scrollY > 200 ? "block" : "none";
    });
    scrollToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});
