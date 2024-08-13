document.addEventListener("DOMContentLoaded", function () {
    // 背景音乐自动播放
    const backgroundMusic = document.getElementById("background-music");
    if (backgroundMusic) {
        backgroundMusic.play().catch(error => {
            console.warn("自動播放被阻止:", error);
            document.addEventListener("click", () => {
                backgroundMusic.play().catch(err => console.warn("点击后播放失败:", err));
            }, { once: true });
        });
    }

    // 时间轴动画
    function animateTimeline() {
        const timelineBlocks = document.querySelectorAll(".VivaTimeline .event");
        timelineBlocks.forEach(function (block) {
            const rect = block.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.75 && rect.bottom >= 0) {
                block.classList.add("animated");
            } else {
                block.classList.remove("animated");
            }
        });
    }

    // 评论区：处理评论提交
    const commentForm = document.getElementById("comment-form");
    const commentsContainer = document.getElementById("comments-container");
    let comments = JSON.parse(localStorage.getItem("comments")) || [];

    function displayComments() {
        commentsContainer.innerHTML = comments
            .map(
                (comment, index) => `
                <div class="comment">
                    <strong>${comment.name}</strong>: ${comment.message}
                    <button class="edit-comment" data-index="${index}">編輯</button>
                    <button class="delete-comment" data-index="${index}">刪除</button>
                </div>`
            )
            .join("");
    }

    function saveComments() {
        localStorage.setItem("comments", JSON.stringify(comments));
        displayComments();
    }

    commentForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("comment-name").value;
        const message = document.getElementById("comment-message").value;
        comments.push({ name, message });
        saveComments();
        commentForm.reset();
    });

    // 处理编辑和删除按钮
    commentsContainer.addEventListener("click", function (e) {
        const index = e.target.dataset.index;
        if (e.target.classList.contains("edit-comment")) {
            const newMessage = prompt("編輯留言:", comments[index].message);
            if (newMessage !== null) {
                comments[index].message = newMessage;
                saveComments();
            }
        } else if (e.target.classList.contains("delete-comment")) {
            if (confirm("確定要刪除此留言嗎?")) {
                comments.splice(index, 1);
                saveComments();
            }
        }
    });

    // 清除所有评论（仅管理员可见）
    const clearCommentsButton = document.getElementById("clear-comments-button");
    if (clearCommentsButton) {
        clearCommentsButton.addEventListener("click", function () {
            if (confirm("確定要清除所有留言嗎?")) {
                comments = [];
                saveComments();
            }
        });
    }

    // 页面加载时显示评论
    displayComments();

    // 花篮区显示控制
    const flowerBasketGallery = document.getElementById("flower-basket-gallery");
    const showFlowerBasketsButton = document.getElementById("show-flower-baskets");
    if (showFlowerBasketsButton) {
        showFlowerBasketsButton.addEventListener("click", function () {
            flowerBasketGallery.style.display = "block";
        });
    }

    // 窗口滚动事件，触发时间轴动画
    window.addEventListener("scroll", animateTimeline);

    // 初始化时检查时间轴动画
    animateTimeline();

    // 嵌入地图并直接导航至怀爱馆
    const mapFrame = document.getElementById("map-frame");
    if (mapFrame) {
        mapFrame.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3649.7719651824385!2d120.5163182153632!3d24.992978584012076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34691f9ae6f1c639%3A0x28f65bbd0dbf393f!2z6ZaL5ZyL5oSb5aWz5oSb5oSb5aC06ZWp5oSb5Lq65riF5Lqk5LiA5aW96Iqx5ZCM5qW15qWt5bCP5aCC!5e0!3m2!1szh-TW!2stw!4v1675970126588!5m2!1szh-TW!2stw";
    }
});
