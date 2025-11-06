<template>
  <div class="logout" @click="logoutFunc">
    {{ "ログアウト" }}
  </div>
</template>
<style scoped>
.logout {
  position: relative;
  width: auto;
  height: auto;
  font-size: 20px;
  font-family: "Hiragino Sans", "ヒラギノ角ゴシック";
  font-weight: 900;
  color: white;
  transition: transform 0.2s;
}
.logout:hover {
  transform: scale(1.1);
}
</style>
<script setup>
async function logoutFunc() {
  try {
    const res = await fetch("/api/logout", {
      credentials: "include",
    });
    if (res.ok) {
      window.location.href = "https://nn-plase.onrender.com";
    } else {
      console.error("Logout failed");
    }
  } catch (err) {
    console.error(err);
  }
}
</script>
