<template>
  <div style="border-bottom: solid gray">
    <h2 class="tw-text-center tw-font-semibold tw-text-2xl tw-h-12 tw-leading-10">Quản lý danh sách nhân viên</h2>
  </div>
  <div class="content">
    <nav class="navbar navbar-light ">
      <div class="top-bar d-flex flex-row justify-content-between" style="width: 100%;">
        <!-- Search Bar -->
        <input v-model="searchQuery" type="text" placeholder="Tìm kiếm tên nhân viên..." class="search-bar" />
        <button class="btn btn-success me-3" type="button" @click="openModal">
          Thêm nhân viên
        </button>
      </div>
    </nav>
    <div class="table-responsive-md " style="height: 75vh;width: 100%;">
      <table class="table table-hover table-bordered employee-table">
        <thead>
          <tr>
            <th style="width: 30px;" scope="col">STT</th>
            <th scope="col">Ảnh đại diện</th>
            <th scope="col">Tên</th>
            <th scope="col">Vị trí</th>
            <th scope="col">Cấp bậc</th>
            <th scope="col">Dự án hiện tại</th>
            <!-- <th scope="col">Ngày vào công ty</th> -->
            <!-- <th scope="col">Đánh giá</th> -->
            <th style="width: 200px;" scope="col">Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(employee, index) in paginatedEmployees" :key="employee.id">
            <td>{{ index + 1 }}</td>
            <td>
              <img :src="employee.fileInfo ? employee.fileInfo.fileUrl : defaultImg
                " class="employee-img" />
            </td>
            <td class="text-start">{{ employee.name }}</td>
            <td>
              {{
                employee.rank && employee?.rank.position
                  ? employee?.rank.position.name
                  : "N/A"
              }}
            </td>
            <td>{{ employee.rank ? employee.rank.level : "N/A" }}</td>
            <td>
              <!-- Kiểm tra nếu có project -->
              <div class="dropdown" v-if="employee.userProjects?.length > 0" @mouseenter="showProjectList = true"
                @mouseleave="showProjectList = false">
                <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" aria-expanded="false">
                  {{ employee.userProjects.length }} dự án
                </a>
                <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuLink" v-if="showProjectList">
                  <li v-for="project in employee.userProjects" :key="project.id" class="dropdown-item">
                    {{ project.name }}
                  </li>
                </ul>
              </div>

              <!-- Nếu không có project -->
              <div v-else>No Project</div>
            </td>

            <!-- <td>{{ employee.dateJoinCompany }}</td> -->
            <!-- <td class="">
    <button v-if="employee.position == 'Manager'" class="btn btn-primary me-2">Đánh giá</button>
    <button class="btn btn-info">Xem đánh giá</button>
  </td> -->
            <td>
              <a type="button" class="btn btn-warning me-3" @click="editEmployee(employee)">Sửa</a>
              <button type="button" class="btn btn-danger" @click="confirmDeleteEmployee(employee.id)">
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
    <AddEmployeeModal :isVisible="isModalVisible" @close="closeModal" @employee-added="fetchEmployees" />
    <EditEmployeeModal :is-visible1="isModalVisible1" :employeeData="selectedEmployee" @close="closeEmployeeEditModal"
      @employee-edited="fetchEmployees" />
  </div>
</template>

<script>
import AddEmployeeModal from "./components/AddEmployeeModal.vue";
import EditEmployeeModal from "./components/EditEmployeeModal.vue";
import Swal from "sweetalert2";
import UserService from "@/services/UserService";
import ProjectService from "@/services/ProjectService";

