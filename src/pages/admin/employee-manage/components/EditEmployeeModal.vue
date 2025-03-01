<template>
  <div v-if="isVisible1" class="modal-backdrop">
    <div class="modal fade show " tabindex="-1" id="myModal" aria-hidden="false" style="display: block; ">
      <div class="modal-dialog ">
        <div class="modal-content">
          <div class="modal-header" style=" border-bottom: solid 0.05em gray;">
            <h5 class="modal-title">Sửa thông tin</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body " style=" border-bottom: solid 0.05em gray;">
            <form ref="employeeForm" class="form" @submit.prevent="updateUser">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="employeeName" class="form-label">Họ tên</label>
                  <input type="text" class="form-control" id="employeeName" v-model="employee.name" required
                    placeholder="Ví dụ: Hồ Xuân Đại" />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="employeeDepartment" class="form-label">Phòng ban</label>
                  <select class="form-select" v-model="employee.departmentId" id="employeeDepartment" required>
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
                    autocomplete="username" required pattern="[a-zA-Z0-9]+"
                    title="Tên đăng nhập chỉ chứa chữ cái và số">
                </div>
                <div class="col-md-6 mb-3">
                  <label for="password" class="form-label">Mật khẩu</label>
                  <input type="password" class="form-control" id="password" v-model="employee.password"
                    autocomplete="current-password" required minlength="6">
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="employeePosition" class="form-label">Chức vụ</label>
                  <select class="form-select" v-model="employee.rank.position.name">
                    <option v-for="(value, key) in positions" :key="key" :value="key">
                      {{ value }}
                    </option>
                  </select>

                </div>
                <div class="col-md-6 mb-3">
                  <label for="level" class="form-label">Cấp bậc</label>
                  <select class="form-select" v-model="employee.rank.level" required>
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
                    <option v-for="(value, key) in genders" :key="key" :value="key">
                      {{ value }}
                    </option>
                  </select>

                </div>
                <div class="col-md-6 mb-3">
                  <label for="date" class="form-label">Ngày vào công ty</label>
                  <input type="date" class="form-control" id="date" v-model="employee.dob" required>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" @click="updateUser()">Cập nhật
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EDepartment from '@/model/enum/EDepartment';
import EGender from '@/model/enum/EGender';
import EPosition from '@/model/enum/EPosition';
import UserService from '@/services/UserService';
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'EditEmployeeModal',
  props: {
    isVisible1: {
      type: Boolean,
      default: false
    },
    employeeData: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      employee: { ...this.employeeData },
      apiUrl: import.meta.env.TECH__SERVER_URL,
      positions: EPosition,
      genders: EGender,
      departments: EDepartment,
    };
  },

  watch: {
    employeeData: {
      immediate: true, // Đồng bộ dữ liệu ngay khi component được mount
      handler(newValue) {
        if (newValue) {
          this.employee = { ...newValue };
        }
      }
    }
  },

  methods: {
    closeModal() {
      this.$emit('close');
    },

    async updateUser() {
      this.isLoading = true;

      const employee = {
        name: this.employee.name,
        username: this.employee.username,
        password: this.employee.password,
        email: this.employee.email,
        position: this.employee.rank.position.name,
        level: this.employee.rank.level,
        phoneNumber: this.employee.phoneNumber,
        dob: this.employee.dob,
        gender: this.employee.gender,
        departmentId: this.employee.departmentId,
      };


      try {
        const response = await UserService.updateUser(employee, this.employee.id);
        response.data;
        this.$emit('employee-edited');
        Swal.fire({
          title: 'Sửa nhân viên thành công!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });

        setTimeout(() => {
          this.closeModal();
        }, 1500);

      } catch (error) {
        console.log(error);
        Swal.fire({
          title: 'Lỗi!',
          text: 'Có lỗi xảy ra khi sửa thông tin nhân viên.',
          icon: 'error',
          confirmButtonText: 'Đóng'
        });
      }
    },

    async submitForm() {
      const form = this.$refs.employeeForm;
      if (form.reportValidity()) {
        const updatedEmployee = JSON.parse(JSON.stringify(this.employee));
        try {
          const response = await axios.put(this.apiUrl + `/api/users/${this.employee.id}`, updatedEmployee);
          response.data;
          this.$emit('employee-added');
          Swal.fire({
            title: 'Thêm nhân viên thành công!',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });

          this.resetForm();
          setTimeout(() => {
            this.closeModal();
          }, 1500);

        } catch (error) {
          console.log(error);
          Swal.fire({
            title: 'Lỗi!',
            text: 'Có lỗi xảy ra khi sửa thông tin nhân viên.',
            icon: 'error',
            confirmButtonText: 'Đóng'
          });
        }
      }
    },
    previewImage(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.employee.avatar = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
  },
};
</script>

<style scoped>
label {
  font-size: large;
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

.img-thumbnail {
  width: 30%;
}
</style>
