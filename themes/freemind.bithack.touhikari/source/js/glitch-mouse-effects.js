document.addEventListener('DOMContentLoaded', function() {

    const body = document.body;
    let trailThrottleTimeout;
    const trailThrottleDelay = 5;  // 鼠标移动时创建像素块的最小间隔 (ms)
    const trailFadeDuration = 500; // 拖尾像素块淡出时间 (ms)
    const clickBurstCount = 16;    // 点击时炸开的像素块数量
    const clickFadeDuration = 600; // 点击像素块炸开的持续时间 (ms)

    // --- 1. 鼠标拖尾效果 ---
    function createTrailParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'mouse-trail-particle'; // 应用 CSS 类

        // 基础样式
        const size = Math.random() * 5 + 2; // 随机大小 (2px to 7px)
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // 随机偏移，制造 Glitch 感
        const offsetX = (Math.random() - 0.5) * 10; // 水平偏移 (-5px to 5px)
        const offsetY = (Math.random() - 0.5) * 10; // 垂直偏移 (-5px to 5px)
        particle.style.left = `${x + offsetX}px`;
        particle.style.top = `${y + offsetY}px`;

        // 随机初始透明度和旋转 (增加 Glitch 感)
        particle.style.opacity = Math.random() * 0.5 + 0.5; // 0.5 to 1.0
        particle.style.transform = `rotate(${Math.random() * 90 - 45}deg)`; // -45 to 45 deg

        body.appendChild(particle);

        // 淡出并移除
        // 使用 requestAnimationFrame 可以让初始状态立即生效，然后再应用结束状态
        requestAnimationFrame(() => {
           particle.style.opacity = '0';
           // 可以添加 transform 来模拟移动或缩小
           // particle.style.transform += ' scale(0.5)';
        });

        setTimeout(() => {
            if (particle.parentNode === body) { // 避免已移除元素报错
               body.removeChild(particle);
            }
        }, trailFadeDuration);
    }

    document.addEventListener('mousemove', function(e) {
        // 使用节流防止过于频繁地创建元素
        if (!trailThrottleTimeout) {
            createTrailParticle(e.clientX, e.clientY);
            trailThrottleTimeout = setTimeout(() => {
                trailThrottleTimeout = null;
            }, trailThrottleDelay);
        }
    });

    // --- 2. 点击爆炸效果 ---
    function createClickParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'click-particle'; // 应用 CSS 类

        // 基础样式
        const size = Math.random() * 6 + 3; // 随机大小 (3px to 9px)
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}px`; // 初始位置在点击处
        particle.style.top = `${y}px`;

        body.appendChild(particle);

        // 计算随机的移动方向和距离
        const angle = Math.random() * Math.PI * 2; // 0 to 360 degrees in radians
        const distance = Math.random() * 30 + 20; // 移动距离 (20px to 50px)
        const targetX = Math.cos(angle) * distance;
        const targetY = Math.sin(angle) * distance;

        // 使用 requestAnimationFrame 确保初始状态应用后再触发动画
        requestAnimationFrame(() => {
            particle.style.opacity = '0';
            particle.style.transform = `translate(${targetX}px, ${targetY}px) rotate(${Math.random() * 180 - 90}deg)`; // 移动并随机旋转
        });

        // 在动画结束后移除粒子
        setTimeout(() => {
             if (particle.parentNode === body) {
                body.removeChild(particle);
             }
        }, clickFadeDuration);
    }

    document.addEventListener('click', function(e) {
        for (let i = 0; i < clickBurstCount; i++) {
            createClickParticle(e.clientX, e.clientY);
        }
    });

});