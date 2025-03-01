<template>
  <div v-if="isVisible" class="modal-backdrop">
    <div class="modal fade show" tabindex="-1" id="myModal1" aria-hidden="false" style="display: block">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header" style="border-bottom: solid 0.05em gray">
            <h5 class="modal-title">Thêm mới nhân viên</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body" style="border-bottom: solid 0.05em gray">
            <form ref="employeeForm" class="form" @submit.prevent="submitForm">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="employeeName" class="form-label">Họ tên</label>
                  <input type="text" class="form-control" id="employeeName" v-model="employee.name" required
                    placeholder="Ví dụ: Hồ Xuân Đại" />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="employeeDepartment" class="form-label">Phòng ban</label>
                  <select class="form-select" v-model="employee.departmentId" id="employeeDepartment" required>
                    <option value="" disabled required>---- Vui lòng chọn ----</option>
                    <option v-for="(value, key) in departments" :key="key" :value="value.id">
                      {{ value.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="username" class="form-label">Tên đăng nhập</label>
                  <input type="text" class="form-control" id="username" v-model="employee.username"
                    autocomplete="username" required pattern="[a-zA-Z0-9]+" title="Tên đăng nhập chỉ chứa chữ cái và số"
                    placeholder="Ví dụ: daihx" />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="password" class="form-label">Mật khẩu</label>
                  <input type="password" class="form-control" id="password" v-model="employee.password"
                    autocomplete="current-password" required minlength="6" placeholder="Mật khẩu ít nhất 6 ký tự" />
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="text" class="form-control" id="email" v-model="employee.email" autocomplete="email"
                    placeholder="Ví dụ: 0vqXv@example.com" />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="phoneNumber" class="form-label">PhoneNumber</label>
                  <input type="text" class="form-control" id="phoneNumber" v-model="employee.phoneNumber"
                    autocomplete="phoneNumber" placeholder="Ví dụ: 0987654321" />
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="employeePosition" class="form-label">Vị trí</label>
                  <select class="form-select" v-model="employee.position">
                    <option value="" disabled required>---- Vui lòng chọn ----</option>
                    <option v-for="(value, key) in positions" :key="key" :value="key">
                      {{ value }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="level" class="form-label">Cấp bậc</label>
                  <select class="form-select" v-model="employee.level" required>
                    <option value="" disabled required>---- Vui lòng chọn ----</option>
                    <option v-for="level in [1, 2, 3, 4, 5]" :key="level" :value="level">
                      {{ level }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="employeeGender" class="form-label">Gender</label>
                  <select class="form-select" v-model="employee.gender">
                    <option value="" disabled required>---- Vui lòng chọn ----</option>
                    <option v-for="(value, key) in genders" :key="key" :value="key">
                      {{ value }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="date" class="form-label">Ngày vào công ty</label>
                  <input type="date" class="form-control" id="date" v-model="employee.dob" required />
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" @click="addEmployee2">
              Thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <LoadingOverlay :isLoading="isLoading" />
</template>

<script>
import UserService from "@/services/UserService";
import Swal from "sweetalert2";
import EPosition from "@/model/enum/EPosition";
import EGender from "@/model/enum/EGender";
import EDepartment from "@/model/enum/EDepartment";

export default {
  name: "AddEmployee",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      projects: [],
      employee: {
        name: "",
        username: "",
        password: "",
        email: "",
        position: "",
        level: "",
        phoneNumber: "",
        dob: "",
        gender: "",
        departmentId: "",
      },
      selectedImage: null,
      isLoading: false,
      positions: EPosition,
      genders: EGender,
      departments: EDepartment,
    };
  },
  methods: {
    closeModal() {
      this.resetForm();
      this.$emit("close");
    },
    previewImage(event) {
      const file = event.target.files[0];
      this.selectedImage = file;
      this.employee.avatar = URL.createObjectURL(file);
    },

    async addEmployee2() {
      this.isLoading = true;
      const dto = this.employee;
      try {
        const res = await UserService.addUser(dto);
        if (res.code === 201) {
          this.$emit("employee-added");
          Swal.fire({
            title: "Thêm nhân viên thành công!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          this.resetForm();
          setTimeout(() => {
            this.closeModal();
          }, 1500);
        }
      } catch (error) {
        Swal.fire({
          title: "Lỗi!",
          text: "Có lỗi xảy ra khi thêm nhân viên.",
          icon: "error",
          confirmButtonText: "Đóng",
        });
      } finally {
        this.isLoading = false;
      }
    },

    async addEmployee() {
      this.isLoading = true;
      const form = this.$refs.employeeForm;
      if (form.reportValidity()) {
        const newEmployee = JSON.parse(JSON.stringify(this.employee));
        const formData = new FormData();
        for (const key in newEmployee) {
          if (key === "avatar") continue;
          formData.append(key, newEmployee[key]);
        }
        formData.append("avatar", this.selectedImage);

        try {
          const res = await UserService.addUser(formData);
          if (res.code === 201) {
            this.$emit("employee-added");
            Swal.fire({
              title: "Thêm nhân viên thành công!",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });

            this.resetForm();
            setTimeout(() => {
              this.closeModal();
            }, 1500);
          }
        } catch (error) {
          Swal.fire({
            title: "Lỗi!",
            text: "Có lỗi xảy ra khi thêm nhân viên.",
            icon: "error",
            confirmButtonText: "Đóng",
          });
        } finally {
          this.isLoading = false;
        }
      }
    },

    submitForm() {
      const newEmployee = JSON.parse(JSON.stringify(this.employee));
      this.$emit("add-employee", newEmployee);
    },
    resetForm() {
      this.employee = {};
    },
  },
};
</script>
<style scoped>
label {
  font-size: large;
}

.img-thumbnail {
  width: 30%;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
