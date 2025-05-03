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
    let currentIndex = 0;

    function rotateSlogan() {
        if (sloganElement) {
            // 计算下一个 slogan 的索引
            currentIndex = (currentIndex + 1) % slogans.length;
            // 更新 HTML 元素的文本内容
            sloganElement.textContent = slogans[currentIndex];
        }
    }

    // 页面加载完成后，立即设置第一个 slogan
    if (sloganElement) {
         // 如果想随机开始，取消下面这行的注释
         // currentIndex = Math.floor(Math.random() * slogans.length);
         sloganElement.textContent = slogans[currentIndex];
    }

    // 设置定时器，每隔一段时间切换 slogan (例如：5000毫秒 = 5秒)
    setInterval(rotateSlogan, 3000);
});