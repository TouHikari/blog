<template>
  <div class="my-custom-component text-center bg-blue-50 border border-blue-200 rounded-lg p-5 mt-8 mb-8">
    <p class="text-blue-700 font-semibold text-lg mb-2">🎉 {{ message }} 🎉</p>
    <button @click="handleClick"
      class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
      点击我！
    </button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  message: {
    type: String,
    default: '这是一个默认消息'
  }
});

const handleClick = () => {
  alert(props.message + '\n组件被点击了！');
};
</script>

<style scoped>
/* 组件内部样式 */
.my-custom-component {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>