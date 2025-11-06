<template>
  <div class="parent" :class="{ closing: isClosing, opening: isOpening }">
    <div class="text" @click="click">{{ "< palette open/close >" }}</div>
    <div class="boxParent">
      <div class="colorBox">
        <div v-for="(color, index) in colors" :key="index">
          <div
            :class="['color', { active: activeIndex === index }]"
            :style="{ backgroundColor: color }"
            @click="chooseColor(index)"
            :ref="colorBoxes"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import colorCompatible from "../js_modules/canvasModules.js";
import { ref } from "vue";
const isClosing = ref(true);
const isOpening = ref(false);
const colorBoxes = ref([]);
const activeIndex = ref(null);
const colors = ref(Object.values(colorCompatible));
const emit = defineEmits(["sendColor"]);
let closing = false;
function click() {
  closing = !closing;
  if (closing) {
    isOpening.value = true;
    isClosing.value = false;
    return;
  }
  isOpening.value = false;
  isClosing.value = true;
}
function chooseColor(index) {
  activeIndex.value = activeIndex.value === index ? null : index;
  emit("sendColor", { value: index + 1 });
}
</script>
<style scoped>
.text {
  position: relative;
  font-family: impact;
  font-size: 35px;
  color: white;
  transition: transform 0.2s;
}
.text:hover {
  transform: scale(1.2);
}
.parent {
  position: fixed;
  width: 100vw;
  bottom: -65px;
  left: 0vw;
  height: auto;
  align-items: center;
  display: flex;
  flex-direction: column;
}
.colorBox {
  position: relative;
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 5px;
  padding: 5px;
  z-index: 2;
}
.boxParent {
  position: relative;
  bottom: 2vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  overflow-x: auto;
}
.color {
  position: relative;
  width: 40px;
  height: 30px;
  border: 2px solid rgb(255, 255, 255);
  z-index: 3;
  transition: transform 0.2s;
  border-radius: 10px;
}
.color:hover {
  transform: scale(1.1);
}

@keyframes slideInUp {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-50%);
    opacity: 1;
  }
}

.closing {
  animation: slideInUp 220ms cubic-bezier(0.2, 0.9, 0.2, 1) forwards;
}

@keyframes slideOutUp {
  0% {
    transform: translateY(-50%);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.opening {
  animation: slideOutUp 220ms cubic-bezier(0.2, 0.9, 0.2, 1) forwards;
}

.color.active {
  transform: scale(1.2);
}
</style>