export default {
  components: {
    AddEmployeeModal,
    EditEmployeeModal,
  },
  data() {
    return {
      isModalVisible: false,
      isModalVisible1: false,
      selectedEmployee: null,
      employees: [],
      projects: [],
      currentPage: 1,
      itemsPerPage: 10,
      defaultImg: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      showProjectList: false,
      searchQuery: "",
    };
  },
  mounted() {
    const dropdownLink = document.getElementById("dropdownMenuLink");
    if (dropdownLink) {
      dropdownLink.classList.add("dropdown-toggle"); // Bảo đảm phần tử đã có class cần thiết
    }
    this.fetchEmployees();
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
    },

    filteredEmployees() {
      return this.employees.filter((employee) =>
        this.fetchUnsigned(employee.name).includes(this.fetchUnsigned(this.searchQuery))
      );
    },

    paginatedEmployees() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredEmployees.slice(start, end);
    }
  },
  methods: {
    fetchUnsigned(str) {//tìm kiếm khoogn dấu
      if (typeof str !== "string") return "";
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    },
    async fetchEmployees() {
      try {
        const response = await UserService.fetchUsers();
        if (response.code === 1010) {
          this.employees = response.data.filter(
            (employee) => employee.deleted !== true
          );
        }
        // Tạo một danh sách để lưu trữ các dự án
        const fetchProjectPromises = this.employees.map(async (employee) => {
          const projectPromises = employee.userProjects.map(async (record) => {
            const res = await ProjectService.fetchProjectById(record.projectId);
            if (res.code === 1010) {
              // Thay vì push vào userProjects, nên thay thế hoặc thêm vào một danh sách riêng
              return res.data; // Trả về dữ liệu dự án
            }
          });

          // Chờ tất cả các dự án được fetch xong
          const projects = await Promise.all(projectPromises);
          // Lọc ra các dự án hợp lệ và thêm vào userProjects
          employee.userProjects = projects.filter(
            (project) => project !== undefined
          );
        });

        // Chờ tất cả các nhân viên được xử lý
        await Promise.all(fetchProjectPromises);
        console.log(this.employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    },

    async confirmDeleteEmployee(id) {
      const result = await Swal.fire({
        title: "Bạn có muốn xóa nhân viên này?",
        icon: "warning",
        showCancelButton: true,
      });
      if (result.isConfirmed) {
        try {
          const res = await UserService.deletedUser(id);
          if (res.code === 1012) {
            Swal.fire({
              title: "Đã xóa!",
              text: "Nhân viên đã được xóa thành công.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
            this.fetchEmployees(); // Cập nhật lại danh sách nhân viên
          }
        } catch (error) {
          console.error("Lỗi khi xóa nhân viên:", error);
          Swal.fire({
            title: "Lỗi!",
            text: "Đã xảy ra lỗi khi xóa nhân viên.",
            icon: "error",
          });
        }
      }
    },
    openModal() {
      this.isModalVisible = true;
    },
    showEmployeeEditModal() {
      this.isModalVisible1 = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    closeEmployeeEditModal() {
      this.isModalVisible1 = false;
    },
    editEmployee(employee) {
      this.selectedEmployee = { ...employee };
      this.showEmployeeEditModal();
    },
    handleUpdate(updatedEmployee) {
      const index = this.DataTest.findIndex(
        (emp) => emp.id === updatedEmployee.id
      );
      if (index !== -1) {
        this.DataTest.splice(index, 1, updatedEmployee);
      }
      this.closeEmployeeEditModal();
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
    addEmployee(newEmployee) {
      this.DataTest.push(newEmployee);
      console.log(newEmployee);
      this.closeModal();
    },
  },
};
</script>
<style scoped>
.dropdown-toggle {
  color: #007bff;
  /* Màu chữ */
  font-weight: bold;
  /* Kiểu chữ đậm */
  text-decoration: none;
  /* Xóa gạch chân */
  padding: 0.5em 1em;
  /* Khoảng cách padding */
  cursor: pointer;
}

/* Hiển thị dropdown khi hover */
.dropdown:hover .dropdown-menu {
  display: block;
  margin-top: 0;
  /* Đảm bảo không có khoảng cách */
}

/* Đảm bảo nút dropdown được hiển thị đúng */
.dropdown-toggle::after {
  display: none;
  /* Ẩn dấu mũi tên nếu cần */
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

.search-bar:focus {
  border-color: #007bff;
}

.employee-table {
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

.employee-table th,
.employee-table td {
  padding: 7px;
  vertical-align: middle;
  border-bottom: 1px solid #f0f0f0;
  text-align: center;
}

.employee-table th {
  background-color: #000066;
  color: white;
  font-weight: 600;
  font-size: 20px;
  cursor: pointer;
}

.employee-table tr:hover {
  background-color: #f9f9f9;
}

.employee-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.employee-table td.project-name {
  transition: color 0.3s ease, background-color 0.3s ease;
}

.employee-table td.project-name:hover {
  color: #007bff;
  background-color: #f0f8ff;
  cursor: pointer;
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

.employee-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
</style>
