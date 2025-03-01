<template>
  <div style="border-bottom: solid gray">
    <h2 class="tw-text-center tw-font-semibold tw-text-2xl tw-h-12 tw-leading-10">Quản lý danh sách dự án</h2>
  </div>
  <div class="container">
    <div class="navbar navbar-light d-flex flex-row justify-content-between" style="width: 100%">
      <!-- Search Bar -->
      <input type="text" v-model="searchQuery" placeholder="Tìm kiếm tên dự án hoặc bộ phận..." class="search-bar" />
      <button class="btn btn-success me-3" @click="showModalAddProject">
        Thêm dự án
      </button>
    </div>
    <div class="table-responsive-md" style="height:75vh; width: 100%;">
      <!-- Table -->
      <table class="table project-table table-hover table-bordered">
        <thead>
          <tr>
            <th style="width: 30px;" scope="col">STT</th>
            <th @click="sort('name')" scope="col">Dự án</th>
            <th scope="col">Số lượng thành viên</th>
            <th scope="col">Ngày bắt đầu</th>
            <th scope="col">Ngày kết thúc</th>
            <th style="width: 200px;" scope="col">Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(project, index) in paginatedProjects" :key="project.id">
            <td>
              {{ (currentPageProjects - 1) * pageSizeProjects + index + 1 }}
            </td>
            <td class="project-name text-start" @click="showProjectDetailsModal(project)">
              {{ project.name }}
            </td>
            <td>{{ project.userProjects.length }}</td>
            <td>{{ project.startDay }}</td>
            <td>{{ project.endDay }}</td>
            <td>
              <button type="button" class="btn btn-warning me-3" @click="showUpdateProjectModal(project)">
                Cập nhật
              </button>
              <button type="button" class="btn btn-danger" @click="deleteProject(project.id)">
                Xoá
              </button>
            </td>
          </tr>
        </tbody>
      </table>


    </div>
    <!-- Pagination -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPageProjects === 1" class="pagination-btn">
        <i class="fas fa-arrow-left"></i>
      </button>
      <span>Trang {{ currentPageProjects }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPageProjects === totalPages" class="pagination-btn">
        <i class="fas fa-arrow-right"></i>
      </button>
    </div>

    <!-- Add Project Modal -->
    <AddProject v-if="isShowProjectAddModal" @close="closeModalAddproject" @project-fetch="fetchProjects" />
    <!-- Project Detail Modal -->
    <ProjectDetails v-if="isShowProjectDetailsModal" :project="selectedProject" @close="closeProjectDetailsModal" />
    <UpdateProject v-if="isShowProjectUpdateModal" :project="selectedProject" @close="closeModalUpdateProject"
      @project-fetch="fetchProjects" />
  </div>
</template>

<script>
import AddProject from "./components/AddProject.vue";
import UpdateProject from "./components/UpdateProject.vue";
import ProjectDetails from "./components/ProjectDetails.vue";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "ProjectsManage",
  components: {
    AddProject,
    ProjectDetails,
    UpdateProject,
  },
  data() {
    return {
      apiUrl: import.meta.env.TECH__SERVER_URL,
      isShowProjectAddModal: false,
      isShowProjectDetailsModal: false,
      isShowProjectUpdateModal: false,
      searchQuery: "",
      tableSearchQuery: "",
      currentPageProjects: 1,
      currentPageEmployees: 1,
      currentPageDetails: 1,
      pageSizeProjects: 10,
      pageSizeEmployees: 10,
      pageSizeDetails: 5,
      sortField: "name",
      sortDirection: 1,
      sortDetailField: "nameNV",
      sortDetailDirection: 1,
      activeMenu: null,
      activeProject: null,
      activeDetail: null,
      isModalVisible: false,
      projects: [],
      selectedDepartment: "",
      selectedEmployees: [],
      selectedProject: null,
      selectedProjectDetails: [],
      showAddEmployee: false,
      previousSelectedProject: null,
    };
  },
  mounted() {
    this.fetchProjects();
  },
  computed: {
    filteredProjects() {
      let filtered = this.projects.filter((project) => {
        const lowerCaseQuery = this.searchQuery.toLowerCase();
        return project.name.toLowerCase().includes(lowerCaseQuery);
      });

      filtered.sort((a, b) => {
        return (
          this.sortDirection *
          a[this.sortField]
            .toLowerCase()
            .localeCompare(b[this.sortField].toLowerCase())
        );
      });

      return filtered;
    },
    paginatedProjects() {
      const start = (this.currentPageProjects - 1) * this.pageSizeProjects;
      return this.filteredProjects.slice(start, start + this.pageSizeProjects);
    },
    totalPages() {
      return Math.ceil(this.filteredProjects.length / this.pageSizeProjects);
    },
  },
  methods: {
    async fetchProjects() {
      try {
        const response = await axios.get(this.apiUrl + "/api/projects");
        this.projects = response.data.data;
      } catch (error) {
        console.error("Error fetching projetcs:", error);
      }
    },
    async deleteProject(projectId) {
      const result = await Swal.fire({
        title: "Bạn có chắc chắn muốn xóa dự án này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        reverseButtons: true,
      });
      if (result.isConfirmed) {
        try {
          await axios.delete(`${this.apiUrl}/api/projects/${projectId}`);
          this.fetchProjects();
          Swal.fire({
            title: "Đã xóa dự án!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          Swal.fire({
            title: "Lỗi!",
            text: "Đã xảy ra lỗi khi xóa dự án.",
            icon: "error",
            confirmButtonText: "Đóng",
          });
        }
      }
    },

    showUpdateProjectModal(project) {
      this.selectedProject = project;
      console.log("Selected project ID:", project.id);
      this.isShowProjectUpdateModal = true;
    },
    closeModalUpdateProject() {
      this.isShowProjectUpdateModal = false;
      this.selectedProject = null;
    },

    showModalAddProject() {
      this.isShowProjectAddModal = true;
    },
    closeModalAddproject() {
      this.isShowProjectAddModal = false;
    },
    showProjectDetailsModal(project) {
      this.selectedProject = project;
      this.isShowProjectDetailsModal = true;
    },
    closeProjectDetailsModal() {
      this.isShowProjectDetailsModal = false;
      this.selectedProject = null;
    },

    addEmployeeToProject(employeeDetails) {
      if (this.selectedProject) {
        this.selectedProject.details.push(...employeeDetails);
      }
      this.closeAddEmployeeIntoProjectModal();
    },
    // Hàm lọc dự án theo department và thêm details vào project mới
    addDetailsToNewProject(department) {
      const filteredProjects = this.projects.filter(
        (project) => project.department === department
      );
      const mergedDetails = filteredProjects.flatMap(
        (project) => project.details
      );
      this.newProject.details = mergedDetails;
    },

    sort(field) {
      if (this.sortField === field) {
        this.sortDirection *= -1;
      } else {
        this.sortField = field;
        this.sortDirection = 1;
      }
    },
    closeAddEmployeeModal() {
      this.showAddEmployee = false;
      if (this.previousSelectedProject) {
        this.selectedProject = this.previousSelectedProject;
        this.previousSelectedProject = null; // Clear the stored project
      }
    },
    toggleMenu(type, item) {
      if (type === "project") {
        if (this.activeProject === item) {
          this.activeProject = null; // Close the menu if clicked again
        } else {
          this.activeProject = item;
          this.activeMenu = "project";
          this.activeDetail = null; // Close detail menu if open
        }
      } else if (type === "detail") {
        if (this.activeDetail === item) {
          this.activeDetail = null; // Close the menu if clicked again
        } else {
          this.activeDetail = item;
          this.activeMenu = "detail";
          this.activeProject = null; // Close project menu if open
        }
      }
    },
    prevPage() {
      if (this.currentPageProjects > 1) {
        this.currentPageProjects -= 1;
      }
    },
    nextPage() {
      if (this.currentPageProjects < this.totalPages) {
        this.currentPageProjects += 1;
      }
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  --bs-gutter-x: 0;
}

.menu-container {
  position: relative;
}

.menu-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #007bff;
  /* Màu nút */
  z-index: 1;
  transition: color 0.3s ease;
}

.menu-btn:hover {
  color: #0056b3;
  /* Màu nút khi hover */
}

.menu-dropdown {
  position: absolute;
  top: -50%;
  left: 60%;
  display: none;
  z-index: 2;
  padding: 5px;
  min-width: 50px;
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: 0;
  transform: translateY(-10px);
}

.menu-dropdown.show {
  display: block;
  opacity: 1;
  transform: translateY(0);
  border: 1px solid white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.menu-item {
  padding: 5px 10px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  text-align: left;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.menu-item:hover {
  background-color: #007bff;
  color: white;
}

.menu-item i {
  margin-right: 8px;
}

.project-table td {
  position: relative;
  /* padding: 5px; */
  /* height: 40px; */
}

.project-table td .menu-container {
  margin: 0 auto;
  /* Center align if necessary */
}

.top-bar {
  display: flex;
  justify-content: flex-start;
  width: 100%;

}

.search-bar {
  padding: 10px !important;
  width: 350px;
  border-radius: 25px;
  border: 1px solid #ddd;
  outline: none;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease;
}

.search-bar:focus {
  border-color: #007bff;
}

.project-table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
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

.pagination span {
  margin-top: 30px;
}

.pagination-btn {
  margin: 10px 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.pagination-btn:hover {
  background-color: #0056b3;
}

.pagination-btn:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

button,
.search-bar {
  transition: box-shadow 0.2s ease, background-color 0.2s ease;
}

.modal.show {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-body input {
  background-color: #fff;
  width: 100%;
}

.detail-table tr:hover {
  background-color: #e9ecef;
}

.detail-table tr:nth-child(even) {
  background-color: #f1f3f5;
}

.avatar-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

/* .add-btn2 {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius:1rem;
    width: 150px;
    height: 50px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    margin: 0 auto;
    padding: 20px 10px ;
  } */
</style>
