<template>
  <Header v-if="!$route.meta.hideHeader" />
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import Header from "@/layouts/header.vue";
</script>
