<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <div class="sidebar">
      <Sidebar />
    </div>
    <div class="main-content">
      <div class="main-content-wrapper">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script setup>
import Sidebar from '@/layouts/sidebar.vue'; 
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 15%;
  min-width: 15em;
}

.main-content {
  margin-left: 15%;
  display: flex;
  justify-content: center;
  flex-grow: 1;
  overflow: auto;
}

.main-content-wrapper {
  width: 80%;
  text-align: center;
}
</style>