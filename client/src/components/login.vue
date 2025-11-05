<template>
  <div v-show="boxShow">
    <button @click="login">Googleでログイン</button>
  </div>
</template>

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
