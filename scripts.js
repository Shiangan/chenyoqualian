document.addEventListener("DOMContentLoaded", function () {
    // 背景音乐自动播放
    const backgroundMusic = document.getElementById("background-music");
    if (backgroundMusic) {
        backgroundMusic.play().catch(error => {
            console.warn("自动播放被阻止:", error);
            document.addEventListener("click", () => {
                backgroundMusic.play().catch(err => console.warn("点击后播放失败:", err));
            }, { once: true });
        });
    }

    // 时间轴动画
    function animateTimeline() {
        const timelineBlocks = document.querySelectorAll(".VivaTimeline .event");
        timelineBlocks.forEach(block => {
            const rect = block.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.75 && rect.bottom >= 0) {
                block.classList.add("animated");
            } else {
                block.classList.remove("animated");
            }
        });
    }

    window.addEventListener("scroll", animateTimeline);
    animateTimeline();

    // 评论表单处理
    const commentForm = document.getElementById("comment-form");
    const commentsContainer = document.getElementById("comments-container");
    let comments = JSON.parse(localStorage.getItem("comments")) || [];

    function escapeHtml(html) {
        const text = document.createTextNode(html);
        const div = document.createElement('div');
        div.appendChild(text);
        return div.innerHTML;
    }

    function displayComments() {
        commentsContainer.innerHTML = comments
            .map((comment, index) => `
                <div class="comment">
                    <strong>${escapeHtml(comment.name)}</strong>: ${escapeHtml(comment.message)}
                    ${comment.username === getCurrentUsername() || isAdmin() ? `
                    <button class="edit-comment" data-index="${index}">编辑</button>
                    <button class="delete-comment" data-index="${index}">删除</button>` : ''}
                </div>`)
            .join("");
    }

    function saveComments() {
        localStorage.setItem("comments", JSON.stringify(comments));
        displayComments();
    }

    commentForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("comment-name").value.trim();
        const message = document.getElementById("comment-message").value.trim();
        if (name && message) {
            comments.push({ name, message, username: getCurrentUsername(), isAdmin: false }); // `isAdmin` 根据用户角色来设置
            saveComments();
            commentForm.reset();
        } else {
            alert("姓名和留言不能为空！");
        }
    });

    commentsContainer.addEventListener("click", function (e) {
        const index = e.target.dataset.index;
        if (e.target.classList.contains("edit-comment")) {
            const newMessage = prompt("编辑留言:", comments[index].message);
            if (newMessage !== null) {
                comments[index].message = newMessage;
                saveComments();
            }
        } else if (e.target.classList.contains("delete-comment")) {
            if (confirm("确定要删除此留言吗？")) {
                if (comments[index].username === getCurrentUsername() || isAdmin()) {
                    comments.splice(index, 1);
                    saveComments();
                } else {
                    alert("您没有权限删除此留言");
                }
            }
        }
    });

    function getCurrentUsername() {
        // 从登录系统中获取当前用户的用户名
        return "current_user";
    }

    function isAdmin() {
        // 从登录系统中获取当前用户是否是管理员
        return false;
    }

    displayComments();

    // 显示花篮区
    const flowerBasketGallery = document.getElementById("flower-basket-gallery");
    document.getElementById("show-flower-baskets").addEventListener("click", function () {
        flowerBasketGallery.style.display = "block";
    });

    // 显示地图
    document.getElementById("show-map").addEventListener("click", function () {
        window.open("https://www.google.com/maps/dir/?api=1&destination=懷愛館（第二殯儀館）景行樓3F［至仁二廳］", "_blank");
    });
});
