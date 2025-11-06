<template>
  <canvas ref="canvasRef" class="canvasClass" @click="clickCanvas"></canvas>
  <colorParet @sendColor="sendColorFunc" />
  <div class="logout">
    <logout />
  </div>
  <div class="login">
    <Login @sendSub="sendSubFunc" />
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import Login from "./login.vue";
import logout from "./logout.vue";
import colorParet from "./colorParet.vue";
import io from "socket.io-client";
import { setCTX } from "../js_modules/canvasModules.js";
import { updeteCTX } from "../js_modules/canvasModules.js";
const canvasRef = ref(null);
const socket = io("http://localhost:3000");
const pixelSize = 10;
const canvasSize = 1000;
let name = undefined;
let color = undefined;
const posData = { x: undefined, y: undefined, color: undefined };
let canvasData;
function sendSubFunc(data) {
  name = data.value;
}
function sendColorFunc(data) {
  color = data.value;
}
socket.on("still", () => {
  alert("次塗れるのは1分後です");
});

function clickCanvas() {
  if (posData.color != undefined && name != undefined && color != undefined) {
    socket.emit("paintEventOn", {
      posData: posData,
      name: name,
    });
  }
}
onMounted(() => {
  const canvas = canvasRef.value;
  canvas.width = canvasSize * pixelSize;
  canvas.height = canvasSize * pixelSize;
  const ctx = canvas.getContext("2d");
  socket.on("canvasData", async (pixelCanvasData) => {
    try {
      canvasData = JSON.parse(pixelCanvasData);
      setCTX(canvasData, pixelSize, ctx);
    } catch (err) {
      console.error("CanvasData parse error:", err);
    }
  });
  socket.on("paintEventApplicable", ({ posData }) => {
    updeteCTX(posData, pixelSize, ctx);
  });
  canvas.addEventListener("mousemove", function (e) {
    const rect = e.target.getBoundingClientRect();
    posData.x = Math.floor((e.clientX - rect.left) / pixelSize);
    posData.y = Math.floor((e.clientY - rect.top) / pixelSize);
    posData.color = color;
  });
});
</script>
<style scoped>
.canvasClass {
  width: 1000;
  height: 1000;
  position: relative;
  background-color: rgb(0, 0, 0);
}
.login {
  position: fixed;
  top: 0vh;
  left: 0vw;
  z-index: 20;
}
.logout {
  position: fixed;
  top: 0%;
  right: 0;
}
</style>
