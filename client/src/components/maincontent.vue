<template>
  <canvas ref="canvasRef" class="canvasClass" @click="clickCanvas"></canvas>
  <colorParet @sendColor="sendColorFunc" />
  <div class="login">
    <Login @sendSub="sendSubFunc" />
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import Login from "./login.vue";
import colorParet from "./colorParet.vue";
import io from "socket.io-client";
import { setCTX } from "../js_modules/canvasModules.js";
import { updeteCTX } from "../js_modules/canvasModules.js";
const canvasRef = ref(null);
const socket = io("http://localhost:3000");
const pixelSize = 50;
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

function clickCanvas() {
  if (posData.color != undefined && name != undefined && color != undefined) {
    console.log(posData);
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
    console.log(JSON.stringify(posData));
    posData.color = color;
  });
});
//カラーパレットUI
//ログイン画面UI
//ロード画面UI
//メイン画面UI
//db永続化
</script>
<style scoped>
.canvasClass {
  width: 1000vw;
  height: 100vh;
  position: relative;
  background-color: rgb(0, 0, 0);
}
.login {
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50vh;
  left: 50vw;
  width: 100px;
  height: auto;
}
</style>
