<template>
  <footer class="page-footer">
    <div class="footer-links">
      <router-link to="/about" class="footer-link">关于我们</router-link>
      <router-link to="/contact" class="footer-link">联系我们</router-link>
      <router-link to="/help" class="footer-link">帮助中心</router-link>
      <router-link to="/privacy" class="footer-link">隐私政策</router-link>
    </div>
    <p class="copyright">
      Copyright © 2025 产教融合平台 All Rights Reserved
    </p>
  </footer>
</template>

<script setup>
// 页脚组件
</script>

<style scoped>
.page-footer {
  margin-top: auto;
  border-top: 1px solid #e0e6f2;
  padding: 32px 16px 40px;
  text-align: center;
  color: #7b89a9;
  background: #fff;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.footer-link {
  color: inherit;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #0c5fe7;
}

.copyright {
  margin: 0;
  font-size: 14px;
}
</style>

