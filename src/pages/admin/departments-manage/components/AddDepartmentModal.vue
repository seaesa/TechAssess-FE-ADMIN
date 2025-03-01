<template>
  <div v-if="isVisible" class="modal-backdrop">
    <div class="modal fade show" tabindex="-1" id="myModal1" aria-hidden="false" style="display: block">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header" style="border-bottom: solid 0.05em gray">
            <h5 class="modal-name">Thêm mới phòng ban</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            <form ref="departmentForm" class="form" @submit.prevent="addDepartment">
              <div class="mb-3">
                <label for="name" class="form-label d-flex text-start">Tên phòng ban</label>
                <input type="text" class="form-control" id="name" v-model="department.name" @blur="validateTitle"
                  :class="{ 'is-invalid': errors.name }" placeholder=" Nhập tên phòng ban" />
                <div v-if="errors.name" class="invalid-feedback">
                  {{ errors.name }}
                </div>
              </div>
            </form>
          </div>

          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" @click="addDepartment">
              Thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DepartmentsService from "@/services/DepartmentsService";
import { toast } from "vue3-toastify";

export default {
  name: "AddDepartmentsModal",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      department: {
        name: "",
      },
      errors: {
        name: null,
      },

      isLoading: false,
      isFormFilled: false,
    };
  },
  methods: {
    closeModal() {
      this.errors.name = null;
      this.resetForm();
      this.$emit("close");
    },
    async addDepartment() {
      this.validateForm();
      if (Object.values(this.errors).every((x) => x === null || x === "")) {
        console.log("Form is valid");
        this.isFormFilled = true;
      }
      if (!this.isFormFilled) {
        return;
      }
      const newDepartment = JSON.parse(JSON.stringify(this.department));
      const formData = new FormData();
      for (const key in newDepartment) {
        formData.append(key, newDepartment[key]);
      }

      try {
        /**
         * @type {ApiResponse}
         */
        const res = await DepartmentsService.addDepartment(formData);
        if (res.code) {
          this.$emit("department-added");
          toast.success("Thêm phòng ban thành công!", {
            autoClose: 2000,
          });
          this.errors.name = null;
          this.closeModal();
          this.resetForm();
        }
      } catch (error) {
        // toast.error(error.response.data.error);
        // return;
        console.log("error.response.data.error : ", error.response.data.error);
        this.errors.name = error.response.data.error;
      } finally {
        // Đảm bảo isLoading sẽ được đặt lại thành false
        this.isLoading = false;
      }
    },
    resetForm() {
      this.department = {};
    },

    validateForm() {
      this.validateTitle();
    },

    validateTitle() {
      if (!this.department.name) {
        this.errors.name = "Vui lòng nhập tên phòng ban";
      } else {
        this.errors.name = null;
      }
    },
  },
};
</script>
<style scoped>
.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875em;
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
