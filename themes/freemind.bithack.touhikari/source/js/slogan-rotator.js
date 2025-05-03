document.addEventListener('DOMContentLoaded', function() {
    const slogans = [
        "> Executing life script...",
        "// Penetrating the reality matrix",
        "[ Status: Online & Dangerous ]",
        "cat /dev/thoughts > /blog",
        "Loading core modules... TouHikari initialized.",
        "Echoes from the digital void.",
        "Where shadows dance with data streams.",
        "Your reality is negotiable.",
        "Beyond the firewall consciousness.",
        "A glitch in the system you call 'normal'.",
        "chmod +x my_destiny",
        "while(alive) { learn(); hack(); repeat(); }",
        "Error 404: Sleep not found.",
        "Reality is just a poorly coded simulation.",
        "sudo make me a sandwich.",
        "There is no place like ::1",
        "Seek truth in the noise.",
        "Information yearns to be free.",
        "Born to root.",
        "Beyond the event horizon.",
        "The console is my sanctuary.",
        "Weaving light through the dark web.",
        "Finding the signal, being the HIKARI.",
        "Illuminating the path less traveled.",
        "Existence is pain... for a poorly configured server.",
        "Get Schwifty. (Then debug it.)",
        "Nobody exists on purpose. Nobody belongs anywhere. We're all just code."
    ];

    const sloganElement = document.getElementById('rotating-slogan');
    let sloganIndex = 0; // 当前 Slogan 在列表中的索引
    let charIndex = 0;   // 当前处理到的字符索引
    let isDeleting = false; // 是否正在删除
    const typingSpeed = 100; // 打字速度 (ms)
    const deletingSpeed = 50; // 删除速度 (ms)
    const delayBeforeDeleting = 2000; // 打完字后停留多久开始删除 (ms)
    const delayBeforeTypingNew = 500; // 删除完后停留多久开始打新字 (ms)

    function typeWriter() {
        if (!sloganElement) return; // 如果元素不存在则退出

        const currentSlogan = slogans[sloganIndex];
        let textToShow = '';

        if (isDeleting) {
            // 删除状态
            textToShow = currentSlogan.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // 打字状态
            textToShow = currentSlogan.substring(0, charIndex + 1);
            charIndex++;
        }

        // 添加一个闪烁的光标效果 (通过 CSS 实现)
        sloganElement.innerHTML = textToShow + '<span class="cursor">_</span>';

        let delay = typingSpeed; // 默认使用打字速度

        if (isDeleting) {
            delay = deletingSpeed; // 删除时使用删除速度
        }

        if (!isDeleting && charIndex === currentSlogan.length) {
            // 打字完成
            delay = delayBeforeDeleting; // 设置删除前的停留时间
            isDeleting = true; // 切换到删除状态
        } else if (isDeleting && charIndex === 0) {
            // 删除完成
            isDeleting = false; // 切换到打字状态
            sloganIndex = (sloganIndex + 1) % slogans.length; // 切换到下一个 Slogan
            delay = delayBeforeTypingNew; // 设置打新字前的停留时间
        }

        setTimeout(typeWriter, delay); // 在指定延迟后再次调用自身
    }

    // 启动打字机效果
    if (sloganElement) {
         // 可以随机一个起始 Slogan
         // sloganIndex = Math.floor(Math.random() * slogans.length);
        setTimeout(typeWriter, delayBeforeTypingNew); // 初始延迟后开始
    }
});