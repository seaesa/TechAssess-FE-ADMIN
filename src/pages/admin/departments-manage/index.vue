<template>
  <div style="border-bottom: solid gray">
    <h2 class="tw-text-center tw-font-semibold tw-text-2xl tw-h-12 tw-leading-10">Quản lý phòng ban</h2>
  </div>
  <div class="content">
    <nav class="navbar navbar-light">
      <input type="text" v-model="searchQuery" placeholder="Tìm kiếm phòng ban..." class="search-bar" />
      <button class="btn btn-success me-3" type="button" @click="openAddDepartmentModal">
        Thêm phòng ban
      </button>
    </nav>
    <div class="table-responsive-md" style="height: 75vh; width: 100%;">
      <table class="table table-hover table-bordered department-table">
        <thead>
          <tr>
            <th style="width: 30px;" scope="col">STT</th>
            <th scope="col">Tên phòng ban</th>
            <th style="width: 200px;" scope="col">Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(department, index) in paginatedDepartments" :key="department.id">
            <td>{{ index + 1 }}</td>
            <td class="text-start">{{ department.name }}</td>
            <td>
              <a type="button" class="btn btn-warning me-3" @click="editDepartments(department)">Sửa</a>
              <button type="button" class="btn btn-danger" @click="confirmDeleteDepartments(department.id)">
                Xoá
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination-wrapper">
      <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">
        <i class="fas fa-arrow-left"></i>
      </button>
      <span>Trang {{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">
        <i class="fas fa-arrow-right"></i>
      </button>
    </div>

    <!-- Modal Component -->
    <AddDepartmentModal :is-visible="isAddDepartmentModalVisible" @close="closeAddDepartmentModal"
      @department-added="fetchDepartments" />
    <EditDepartmentsModal :is-visible1="isModalVisible1" :departmentsData="selectedDepartment"
      @close="closeDepartmentsEditModal" @department-edited="fetchDepartments" />
  </div>
</template>

<script>
import EditDepartmentsModal from "./components/EditDepartmentsModal.vue";
import Swal from "sweetalert2";
import DepartmentsService from "@/services/DepartmentsService";
import AddDepartmentModal from "./components/AddDepartmentModal.vue";
import { toast } from "vue3-toastify";

export default {
  components: {
    EditDepartmentsModal,
    AddDepartmentModal,
  },
  data() {
    return {
      isModalVisible1: false,
      isAddDepartmentModalVisible: false,
      departments: [], // Danh sách phòng ban
      selectedDepartmentId: 0, // ID của phòng ban được chọn
      selectedDepartment: null, // Object của phòng ban được chọn
      currentPage: 1,
      itemsPerPage: 10,
      searchQuery: "",
    };
  },
  mounted() {
    this.fetchDepartments(); // Lấy danh sách phòng ban khi component được mount
  },
  computed: {
    totalPages() {
      return Math.ceil(this.departments.length / this.itemsPerPage);
    },
    filteredDepartments() {
      return this.departments.filter((department) =>
        this.fetchUnsigned(department.name).includes(this.fetchUnsigned(this.searchQuery))
      );
    },

    paginatedDepartments() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredDepartments.slice(start, end);
    },
  },
  methods: {
    fetchUnsigned(str) {//tìm kiếm khoogn dấu
      if (typeof str !== "string") return "";
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    },
    // Lấy danh sách phòng ban từ API
    async fetchDepartments() {
      try {
        const response = await DepartmentsService.fetchDepartment();
        if (response.status === 200) {
          this.departments = response.data.data.filter(
            (department) => department.deleted !== true
          );
          if (this.departments.length > 0) {
            this.selectedDepartmentId = this.departments[0].id;
            // this.handleDepartmentChange();
          }
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    },

    editDepartments(department) {
      this.selectedDepartment = { ...department };
      this.isModalVisible1 = true;
    },

    async confirmDeleteDepartments(id) {
      const result = await Swal.fire({
        title: "Bạn có muốn xóa phòng ban này?",
        icon: "warning",
        showCancelButton: true,
      });
      if (result.isConfirmed) {
        try {
          const res = await DepartmentsService.deletedDepartments(id);
          if (res.status === 204) {
            toast.success("Phòng ban đã được xóa thành công.", {
              autoClose: 2000,
            });
            await this.fetchDepartments();
          }
        } catch (error) {
          console.error("Lỗi khi xóa phòng ban:", error);
          Swal.fire({
            title: "Lỗi!",
            text: "Đã xảy ra lỗi khi xóa phòng ban.",
            icon: "error",
          });
        }
      }
    },

    openAddDepartmentModal() {
      this.isAddDepartmentModalVisible = true;
    },

    closeAddDepartmentModal() {
      this.isAddDepartmentModalVisible = false;
    },

    closeDepartmentsEditModal() {
      this.isModalVisible1 = false;
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    goToPage(page) {
      this.currentPage = page;
    },
  },
};
</script>

<style scoped>
.dropdown-toggle {
  color: #007bff;
  font-weight: bold;
  text-decoration: none;
  padding: 0.5em 1em;
  cursor: pointer;
}

.dropdown:hover .dropdown-menu {
  display: block;
  margin-top: 0;
}

.dropdown-toggle::after {
  display: none;
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

.department-table {
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

.department-table th,
.department-table td {
  /* padding: 7px; */
  vertical-align: middle;
  border-bottom: 1px solid #f0f0f0;
  text-align: center;
}

.department-table th {
  background-color: #000066;
  color: white;
  font-weight: 600;
  font-size: 18px;
  cursor: pointer;
}

.department-table tr:hover {
  background-color: #f9f9f9;
}

.department-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
}

.pagination-wrapper span {
  margin-top: 28px;
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
</style>
