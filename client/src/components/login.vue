<template>
  <div class="bord" v-show="boxShow">
    <div class="login">
      <button @click="login">Googleでログイン</button>
    </div>
  </div>
</template>
<style scoped>
.bord {
  position: fixed;
  top: 0vh;
  left: 0vw;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.428);
}

.login {
  position: fixed;
  transform: translate(-50%, -50%);
  top: 50vh;
  left: 50vw;
  width: 200px;
  height: auto;
}
</style>
<script setup>
import { onMounted, ref } from "vue";
const params = new URLSearchParams(window.location.search);
const boxShow = ref(true);
const emit = defineEmits(["sendSub"]);

async function fetchUserSub() {
  const res = await fetch("/api/me", {
    credentials: "include",
  });
  if (res.ok) {
    const data = await res.json();
    return data.sub;
  }
}

onMounted(async () => {
  const userSub = await fetchUserSub();
  console.log("userSub" + userSub);
  if (userSub != null) {
    boxShow.value = false;
    emit("sendSub", { value: userSub });
  }
});
function login() {
  window.location.href = "/api/auth";
}
</script>
