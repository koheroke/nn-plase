<template>
  <div class="boxParent">
    <div class="colorBox">
      <div v-for="(color, index) in colors" :key="index">
        <div
          class="color"
          :style="{ backgroundColor: color }"
          @click="chooseColor(index)"
        ></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import colorCompatible from "../js_modules/canvasModules.js";
const colors = ref(Object.values(colorCompatible));
const emit = defineEmits(["sendColor"]);
function chooseColor(index) {
  emit("sendColor", { value: index + 1 });
}
</script>
<style scoped>
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
  position: fixed;
  bottom: 0vh;
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
  transform: scale(1.2);
}
</style>
