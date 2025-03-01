<template>
  <!-- Project members Modal -->
  <div class="modal-overlay" @click.self="close">
    <div class="modal-container">
      <div class="modal-header d-flex justify-content-between">
        <h2 class="project-members-title">
          Chi tiết nhân viên trong dự án {{ project.name }}
        </h2>
        <button class="btn-close text-end" @click="close"></button>
      </div>
      <div class="top-bar d-flex flex-row justify-content-between pt-3 pb-3" style="width: 100%">
        <input type="text" v-model="detailSearchQuery" placeholder="Tìm kiếm nhân viên hoặc chức vụ..."
          class="search-bar" />
        <div>
          <button @click="showAddEmployeeIntoProjectModal" class="btn btn-success ms-3">
            Thêm nhân viên
          </button>
          <button @click="showAddLeaderIntoProjectModal" class="btn btn-success ms-3">
            Sửa Leader
          </button>
        </div>
      </div>
      <!-- member Table -->
      <div class="">
        <table class="table project-table table-hover table-bordered">
          <thead>
            <tr>
              <th style="width: 30px;">STT</th>
              <th>Avatar</th>
              <th @click="sortDetail('name')">Tên NV</th>
              <th @click="sortDetail('position')">Chức vụ</th>
              <th>Bậc</th>
              <th style="width: 220px;">Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, index) in filteredDetails" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <img :src="member.fileInfo ? member.fileInfo.fileUrl : defaultImg" alt="Avatar" class="avatar-img" />
              </td>
              <td class="text-start">{{ member.name }}</td>
              <td>{{ project.leaderId === member.id ? "LEADER" : "MEMBER" }}</td>
              <td>
                {{ member.rank ? member.rank.level : "N/A" }}
              </td>
              <td>
                <div class="d-flex">
                  <button class="btn btn-info me-3">
                    <router-link :to="`/admin/rating/${member.id}`" class="nav-link" active-class="active">Xem
                      đánh giá</router-link>
                  </button>
                  <button type="button" class="btn btn-danger"
                    @click="deleteEmployeeFromProject(member.id)">Xoá</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- Add Employee Into Project Modal -->
  <AddEmployeeIntoProject v-if="isShowAddEmployeeIntoProjectModal" :showAddEmployee="isShowAddEmployeeIntoProjectModal"
    :project="project" :filteredDetails="filteredDetails" @close="closeAddEmployeeIntoProjectModal"
    @add="addEmployee" />
  <AddLeaderIntoProject v-if="isShowAddLeaderIntoProjectModal" :showAddLeader="isShowAddLeaderIntoProjectModal"
    :project="project" :filteredDetails="filteredDetails" @close="closeAddLeaderIntoProjectModal" @add="addLeader" />
</template>

<script>
import ProjectService from "@/services/ProjectService";
import AddEmployeeIntoProject from "./AddEmployeeIntoProject.vue";
import UserService from "@/services/UserService";
import AddLeaderIntoProject from "./AddLeaderIntoProject.vue";
import Swal from "sweetalert2";

