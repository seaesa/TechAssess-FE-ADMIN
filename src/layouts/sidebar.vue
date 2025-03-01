<template>
  <aside class="sidebar bg-opacity-25 text-red vh-100">
    <div class="d-flex flex-column p-3 mt-2">
      <h3 class="name-project">
        <a href="/" class="tw-flex tw-items-center tw-space-x-2 tw-justify-center">
          <img :src="Techzenlogo" width="50" height="50" alt="">
          <span class="tw-font-bold tw-text-lg">TechAssess360</span>
        </a>
      </h3>
      <ul class="nav nav-pills flex-column mb-auto mt-3">
        <li class="nav-item">
          <router-link to="/admin/" class="nav-link tw-text-left">
            Quản lý nhân viên
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/admin/projects-manage" class="nav-link tw-text-left">
            Quản lý dự án
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/departments-manage" class="nav-link tw-text-left">
            Quản lý bộ phận
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/criterias" class="nav-link tw-text-left">
            Quản lý tiêu chí
          </router-link>
        </li>
        <!-- <li class="nav-item">
          <router-link to="/logout" class="nav-link" active-class="active">
            <i class="bi bi-box-arrow-right"></i> Đăng xuất
          </router-link>
        </li> -->
      </ul>
    </div>
  </aside>
</template>

<script setup>
import Techzenlogo from '@/assets/Techzenlogo.png'
</script>

<style scoped>
.sidebar {
  width: 300px;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #000066;
  color: white;
}

.name-project {
  text-align: center;
}

.nav-link {
  color: white;
  border-bottom: solid gray;
}

.nav-item:hover {
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(118, 116, 116, 0.603);
}

.active {
  background-color: white !important;
  color: #000044 !important;
  font-weight: bold;
  border-radius: 10px;
}
</style>