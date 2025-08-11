// 赛博朋克鼠标特效
(function() {
  'use strict';

  // 鼠标跟踪粒子效果
  class MouseTracker {
    constructor() {
      this.particles = [];
      this.mouse = { x: 0, y: 0 };
      this.canvas = null;
      this.ctx = null;
      this.animationId = null;
      
      this.init();
    }

    init() {
      // 创建canvas
      this.canvas = document.createElement('canvas');
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = '9999';
      this.canvas.style.mixBlendMode = 'screen';
      
      document.body.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      
      this.resize();
      this.bindEvents();
      this.animate();
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    bindEvents() {
      window.addEventListener('resize', () => this.resize());
      
      document.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        
        // 创建新粒子
        this.createParticle(e.clientX, e.clientY);
      });

      document.addEventListener('click', (e) => {
        // 点击时创建爆炸效果
        this.createExplosion(e.clientX, e.clientY);
      });
    }

    createParticle(x, y) {
      const particle = {
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
        decay: Math.random() * 0.02 + 0.01,
        size: Math.random() * 3 + 1,
        color: this.getRandomColor()
      };
      
      this.particles.push(particle);
      
      // 限制粒子数量
      if (this.particles.length > 50) {
        this.particles.shift();
      }
    }

    createExplosion(x, y) {
      for (let i = 0; i < 15; i++) {
        const angle = (Math.PI * 2 * i) / 15;
        const velocity = Math.random() * 5 + 2;
        
        const particle = {
          x: x,
          y: y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 1,
          decay: Math.random() * 0.03 + 0.02,
          size: Math.random() * 4 + 2,
          color: this.getRandomColor()
        };
        
        this.particles.push(particle);
      }
    }

    getRandomColor() {
      const colors = [
        'rgba(0, 255, 213, ',
        'rgba(255, 64, 128, ',
        'rgba(255, 255, 0, ',
        'rgba(58, 134, 255, ',
        'rgba(131, 56, 236, '
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    updateParticles() {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const particle = this.particles[i];
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= particle.decay;
        
        // 添加重力效果
        particle.vy += 0.1;
        
        // 添加阻力
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        
        if (particle.life <= 0) {
          this.particles.splice(i, 1);
        }
      }
    }

    drawParticles() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.particles.forEach(particle => {
        this.ctx.save();
        this.ctx.globalAlpha = particle.life;
        this.ctx.fillStyle = particle.color + particle.life + ')';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = particle.color + '0.8)';
        
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
      });
    }

    animate() {
      this.updateParticles();
      this.drawParticles();
      this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      if (this.canvas && this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
    }
  }

  // 文字故障效果
  class GlitchEffect {
    constructor() {
      this.glitchElements = [];
      this.init();
    }

    init() {
      // 为标题添加故障效果
      this.addGlitchToElements('h1, h2, .navbar-brand');
      
      // 鼠标悬停时触发故障效果
      document.addEventListener('mouseover', (e) => {
        if (e.target.matches('a, button, .tag-link, .post-title a')) {
          this.triggerGlitch(e.target);
        }
      });
    }

    addGlitchToElements(selector) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.addEventListener('mouseenter', () => {
          this.triggerGlitch(element);
        });
      });
    }

    triggerGlitch(element) {
      if (element.classList.contains('glitching')) return;
      
      element.classList.add('glitching');
      
      // 创建故障效果
      const originalText = element.textContent;
      const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      
      let iterations = 0;
      const maxIterations = 10;
      
      const glitchInterval = setInterval(() => {
        if (iterations >= maxIterations) {
          element.textContent = originalText;
          element.classList.remove('glitching');
          clearInterval(glitchInterval);
          return;
        }
        
        let glitchedText = '';
        for (let i = 0; i < originalText.length; i++) {
          if (Math.random() < 0.1) {
            glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
          } else {
            glitchedText += originalText[i];
          }
        }
        
        element.textContent = glitchedText;
        iterations++;
      }, 50);
    }
  }

  // 扫描线效果
  class ScanlineEffect {
    constructor() {
      this.scanline = null;
      this.init();
    }

    init() {
      this.scanline = document.createElement('div');
      this.scanline.className = 'cyber-scanline';
      this.scanline.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, transparent, rgba(0, 255, 213, 0.8), transparent);
        z-index: 10000;
        pointer-events: none;
        animation: scanline 3s linear infinite;
      `;
      
      document.body.appendChild(this.scanline);
      
      // 添加CSS动画
      if (!document.querySelector('#scanline-style')) {
        const style = document.createElement('style');
        style.id = 'scanline-style';
        style.textContent = `
          @keyframes scanline {
            0% { top: 0; opacity: 1; }
            50% { opacity: 0.5; }
            100% { top: 100vh; opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }

  // 初始化所有效果
  let mouseTracker, glitchEffect, scanlineEffect;

  function initEffects() {
    mouseTracker = new MouseTracker();
    glitchEffect = new GlitchEffect();
    scanlineEffect = new ScanlineEffect();
  }

  function destroyEffects() {
    if (mouseTracker) mouseTracker.destroy();
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEffects);
  } else {
    initEffects();
  }

  // 页面卸载时清理
  window.addEventListener('beforeunload', destroyEffects);

  // 导出到全局作用域（如果需要）
  window.CyberEffects = {
    MouseTracker,
    GlitchEffect,
    ScanlineEffect,
    init: initEffects,
    destroy: destroyEffects
  };

})();