export default {
  name: "ProjectDetails",
  components: {
    AddEmployeeIntoProject,
    AddLeaderIntoProject
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      detailSearchQuery: "",
      isShowAddEmployeeIntoProjectModal: false,
      isShowAddLeaderIntoProjectModal: false,
      sortDetailField: "",
      sortDetailDirection: 1,
      defaultImg: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      filteredDetails: [],
      usersInProject: [],
    };
  },
  mounted() {
    this.fetchUsersInProject(this.project.id);
    this.filteredMembers();
  },
  methods: {
    async deleteEmployeeFromProject(userId) {
      const res = await ProjectService.deleteEmployeeFromProject(this.project.id, userId);
      if (res.status === 204) {
        this.filteredDetails = this.filteredDetails.filter((item) => item.id !== userId);
        Swal.fire({
          icon: "success",
          title: "Xoá thành công!",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Xoá thất bại!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },

    async fetchUsersInProject(projectId) {
      const res = await ProjectService.fetchUsersInProject(projectId);
      if (res.code) {
        this.usersInProject = res.data;
      }
    },

    filteredMembers() {
      this.project.userProjects.forEach(async (project) => {
        const res = await UserService.fetchUserById(project.userId);
        if (res.code === 1010) {
          this.filteredDetails.push(res.data);
        }
      });
    },
    submitForm() {
      // Kiểm tra tính hợp lệ của dữ liệu
      if (!this.newProject.name.trim()) {
        alert("Vui lòng nhập tên dự án.");
        return;
      }
      if (!this.selectedDepartment) {
        alert("Vui lòng chọn bộ phận.");
        return;
      }
      if (!this.newProject.startDate || !this.newProject.endDate) {
        alert("Vui loại chọn ngày bắt đã và ngày kết thúc.");
        return;
      }
      if (this.newProject.startDate > this.newProject.endDate) {
        alert("Ngày bắt đầu phải trước ngày kết thúc.");
        return;
      }
      this.addProject(this.newProject);

      this.resetForm();
      // Đóng modal sau khi lưu
      this.closeModal();
    },
    addProject(project) {
      this.newProject.department = this.selectedDepartment;
      this.addDetailsToNewProject(this.selectedDepartment);
      this.projects.push(project);
    },
    resetForm() {
      const today = this.newProject.startDate; // Giữ lại giá trị ngày mặc định
      this.newProject = {
        name: "",
        department: "",
        startDate: null,
        endDate: null,
        members: [],
      };
      this.newProject.startDate = today; // Khôi phục giá trị ngày mặc định
      this.selectedDepartment = "";
    },
    close() {
      this.$emit("close");
    },
    sortDetail(field) {
      if (this.sortDetailField === field) {
        this.sortDetailDirection *= -1;
      } else {
        this.sortDetailField = field;
        this.sortDetailDirection = 1;
      }
    },
    showAddEmployeeIntoProjectModal() {
      this.isShowAddEmployeeIntoProjectModal = true;
    },
    showAddLeaderIntoProjectModal() {
      this.isShowAddLeaderIntoProjectModal = true;
    },

    closeAddEmployeeIntoProjectModal() {
      this.isShowAddEmployeeIntoProjectModal = false;
    },
    closeAddLeaderIntoProjectModal() {
      this.isShowAddLeaderIntoProjectModal = false;
    },
    addEmployee() {
      this.closeAddEmployeeIntoProjectModal();
      location.reload();
    },
    addLeader() {
      this.closeAddLeaderIntoProjectModal()
      location.reload();
    }
  },
};
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Modal Container */
.modal-container {
  background-color: #fff;
  border-radius: 8px;
  width: 80%;
  max-width: 1200px;
  padding: 20px;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: auto;
  height: 800px;
  overflow-y: auto;
}

.close-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  position: absolute;
  top: 10px;
  right: 10px;
}

.close-btn:hover {
  background-color: #c82333;
}

.close-btn i {
  font-size: 20px;
}

.avatar-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.member-search-bar {
  margin-top: 50px;
  width: calc(100% - 50px);
  padding: 8px;
}

.member-table {
  border-collapse: collapse;
  width: 100%;
  max-width: 100%;
  background-color: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
}

.member-table thead {
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 1000;
  background-color: #17a2b8;
}

.member-table-container {
  max-height: 600px;
  overflow-y: auto;
  width: 100%;
  margin: 0 auto;
  position: relative;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}

.members-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.member-header {
  width: 100%;
  margin-bottom: 10px;
}

.member-table-container::-webkit-scrollbar {
  display: none;
}

.member-table td {
  font-size: 16px;
}

.member-table tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.member-table tr:hover {
  background-color: #e9ecef;
}

.member-table tr:nth-child(even) {
  background-color: #f1f3f5;
}

.member-table th,
.member-table td {
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
  text-align: center;
}

.member-table th {
  background-color: #17a2b8;
  color: white;
  font-weight: 600;
  font-size: 18px;
  text-transform: uppercase;
  cursor: pointer;
}

.member-table td {
  padding: 16px;
  border-bottom: 1px solid #dee2e6;
  font-size: 16px;
  height: 40px;
}

.member-search-bar {
  width: 300px;
  border-radius: 25px;
  border: 1px solid #ddd;
  outline: none;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease;
}

.member-search-bar:focus {
  border-color: #007bff;
}

.small-col {
  width: 50px;
  text-align: center;
}

.search-bar {
  padding: 10px;
  width: 350px;
  border-radius: 25px;
  border: 1px solid #ddd;
  outline: none;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease;
}

.project-table td {
  position: relative;

}

.project-table td .menu-container {
  margin: 0 auto;
  /* Center align if necessary */
}

.project-table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100% !important;
  max-height: 1000vh;
  text-align: left;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  position: relative;
}

.project-table th,
.project-table td {
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
  text-align: center;
}

.project-table th {
  vertical-align: middle;
  background-color: #000066;
  color: white;
  font-weight: 600;
  font-size: 18px;
  cursor: pointer;
}

.project-table tr:hover {
  background-color: #f9f9f9;
}

.project-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.project-table td.project-name {
  font-weight: bold;
  transition: color 0.3s ease, background-color 0.3s ease;
}

.project-table td.project-name:hover {
  color: #007bff;
  background-color: #f0f8ff;
  cursor: pointer;
}
</style>
