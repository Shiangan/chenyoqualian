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

    // Timeline animation
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

    // Window scroll event for timeline animation
    window.addEventListener("scroll", animateTimeline);

    // Initial timeline animation check
    animateTimeline();

    // 评论表单提交处理
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

    // 显示评论
    displayComments();

    // 显示花篮区
    const flowerBasketGallery = document.getElementById("flower-basket-gallery");
    document.getElementById("show-flower-baskets").addEventListener("click", function () {
        flowerBasketGallery.style.display = "block";
    });

    // 显示详细地图并导航到怀爱馆
    document.getElementById("show-map").addEventListener("click", function () {
        window.open("https://www.google.com/maps/dir/?api=1&destination=懷愛館（第二殯儀館）景行樓3F［至仁二廳］", "_blank");
    });
});
