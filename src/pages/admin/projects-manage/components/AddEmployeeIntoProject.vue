<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-container">
      <div class="modal-header d-flex justify-content-between">
        <h2 class="modal-title">Thêm nhân viên vào dự án {{ project.name }}</h2>
        <button class="btn-close text-end" @click="close"></button>
      </div>
      <div class="search-container">
        <input type="text" v-model="tableSearchQuery" placeholder="Tìm kiếm tên nhân viên hoặc bộ phận hoặc chức vụ"
          class="search-bar" />
      </div>
      <div class="table-container">
        <table class="table project-table table-hover table-bordered">
          <thead>
            <tr>
              <th class="checkbox">Chọn</th>
              <th style="width: 150px">Ảnh đại diện</th>
              <th style="width: 350px">Tên</th>
              <th>Vị trí</th>
              <th>Cấp bậc</th>
              <th>Ngày vào công ty</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedEmployees" :key="index">
              <td class="text-center">
                <input class="form-check-input" type="checkbox" :checked="selectedEmployees.includes(index)"
                  @click="toggleEmployee(index)" />
              </td>
              <td>
                <img :src="item.fileInfo ? item.fileInfo.fileUrl : defaultImg" class="employee-img" />
              </td>
              <td>{{ item.name }}</td>
              <td>
                {{
                  item.rank && item.rank.position
                    ? item.rank.position.name
                    : "N/A"
                }}
              </td>
              <td>{{ item.rank ? item.rank.level : "N/A" }}</td>
              <td>{{ item.dateJoinCompany }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="buttons">
        <button class="btn btn-success" @click="addEmployees">Xác nhận</button>
      </div>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">
          <i class="fas fa-arrow-left"></i>
        </button>
        <span>Trang {{ currentPage }} / {{ totalEmployeePages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalEmployeePages" class="pagination-btn">
          <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "AddEmployeeIntoProject",
  props: {
    showAddEmployee: {
      type: Boolean,
      required: true,
    },
    project: {
      type: Object,
      required: true,
    },
    filteredDetails: {
      type: Array,
      required: true,
    },
  },
  emits: ["close", "add"],
  data() {
    return {
      apiUrl: import.meta.env.TECH__SERVER_URL,
      tableSearchQuery: "",
      selectedEmployees: [], // Store selected employee indices
      currentPage: 1,
      pageSize1: 10,
      employees: [],
      defaultImg: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    };
  },
  mounted() {
    this.fetchEmployees();
  },
  computed: {
    filteredEmployees() {
      const lowerCaseQuery = this.tableSearchQuery.toLowerCase();
      return this.employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(lowerCaseQuery) ||
          employee.department.toLowerCase().includes(lowerCaseQuery) ||
          employee.role.toLowerCase().includes(lowerCaseQuery)
      );
    },
    paginatedEmployees() {
      const start = (this.currentPage - 1) * this.pageSize1;
      return this.filteredEmployees.slice(start, start + this.pageSize1);
    },
    totalEmployeePages() {
      return Math.ceil(this.filteredEmployees.length / this.pageSize1);
    },
  },
  methods: {
    async fetchEmployees() {
      try {
        const response = await axios.get(this.apiUrl + "/api/users");
        this.employees = response.data.data.filter(
          (employee) =>
            employee.deleted !== true &&
            !this.filteredDetails.map((user) => user.id).includes(employee.id)
        );
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    },
    async addEmployees() {
      const employeeIds = this.selectedEmployees.map(
        (index) => this.employees[index].id
      );
      const leaderId = employeeIds[0];
      console.log("id lerder: ", leaderId);

      const requestData = {
        employeeIds: employeeIds,
        leaderId: leaderId,
      };
      try {
        const response = await axios.post(
          `${this.apiUrl}/api/projects/${this.project.id}/employees`,
          requestData
        );
        if (response.data.code === 201) {
          const selectedEmployeeDetails = this.selectedEmployees.map(
            (index) => this.employees[index]
          );
          this.$emit("add", selectedEmployeeDetails);
          this.resetForm();
          this.close();
          Swal.fire({
            title: "Thành công!",
            text: "Thêm thành viên thành công!",
            icon: "success",
            timer: 1500,
          });
        } else {
          console.error(
            "Failed to add employees to project:",
            response.data.message
          );
        }
      } catch (error) {
        console.error(
          "Error adding employees to project:",
          error.response ? error.response.data : error.message
        );
      }
    },
    toggleEmployee(index) {
      if (this.selectedEmployees.includes(index)) {
        this.selectedEmployees = this.selectedEmployees.filter(
          (i) => i !== index
        );
      } else {
        this.selectedEmployees.push(index);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalEmployeePages) {
        this.currentPage += 1;
      }
    },
    close() {
      this.$emit("close");
      this.resetForm();
    },
    resetForm() {
      this.employees = [];
    },
  },
};
</script>

<style scoped>
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

.search-container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.checkbox {
  width: 100px;
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

.table-container {
  height: 470px;
  overflow-y: auto;
}

.employee-table {
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
}

.employee-table th,
td {
  text-align: center;
  padding: 8px;
  border: 1px solid #ddd;
}

.employee-table th {
  background-color: #f2f2f2;
}

.buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination {
  justify-content: center;
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

.search-bar {
  padding: 10px;
  width: 400px;
  border-radius: 25px;
  border: 1px solid #ddd;
  outline: none;
  transition: border-color 0.3s ease;
  margin-top: 10px;
  margin-bottom: 10px;
}

.employee-img {
  width: 35%;
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
